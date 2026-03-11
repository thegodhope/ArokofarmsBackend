const express = require('express');
const router = express.Router();
const multer = require('multer');
const controller = require('../controllers/subscriptionController');

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// Define multi-file upload fields
const uploadFields = upload.fields([
  { name: 'idFile', maxCount: 1 },
  { name: 'passportPhoto', maxCount: 1 },
  { name: 'receiptFile', maxCount: 1 }
]);

router.post('/submit', uploadFields, controller.createSubscription);

module.exports = router;