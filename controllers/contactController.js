const Contact = require('../models/Contact');
const { sendEmail } = require('../utils/email');

const submitContact = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    // Basic validation
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: 'All required fields must be filled' });
    }

    // Save to database
    const contact = new Contact({
      name,
      email,
      phone,
      subject,
      message,
    });
    await contact.save();

    // Send confirmation email to user
    const userSubject = 'Thank You for Reaching Out to Sneh Jeet NGO 🌈';
    const userText = `Dear ${name},

Thank you for reaching out to Sneh Jeet NGO 🌈

We truly appreciate your courage and trust in connecting with us.
Your message has been received, and one of our team members will respond shortly.

Here are the details you shared:
--------------------------------
Subject: ${subject}
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
    
    <h2 style="color: #d63384; text-align: center;">Thank You for Reaching Out 🌈</h2>

    <p>Dear <strong>${name}</strong>,</p>

    <p>
      Thank you for contacting <strong>Sneh Jeet NGO</strong>.
      We appreciate your trust and courage in connecting with us.
      Your message has been received, and our team will respond soon.
    </p>

    <hr />

    <p><strong>Subject:</strong> ${subject}</p>
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
    const adminSubject = '🌈 New Contact Form Submission – Sneh Jeet NGO';
    const adminText = `A new contact form submission has been received.

Details:
-----------------------------
Name: ${name}
Email: ${email}
Phone: ${phone || 'N/A'}
Subject: ${subject}

Message:
${message}
-----------------------------

Please review and respond as needed.

Sneh Jeet NGO System`;
    const adminHtml = `<div style="font-family: Arial, sans-serif; background-color: #f4f6f8; padding: 20px;">
  <div style="max-width: 600px; margin: auto; background: #ffffff; padding: 25px; border-radius: 8px;">
    
    <h2 style="color: #0d6efd;">🌈 New Contact Form Submission</h2>

    <p>A new message has been submitted via the Sneh Jeet NGO website.</p>

    <table style="width: 100%; border-collapse: collapse;">
      <tr>
        <td><strong>Name:</strong></td>
        <td>${name}</td>
      </tr>
      <tr>
        <td><strong>Email:</strong></td>
        <td>${email}</td>
      </tr>
      <tr>
        <td><strong>Phone:</strong></td>
        <td>${phone || 'N/A'}</td>
      </tr>
      <tr>
        <td><strong>Subject:</strong></td>
        <td>${subject}</td>
      </tr>
    </table>

    <p><strong>Message:</strong></p>
    <p style="background: #f1f1f1; padding: 10px; border-radius: 5px;">
      ${message}
    </p>

    <hr />

    <p style="color: #6c757d; font-size: 14px;">
      This is an automated notification from the Sneh Jeet NGO contact system.
    </p>
  </div>
</div>`;

    await sendEmail(process.env.ADMIN_EMAIL, adminSubject, adminText, adminHtml);

    res.status(200).json({ message: 'Contact form submitted successfully' });
  } catch (error) {
    console.error('Error submitting contact form:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.status(200).json(contacts);
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getContactById = async (req, res) => {
  try {
    const { id } = req.params;
    const contact = await Contact.findById(id);
    if (!contact) {
      return res.status(404).json({ error: 'Contact not found' });
    }
    res.status(200).json(contact);
  } catch (error) {
    console.error('Error fetching contact:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const updateContact = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, subject, message, status } = req.body;
    const contact = await Contact.findByIdAndUpdate(
      id,
      { name, email, phone, subject, message, status },
      { new: true, runValidators: true }
    );
    if (!contact) {
      return res.status(404).json({ error: 'Contact not found' });
    }
    res.status(200).json(contact);
  } catch (error) {
    console.error('Error updating contact:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const deleteContact = async (req, res) => {
  try {
    const { id } = req.params;
    const contact = await Contact.findByIdAndDelete(id);
    if (!contact) {
      return res.status(404).json({ error: 'Contact not found' });
    }
    res.status(200).json({ message: 'Contact deleted successfully' });
  } catch (error) {
    console.error('Error deleting contact:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  submitContact,
  getAllContacts,
  getContactById,
  updateContact,
  deleteContact,
};