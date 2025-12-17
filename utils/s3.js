const {
  PutObjectCommand,
  DeleteObjectCommand,
} = require("@aws-sdk/client-s3");
const s3 = require("../config/s3");

/**
 * Upload a file to Amazon S3
 * @param {Object} file - Multer file object (from memoryStorage)
 * @param {string} folder - Folder path in bucket (e.g. sitename/section)
 */
const uploadToS3 = async (file, folder) => {
  const key = `${folder}/${Date.now()}-${file.originalname}`;

  await s3.send(
    new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    })
  );

  return {
    key,
    url: `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`,
  };
};

/**
 * Delete a file from Amazon S3
 * @param {string} key - S3 object key
 */
const deleteFromS3 = async (key) => {
  await s3.send(
    new DeleteObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET,
      Key: key,
    })
  );
};

module.exports = {
  uploadToS3,
  deleteFromS3,
};
