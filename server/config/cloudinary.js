import { v2 as cloudinary } from 'cloudinary';
import logger from './winston.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isCloudinaryConfigured = () => {
  return (
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  );
};

if (isCloudinaryConfigured()) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  logger.info('Cloudinary configured successfully.');
} else {
  logger.warn('Cloudinary environment variables missing. Falling back to local disk storage uploads.');
}

/**
 * Uploads a file (either buffer or path) to Cloudinary or saves to local disk fallback.
 * @param {Object} file - Express Multer file object
 * @returns {Promise<Object>} - Contains secure_url and public_id
 */
export const uploadImage = async (file) => {
  if (isCloudinaryConfigured()) {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'enclave-portal' },
        (error, result) => {
          if (error) {
            logger.error(`Cloudinary upload failed: ${error.message}`);
            reject(error);
          } else {
            resolve({
              secure_url: result.secure_url,
              public_id: result.public_id,
            });
          }
        }
      );
      uploadStream.end(file.buffer);
    });
  } else {
    // Local fallback save
    const uploadsDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const fileExtension = path.extname(file.originalname) || '.jpg';
    const uniqueFilename = `${Date.now()}-${Math.round(Math.random() * 1e9)}${fileExtension}`;
    const filePath = path.join(uploadsDir, uniqueFilename);

    await fs.promises.writeFile(filePath, file.buffer);
    logger.info(`Local file upload fallback succeeded: ${uniqueFilename}`);

    const serverPort = process.env.PORT || 5000;
    // We will return a path relative to the server
    const localUrl = `/uploads/${uniqueFilename}`;

    return {
      secure_url: localUrl,
      public_id: uniqueFilename, // using filename as public_id for local file tracking
    };
  }
};

/**
 * Deletes a file from Cloudinary or local fallback.
 * @param {string} publicId - Cloudinary public_id or local filename
 */
export const deleteImage = async (publicId) => {
  if (!publicId) return;

  if (isCloudinaryConfigured()) {
    try {
      await cloudinary.uploader.destroy(publicId);
      logger.info(`Cloudinary image deleted: ${publicId}`);
    } catch (error) {
      logger.error(`Cloudinary image deletion failed: ${error.message}`);
    }
  } else {
    // Local fallback delete
    const filePath = path.join(__dirname, '../uploads', publicId);
    try {
      if (fs.existsSync(filePath)) {
        await fs.promises.unlink(filePath);
        logger.info(`Local file deleted: ${publicId}`);
      }
    } catch (error) {
      logger.error(`Local file deletion failed for ${publicId}: ${error.message}`);
    }
  }
};
