/**
 * Class DragDropUpload
 * Handles drag-and-drop or file input upload functionality with file validation.
 * Allows for setting a maximum file size, allowed file types, and custom callbacks.
 */
class DragDropUpload {
  /**
   * Constructor
   * @param {string} containerId - The ID of the container element where the drop zone will be added.
   * @param {Object} options - Configuration options for the uploader.
   * @param {number} [options.maxFileSize=0] - Maximum allowed file size in bytes (0 means no size check).
   * @param {Array} [options.allowedFileTypes=['image/jpeg', 'image/png', 'image/gif', 'image/webp']] - List of allowed MIME types for the files.
   * @param {function} [options.onChanged] - Callback function when a valid file is added.
   * @param {function} [options.onError] - Callback function to handle file error display.
   * @param {boolean} [options.allowCamera=false] - Flag to allow camera usage for file input (default is false).
   */
  constructor(containerId, options = {}) {
    this.dropZone = document.getElementById(containerId);
    this.messageElement = document.createElement('div');
    this.messageElement.className = 'drop-zone-message';
    this.messageElement.innerHTML = this.dropZone.innerHTML;
    this.dropZone.innerHTML = '';
    this.dropZone.appendChild(this.messageElement);

    this.previewElement = document.createElement('div');
    this.previewElement.className = 'drop-zone-preview';
    this.dropZone.appendChild(this.previewElement);

    this.options = {
      maxFileSize: options.maxFileSize || 0,
      allowedFileTypes: options.allowedFileTypes || ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
      onChanged: options.onChanged || (() => {}),
      onError: options.onError || ((file, message) => alert(message)),
      allowCamera: options.allowCamera !== undefined ? options.allowCamera : false
    };

    this.dropZone.className = 'drop-zone';
    this.setupFileInput();
    this.setupEventListeners();
  }

  /**
   * Sets up the hidden file input field with support for capturing images from the camera.
   */
  setupFileInput() {
    this.fileInput = document.createElement('input');
    this.fileInput.type = 'file';
    this.fileInput.multiple = false;
    this.fileInput.style.display = 'none';
    this.fileInput.name = this.dropZone.id;

    if (this.options.allowCamera) {
      this.fileInput.accept = 'image/*';
      this.fileInput.capture = true;
    }

    this.dropZone.appendChild(this.fileInput);
  }

  /**
   * Attaches event listeners to the drop zone and file input.
   */
  setupEventListeners() {
    this.dropZone.addEventListener('click', () => this.fileInput.click());
    this.dropZone.addEventListener('dragover', (e) => this.handleDragOver(e));
    this.dropZone.addEventListener('dragleave', (e) => this.handleDragLeave(e));
    this.dropZone.addEventListener('drop', (e) => this.handleDrop(e));
    this.fileInput.addEventListener('change', () => this.handleFiles(this.fileInput.files));
  }

  /**
   * Handles the 'dragover' event when a file is dragged over the drop zone.
   * @param {Event} e - The dragover event object.
   */
  handleDragOver(e) {
    e.preventDefault();
    e.stopPropagation();
    this.dropZone.classList.add('dragover');
  }

  /**
   * Handles the 'dragleave' event when a file is dragged out of the drop zone.
   * @param {Event} e - The dragleave event object.
   */
  handleDragLeave(e) {
    e.preventDefault();
    e.stopPropagation();
    this.dropZone.classList.remove('dragover');
  }

  /**
   * Handles the 'drop' event when a file is dropped into the drop zone.
   * @param {Event} e - The drop event object.
   */
  handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    this.dropZone.classList.remove('dragover');
    const files = e.dataTransfer.files;

    // Assign dropped files to the input element
    this.assignFilesToInput(files);

    this.handleFiles(files);
  }

  /**
   * Assigns the dropped files to the file input element to ensure they can be submitted.
   * @param {FileList} files - List of files dropped into the drop zone.
   */
  assignFilesToInput(files) {
    // Try assigning the FileList directly (modern browsers)
    try {
      this.fileInput.files = files;
    } catch (error) {
      // Fallback for browsers that don't support direct assignment to input.files
      const dataTransfer = new DataTransfer();
      for (let i = 0; i < files.length; i++) {
        dataTransfer.items.add(files[i]);
      }
      this.fileInput.files = dataTransfer.files;
    }
  }

  /**
   * Processes the files selected by the user or dropped into the drop zone.
   * Validates the file and triggers callbacks based on file validity.
   * @param {FileList} files - List of files to handle.
   */
  handleFiles(files) {
    if (files.length > 0) {
      const file = files[0];
      if (this.validateFile(file)) {
        this.displayFile(file);
        this.options.onChanged(file);
      } else {
        this.fileInput.value = '';
        this.resetDisplay();
      }
    }
  }

  /**
   * Resets the display elements (message and preview) when an invalid file is uploaded.
   */
  resetDisplay() {
    this.messageElement.style.display = 'block';
    this.previewElement.textContent = '';
    this.dropZone.style.backgroundImage = '';
  }

  /**
   * Validates the file based on file size and allowed file types.
   * @param {File} file - The file to validate.
   * @returns {boolean} - Returns true if the file is valid, false otherwise.
   */
  validateFile(file) {
    if (this.options.maxFileSize > 0 && file.size > this.options.maxFileSize) {
      const fileSizeMB = (file.size / 1024 / 1024).toFixed(2);
      this.options.onError(file, `The file ${file.name} is too large (maximum size is ${(this.options.maxFileSize / 1024 / 1024).toFixed(2)}MB). Your file is ${fileSizeMB}MB.`);
      return false;
    } else if (!this.options.allowedFileTypes.includes(file.type) && !this.options.allowedFileTypes.includes('*')) {
      this.options.onError(file, `The file ${file.name} is not a permitted file type.`);
      return false;
    }
    return true;
  }

  /**
   * Displays the selected file in the drop zone.
   * Shows an image preview if the file is an image, or shows the file extension in uppercase if it's a non-image file.
   * @param {File} file - The file to display.
   */
  displayFile(file) {
    this.messageElement.style.display = 'none';
    this.dropZone.style.backgroundRepeat = 'no-repeat';
    this.dropZone.style.backgroundPosition = 'center';
    if (file.type.startsWith('image/')) {
      this.dropZone.style.backgroundImage = `url(${URL.createObjectURL(file)})`;
      this.dropZone.style.backgroundSize = 'cover';
    } else {
      const fileExtension = file.name.split('.').pop().toUpperCase();
      const fileThumb = 'data:image/png;base64,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';
      this.dropZone.style.backgroundImage = 'url(' + fileThumb + ')';
      this.dropZone.style.backgroundSize = '100px';
      this.previewElement.textContent = fileExtension;
    }
  }
}
