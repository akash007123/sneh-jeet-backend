const Appointment = require('../models/Appointment');
const { sendEmail } = require('../utils/email');

const submitAppointment = async (req, res) => {
  try {
    const { name, mobile, email, message } = req.body;

    // Basic validation
    if (!name || !mobile || !email || !message) {
      return res.status(400).json({ error: 'All required fields must be filled' });
    }

    // Save to database
    const appointment = new Appointment({
      name,
      mobile,
      email,
      message,
    });
    await appointment.save();

    // Send confirmation email to user
    const userSubject = 'Appointment Request Received - Sneh Jeet NGO 🌈';
    const userText = `Dear ${name},

Thank you for booking an appointment with Sneh Jeet NGO 🌈

We have received your appointment request and will contact you soon to confirm the details.

Here are the details you shared:
--------------------------------
Mobile: ${mobile}
Email: ${email}
Message:
${message}
--------------------------------

At Sneh Jeet NGO, we stand for equality, dignity, and empowerment for the LGBTQ+ community.
You are not alone, and your voice matters.

Stay connected with us:
Instagram: https://instagram.com/snehjeetngo
Facebook: https://facebook.com/snehjeetngo
LinkedIn: https://linkedin.com/company/snehjeetngo

For urgent support:
Email: loveforprideunity@gmail.com
Phone: +91-9685533878

With pride and solidarity,
Sneh Jeet NGO Team
🌈 Love • Equality • Inclusion`;
    const userHtml = `<div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
  <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 8px; padding: 25px;">
    
    <h2 style="color: #d63384; text-align: center;">Appointment Request Received 🌈</h2>

    <p>Dear <strong>${name}</strong>,</p>

    <p>
      Thank you for booking an appointment with <strong>Sneh Jeet NGO</strong>.
      We have received your request and will contact you shortly to confirm.
    </p>

    <hr />

    <p><strong>Mobile:</strong> ${mobile}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Your Message:</strong></p>
    <p style="background: #f1f1f1; padding: 10px; border-radius: 5px;">
      ${message}
    </p>

    <p>
      At <strong>Sneh Jeet NGO</strong>, we work to uplift, protect, and empower the LGBTQ+ community.
      You matter. Your story matters.
    </p>

    <hr />

    <p><strong>Stay Connected:</strong></p>
    <ul>
      <li>🌈 <a href="https://instagram.com/snehjeetngo">Instagram</a></li>
      <li>💙 <a href="https://facebook.com/snehjeetngo">Facebook</a></li>
      <li>💼 <a href="https://linkedin.com/company/snehjeetngo">LinkedIn</a></li>
    </ul>

    <p>
      <strong>Need immediate support?</strong><br/>
      📧 loveforprideunity@gmail.com<br/>
      📞 +91-9685533878
    </p>

    <p style="text-align: center; color: #6c757d;">
      With Pride & Solidarity,<br/>
      <strong>Sneh Jeet NGO Team</strong><br/>
      🌈 Love • Equality • Inclusion
    </p>
  </div>
</div>`;

    await sendEmail(email, userSubject, userText, userHtml);

    // Send notification email to admin
    const adminSubject = '🌈 New Appointment Booking – Sneh Jeet NGO';
    const adminText = `A new appointment has been booked.

Details:
-----------------------------
Name: ${name}
Mobile: ${mobile}
Email: ${email}

Message:
${message}
-----------------------------

Please review and confirm the appointment.

Sneh Jeet NGO System`;
    const adminHtml = `<div style="font-family: Arial, sans-serif; background-color: #f4f6f8; padding: 20px;">
  <div style="max-width: 600px; margin: auto; background: #ffffff; padding: 25px; border-radius: 8px;">
    
    <h2 style="color: #0d6efd;">🌈 New Appointment Booking</h2>

    <p>A new appointment has been booked via the Sneh Jeet NGO website.</p>

    <table style="width: 100%; border-collapse: collapse;">
      <tr>
        <td><strong>Name:</strong></td>
        <td>${name}</td>
      </tr>
      <tr>
        <td><strong>Mobile:</strong></td>
        <td>${mobile}</td>
      </tr>
      <tr>
        <td><strong>Email:</strong></td>
        <td>${email}</td>
      </tr>
    </table>

    <p><strong>Message:</strong></p>
    <p style="background: #f1f1f1; padding: 10px; border-radius: 5px;">
      ${message}
    </p>

    <hr />

    <p style="color: #6c757d; font-size: 14px;">
      This is an automated notification from the Sneh Jeet NGO appointment system.
    </p>
  </div>
</div>`;

    await sendEmail(process.env.ADMIN_EMAIL, adminSubject, adminText, adminHtml);

    res.status(200).json({ message: 'Appointment booked successfully' });
  } catch (error) {
    console.error('Error booking appointment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getAllAppointments = async (req, res) => {
  try {
    const { status } = req.query;
    let query = {};
    if (status && status !== 'All') {
      query.status = status;
    }
    const appointments = await Appointment.find(query).sort({ createdAt: -1 });
    res.status(200).json(appointments);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getAppointmentById = async (req, res) => {
  try {
    const { id } = req.params;
    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }
    res.status(200).json(appointment);
  } catch (error) {
    console.error('Error fetching appointment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const updateAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, mobile, email, message, status } = req.body;
    const appointment = await Appointment.findByIdAndUpdate(
      id,
      { name, mobile, email, message, status },
      { new: true, runValidators: true }
    );
    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }
    res.status(200).json(appointment);
  } catch (error) {
    console.error('Error updating appointment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const deleteAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const appointment = await Appointment.findByIdAndDelete(id);
    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }
    res.status(200).json({ message: 'Appointment deleted successfully' });
  } catch (error) {
    console.error('Error deleting appointment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  submitAppointment,
  getAllAppointments,
  getAppointmentById,
  updateAppointment,
  deleteAppointment,
};