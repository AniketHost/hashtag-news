const express = require('express');
const userImage = require('../controller/user-image');

const router = express.Router();

router.post('/UploadImageInServer',userImage.uploadImageInServer);

module.exports = router;
