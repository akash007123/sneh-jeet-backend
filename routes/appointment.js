const express = require('express');
const { submitAppointment, getAllAppointments, getAppointmentById, updateAppointment, deleteAppointment } = require('../controllers/appointmentController');

const router = express.Router();

router.post('/', submitAppointment);
router.get('/', getAllAppointments);
router.get('/:id', getAppointmentById);
router.put('/:id', updateAppointment);
router.delete('/:id', deleteAppointment);

module.exports = router;