const express = require('express');
const { submitContact, getAllContacts, getContactById, updateContact, deleteContact } = require('../controllers/contactController');

const router = express.Router();

router.post('/', submitContact);
router.get('/', getAllContacts);
router.get('/:id', getContactById);
router.put('/:id', updateContact);
router.delete('/:id', deleteContact);

module.exports = router;