<?php
// Define configurations
$uploadDir = 'uploads/'; // Directory to store uploaded files
$maxFileSize = 2 * 1024 * 1024; // Maximum file size of 2MB
$allowedFileTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'application/msword']; // Allowed file types

// Function to handle file uploads
/**
 * Handles the upload of a file, validating its size and type.
 *
 * @param array $file The uploaded file data.
 * @param string $newFileName The new file name to save as.
 * @return string A message indicating the result of the upload.
 */
function uploadFile($file, $newFileName)
{
    global $uploadDir, $maxFileSize, $allowedFileTypes;

    // Check for upload errors
    if ($file['error'] !== UPLOAD_ERR_OK) {
        return 'There was an error uploading the file: '.$file['error'];
    }

    // Validate file type
    if (!in_array($file['type'], $allowedFileTypes)) {
        return 'File type not allowed: '.$file['type'];
    }

    // Validate file size
    if ($file['size'] > $maxFileSize) {
        return 'File is too large: '.$file['name'];
    }

    // Create the upload directory if it doesn't exist
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0755, true);
    }

    // Check if the new file name has a valid extension
    $pathInfo = pathinfo($file['name']);
    $fileExtension = $pathInfo['extension'];

    // Validate the new file name extension
    if (empty(pathinfo($newFileName, PATHINFO_EXTENSION))) {
        // If no extension is specified, use the original file's extension
        $newFileName .= '.'.$fileExtension;
    } else {
        // Ensure the new file name has the correct extension
        $newFileName = basename($newFileName); // Prevent directory traversal
        $newFileExtension = pathinfo($newFileName, PATHINFO_EXTENSION);

        if ($newFileExtension !== $fileExtension) {
            // If the extensions don't match, use the original file's extension
            $newFileName = pathinfo($newFileName, PATHINFO_FILENAME).'.'.$fileExtension;
        }
    }

    // Set the final file path
    $uploadFilePath = $uploadDir.$newFileName;

    // Move the uploaded file to the specified directory
    if (move_uploaded_file($file['tmp_name'], $uploadFilePath)) {
        return 'File uploaded successfully: '.htmlspecialchars($newFileName);
    } else {
        return 'There was an error moving the uploaded file';
    }
}

// Check if files were uploaded
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $messages = [];

    foreach ($_FILES as $key => $file) {
        // Get the input name from the container ID
        $inputName = str_replace('upload-container-', 'file_name_', $key);
        // Get the file name from the POST data
        $fileName = $_POST[$inputName];
        // Upload the file and collect messages
        $messages[] = uploadFile($file, $fileName);
    }

    // Display result messages
    foreach ($messages as $message) {
        echo $message.'<br>';
    }
} else {
    echo 'Please upload files';
}
