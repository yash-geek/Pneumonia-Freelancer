import multer from 'multer'
const multerUpload = multer({
    limits:{
    fileSize: 1024 * 1024 * 5,
    },
})
const singleImage = multerUpload.single('picture');
const attachmentMulter = multerUpload.single('gigImage');

export {singleImage,attachmentMulter}