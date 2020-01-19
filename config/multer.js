const multer = require("multer");

const AWS = require("aws-sdk");

const s3 = new AWS.S3({
    accessKeyId: "Your access key ID",
    secretAccessKey: "Your secret Access key"
});

// Multer is required to process file uploads and make them available via
// req.files.
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 4 * 1024 * 1024 // no larger than 4mb, you can change as needed.
    }
});

module.exports = {
    upload,
    s3
};
