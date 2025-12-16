const express = require('express');
const { submitMembership, getAllMemberships, getMembershipById, updateMembership, deleteMembership } = require('../controllers/membershipController');

const router = express.Router();

router.post('/', submitMembership);
router.get('/', getAllMemberships);
router.get('/:id', getMembershipById);
router.put('/:id', updateMembership);
router.delete('/:id', deleteMembership);

module.exports = router;