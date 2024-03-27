const fs = require('fs');
const path = require('path');
const multer = require('multer');
const crypto = require('crypto');

const handleFileUpload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit per file
  },
  fileFilter: function (req,file, cb) {
    console.log(file);
    const allowedTypes = ['image/jpeg', 'image/png', 'video/mp4'];
    if (!allowedTypes.includes(file.mimetype)) {
      cb(new Error('Only image (JPEG/PNG) or video (MP4) files are allowed!'));
      return;
    }
    cb(null, true);
  }
}).array('files', 5);


const getPropertyMediaFiles = (propertyId) => {
  const directoryPath = path.join(__dirname, 'uploads', propertyId);
  if (fs.existsSync(directoryPath)) {
    const files = fs.readdirSync(directoryPath);
    return files;
  } else {
    return null;
  }
};

const saveFileToDirectory = (propertyId, file) => {
  const directoryPath = path.join(__dirname, 'uploads', propertyId);
  if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath, { recursive: true });
  }

  const uniqueSuffix = Date.now() + '-' + crypto.randomBytes(8).toString('hex');
  const fileName = file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname);
  const filePath = path.join(directoryPath, fileName);

  fs.writeFileSync(filePath, file.buffer);
  return fileName;
};

module.exports = { handleFileUpload, getPropertyMediaFiles, saveFileToDirectory };
