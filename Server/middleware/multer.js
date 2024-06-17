import path, { dirname } from 'path';
import multer from 'multer';
// middleware/multer.js
// const { CloudinaryStorage } = require('multer-storage-cloudinary');
// const cloudinary = require('../config/cloudinary');

// const storage = new CloudinaryStorage({
//     cloudinary: cloudinary,
//     params: {
//         folder: 'your_folder_name', // Optional: specify folder name in Cloudinary
//         allowed_formats: ['jpg', 'png', 'jpeg'], // Optional: specify allowed formats
//     },
// });



const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({ storage: storage });

export default upload;
