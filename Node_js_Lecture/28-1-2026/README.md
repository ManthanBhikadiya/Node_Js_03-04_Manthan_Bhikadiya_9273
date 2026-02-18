# Multer File Upload App

This project is a Node.js application that demonstrates how to handle file uploads using the Multer middleware with Express.

## Project Structure

```
multer-file-upload-app
├── src
│   ├── app.js                # Entry point of the application
│   ├── routes
│   │   └── upload.js         # Route for handling file uploads
│   ├── middleware
│   │   └── multer.js         # Configuration for Multer middleware
│   └── controllers
│       └── uploadController.js # Controller for processing uploads
├── uploads                    # Directory for storing uploaded files
├── package.json               # NPM configuration file
└── README.md                  # Project documentation
```

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   ```

2. Navigate to the project directory:
   ```
   cd multer-file-upload-app
   ```

3. Install the dependencies:
   ```
   npm install
   ```

## Usage

1. Start the application:
   ```
   npm start
   ```

2. The application will be running on `http://localhost:3000`.

3. To upload a file, send a POST request to `/upload` with the file included in the form data.

## Dependencies

- Express: A web framework for Node.js
- Multer: A middleware for handling `multipart/form-data`, which is used for uploading files.

## License

This project is licensed under the MIT License.