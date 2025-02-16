const multer = require('multer');
const path = require('path');

// const uploadDirectory = path.join(__dirname, '..', 'views', 'user-images');

const uploadDirectory = './views/user-images/'


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDirectory);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage }).single('file');

const uploadImageInServer = (req, res, next) => {
  upload(req, res, async (err) => {
    if (err) {
      console.error('Error uploading Image file:', err);
      return res.status(500).json({ error: 'Failed to upload Image file' });
    }
    return res.status(200).json({ file: req.file });
  });
};

module.exports = {
  uploadImageInServer,
};
