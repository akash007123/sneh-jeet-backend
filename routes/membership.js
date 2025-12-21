const express = require('express');
const multer = require('multer');
const path = require('path');
const { submitMembership, getAllMemberships, getMembershipById, updateMembership, deleteMembership, createMembershipByAdmin } = require('../controllers/membershipController');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads/membership'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    let allowedTypes;
    if (file.fieldname === 'idProofFile') {
      allowedTypes = /jpeg|jpg|png|pdf/;
    } else {
      allowedTypes = /jpeg|jpg|png|gif/;
    }
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error(`Only ${file.fieldname === 'idProofFile' ? 'image and PDF' : 'image'} files are allowed for ${file.fieldname}!`));
    }
  }
});

const uploadFields = upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'idProofFile', maxCount: 1 }
]);

router.post('/', upload.single('image'), submitMembership);
router.post('/admin', uploadFields, createMembershipByAdmin);
router.get('/', getAllMemberships);
router.get('/:id', getMembershipById);
router.put('/:id', updateMembership);
router.delete('/:id', deleteMembership);

module.exports = router;