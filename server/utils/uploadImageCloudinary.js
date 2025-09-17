import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_CLOUD_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET_KEY,
});

const uploadImageCloudinary = async (image) => {
  const buffer = image.buffer || Buffer.from(await image.arrayBuffer());

  const uploadImage = await new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "smart" },
      (error, uploadResult) => {
        if (error) {
          console.error("Cloudinary upload error:", error);
          return reject(error);
        }
        return resolve(uploadResult);
      }
    );

    stream.end(buffer);
  });

  return uploadImage;
};

export default uploadImageCloudinary;
