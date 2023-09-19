//Imports
import multer from "multer";
import cloudinary from "cloudinary";

//Methods

cloudinary.config({
  cloud_name: process.env.CLOUDNAME,
  api_key: process.env.APIKEY,
  api_secret: process.env.APISECRET,
  secure: true,
});

const storage = multer.memoryStorage();

const multerUploads = multer({ storage }).single("image");

/**
 * Upload an image file to a cloud storage using cloudinary library
 * @param {string} filepath - The path of the file to be uploaded
 * @returns {Promise<Object>} A promise that resolves with an object containing
 * the public_id and url of the uploaded image
 * @throws {Error} If there was an error during the upload process
 */
async function uploadImageToCloud(file) {
  //check
  try {
    const uploadedImage = await cloudinary.v2.uploader.upload(file, {
      resource_type: "auto",
      transformation: [
        {
          width: 300,
          height: 300,
          aspect_ratio: "1:1",
          crop: "fill_pad",
          gravity: "auto",
        },
      ],
    });

    const uploadedImageInfo = {
      publicId: uploadedImage.public_id,
      url: uploadedImage.secure_url,
    };

    return uploadedImageInfo;
  } catch (error) {
    throw error;
  }
}

/**
 * Delete an image file in cloud storage using cloudinary library
 * @param {string} publicId - The public id of the file to be deleted
 * @returns {Promise<Object>} A promise that resolves with an object containing
 * the result of the removal
 * @throws {Error} If there was an error during the upload process
 */
async function deleteImageInCloud(publicId) {
  //check
  try {
    const deletedImage = await cloudinary.v2.uploader.destroy(publicId);

    return deletedImage;
  } catch (error) {
    throw error;
  }
}

/**
 * Process the image file, including resizing, uploading to the cloud, and updating the request object
 * @param {Object} req - The request object from the HTTP request
 * @param {Object} res - The response object from the HTTP response
 * @param {Function} next - The next function from Express
 * @returns {void}
 * @throws {Error} If there was an error during the whole process
 */
async function processImage(req, res, next) {
  try {
    if (!req.file) {
      return next();
    }

    const b64 = Buffer.from(req.file.buffer).toString("base64");

    let dataURI = "data:" + req.file.mimetype + ";base64," + b64;

    const cloudInfo = await uploadImageToCloud(dataURI);

    req.file.publicId = cloudInfo.publicId;

    req.file.url = cloudInfo.url;

    return next();
  } catch (error) {
    console.log(error);
    return next(error);
  }
}

//Exports

export { multerUploads, processImage, deleteImageInCloud, uploadImageToCloud };
