const path = require("path");

const uploadFile = (req, s3) => {
    let extension = path.extname(req.file.originalname).toLowerCase();
    let fileName = `${req.file.fieldname}-${req.user._id}.${extension}`;
    console.log(req.file);
    return new Promise(async (resolve, reject) => {
        // Setting up S3 upload parameters
        const params = {
            Bucket: "unschool-data",
            ACL: "public-read",
            Key: fileName, // File name you want to save as in S3
            Body: req.file.buffer
        };

        // Uploading files to the bucket
        s3.putObject(params, function(err, data) {
            if (err) {
                reject(err);
            }
            resolve(
                `https://unschool-data.s3.us-east-2.amazonaws.com/${fileName}`
            );
        });
    });
};

module.exports = uploadFile;
