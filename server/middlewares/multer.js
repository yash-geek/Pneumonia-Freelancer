import multer from 'multer'
const multerUpload = multer({
    limits:{
    fileSize: 1024 * 1024 * 5,
    },
})
const singleImage = multerUpload.single('picture');
const attachmentMulter = multerUpload.array('gigImages',5);

export {singleImage,attachmentMulter}