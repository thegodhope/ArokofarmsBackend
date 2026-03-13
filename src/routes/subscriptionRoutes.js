const express = require('express');
const router = express.Router();
const multer = require('multer');
const controller = require('../controllers/subscriptionController');

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});

// File filter to accept only images and PDFs
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, GIF, and PDF are allowed.'), false);
  }
};

const upload = multer({ 
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit per file
});

// Define multi-file upload fields
const uploadFields = upload.fields([
  { name: 'idFile', maxCount: 1 },
  { name: 'passportPhoto', maxCount: 1 },
  { name: 'receiptFile', maxCount: 1 }
]);

/**
 * @swagger
 * /api/subscriptions/submit:
 *   post:
 *     summary: Submit a new subscription
 *     description: Creates a new subscription and uploads associated documents (ID routing, passport photo, receipt).
 *     tags: [Subscriptions]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               personalInfo:
 *                 type: string
 *                 description: JSON string containing personal information (fullName, dob, gender, email, maritalStatus, address, state, country, phone1, phone2)
 *                 example: '{"fullName":"John Doe","dob":"1990-05-12","gender":"Male","email":"john@example.com","maritalStatus":"Single","address":"12 Allen Avenue","state":"Lagos","country":"Nigeria","phone1":"08012345678","phone2":"08087654321"}'
 *               nextOfKin:
 *                 type: string
 *                 description: JSON string containing next of kin information (fullName, address, phone, relationship)
 *                 example: '{"fullName":"Jane Doe","address":"12 Allen Avenue","phone":"08099999999","relationship":"Sister"}'
 *               identification:
 *                 type: string
 *                 description: JSON string containing identification details (idType)
 *                 example: '{"idType":"National ID"}'
 *               subscriptionDetails:
 *                 type: string
 *                 description: JSON string containing subscription details (location, cluster, landSize, quantity)
 *                 example: '{"location":"Abeokuta, Ogun State","cluster":"Cocoa Plantain Cluster","landSize":"Acre","quantity":2}'
 *               payment:
 *                 type: string
 *                 description: JSON string containing payment details (plan, amountPaid)
 *                 example: '{"plan":"Outright(0-3 Months)","amountPaid":500000}'
 *               idFile:
 *                 type: string
 *                 format: binary
 *                 description: Uploaded ID document (JPEG, PNG, GIF, PDF). Max size 5MB.
 *               passportPhoto:
 *                 type: string
 *                 format: binary
 *                 description: Uploaded passport photo (JPEG, PNG, GIF, PDF). Max size 5MB.
 *               receiptFile:
 *                 type: string
 *                 format: binary
 *                 description: Uploaded payment receipt (JPEG, PNG, GIF, PDF). Max size 5MB.
 *     responses:
 *       201:
 *         description: Subscription created successfully
 *       400:
 *         description: Bad Request (e.g. invalid JSON, file upload error, or validation error)
 *       500:
 *         description: Internal server error
 */
router.post('/submit', (req, res, next) => {
  uploadFields(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading (e.g., file too large).
      return res.status(400).json({ message: "File Upload Error", error: err.message });
    } else if (err) {
      // A custom error from fileFilter occurred.
      return res.status(400).json({ message: "File Upload Error", error: err.message });
    }
    // Everything went fine, proceed to the controller
    controller.createSubscription(req, res, next);
  });
});

module.exports = router;