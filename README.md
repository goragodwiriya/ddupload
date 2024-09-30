# DragDropUpload.js

## Overview

`DragDropUpload.js` is a lightweight JavaScript library that simplifies the process of file uploads using a drag-and-drop interface. It provides users with an intuitive way to select files, ensuring a smooth and user-friendly experience. This library supports multiple file types, including images and documents, with customizable options for file validation, error handling, and user feedback.

## Features

- **Drag and Drop Support**: Easily drag files into designated drop zones.
- **File Input Support**: Click to select files when drag-and-drop is not available.
- **Customizable Options**: Set maximum file sizes, allowed file types, and custom callbacks for file validation and error handling.
- **User Feedback**: Display messages and previews of selected files, enhancing user interaction.

## Usage

To use `DragDropUpload.js`, include the script in your HTML and initialize it with the desired options. Here’s a quick example:

```html
<script src="path/to/DragDropUpload.js"></script>
<script>
  new DragDropUpload('upload-container', {
    allowedFileTypes: ['image/jpeg', 'image/png', 'application/pdf'],
    maxFileSize: 2 * 1024 * 1024, // 2MB
    onChanged: (file) => {
      console.log(`File selected: ${file.name}`);
    },
    onError: (file, message) => {
      alert(`Error: ${message}`);
    }
  });
</script>
```

## Caution
This project was created by AI. While it aims to provide robust functionality, please use it with caution and ensure to conduct proper testing before deployment in a production environment. Always validate user inputs and handle file uploads securely to protect against potential vulnerabilities.

## License
This project is open-source and available for use under the MIT License. Feel free to modify and distribute it as needed.