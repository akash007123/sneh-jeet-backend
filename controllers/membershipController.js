const Membership = require('../models/Membership');
const { sendEmail } = require('../utils/email');

const submitMembership = async (req, res) => {
  try {
    const { firstName, lastName, email, mobile, interest } = req.body;
    const image = req.file ? `/uploads/membership/${req.file.filename}` : null;

    // Basic validation
    if (!firstName || !lastName || !email) {
      return res.status(400).json({ error: 'First name, last name, and email are required' });
    }

    // Save to database
    const membership = new Membership({
      firstName,
      lastName,
      email,
      mobile,
      interest,
      image,
    });
    await membership.save();

    // Send confirmation email to user
    const userSubject = 'Thank You for Applying to Join Sneh Jeet NGO 🌈';
    const userText = `Dear ${firstName} ${lastName},

Thank you for your interest in joining Sneh Jeet NGO 🌈

We truly appreciate your willingness to contribute to our mission.
Your membership application has been received, and our team will review it shortly.

Here are the details you shared:
--------------------------------
Name: ${firstName} ${lastName}
Email: ${email}
Mobile: ${mobile || 'N/A'}
Interest: ${interest || 'N/A'}
--------------------------------

At Sneh Jeet NGO, we stand for equality, dignity, and empowerment for the LGBTQ+ community.
You are not alone, and your support matters.

Stay connected with us:
Instagram: https://instagram.com/snehjeetngo
Facebook: https://facebook.com/snehjeetngo
LinkedIn: https://linkedin.com/company/snehjeetngo

For any questions:
Email: loveforprideunity@gmail.com
Phone: +91-9685533878

With pride and solidarity,
Sneh Jeet NGO Team
🌈 Love • Equality • Inclusion`;
    const userHtml = `<div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
  <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 8px; padding: 25px;">

    <h2 style="color: #d63384; text-align: center;">Thank You for Applying 🌈</h2>

    <p>Dear <strong>${firstName} ${lastName}</strong>,</p>

    <p>
      Thank you for applying to join <strong>Sneh Jeet NGO</strong>.
      We appreciate your interest in contributing to our mission.
      Your application has been received, and our team will review it soon.
    </p>

    <hr />

    <p><strong>Name:</strong> ${firstName} ${lastName}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Mobile:</strong> ${mobile || 'N/A'}</p>
    <p><strong>Interest:</strong></p>
    <p style="background: #f1f1f1; padding: 10px; border-radius: 5px;">
      ${interest || 'N/A'}
    </p>

    <p>
      At <strong>Sneh Jeet NGO</strong>, we work to uplift, protect, and empower the LGBTQ+ community.
      Your support matters.
    </p>

    <hr />

    <p><strong>Stay Connected:</strong></p>
    <ul>
      <li>🌈 <a href="https://instagram.com/snehjeetngo">Instagram</a></li>
      <li>💙 <a href="https://facebook.com/snehjeetngo">Facebook</a></li>
      <li>💼 <a href="https://linkedin.com/company/snehjeetngo">LinkedIn</a></li>
    </ul>

    <p>
      <strong>Need assistance?</strong><br/>
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
    const adminSubject = '🌈 New Membership Application – Sneh Jeet NGO';
    const adminText = `A new membership application has been received.

Details:
-----------------------------
Name: ${firstName} ${lastName}
Email: ${email}
Mobile: ${mobile || 'N/A'}
Interest: ${interest || 'N/A'}
-----------------------------

Please review and respond as needed.

Sneh Jeet NGO System`;
    const adminHtml = `<div style="font-family: Arial, sans-serif; background-color: #f4f6f8; padding: 20px;">
  <div style="max-width: 600px; margin: auto; background: #ffffff; padding: 25px; border-radius: 8px;">

    <h2 style="color: #0d6efd;">🌈 New Membership Application</h2>

    <p>A new membership application has been submitted via the Sneh Jeet NGO website.</p>

    <table style="width: 100%; border-collapse: collapse;">
      <tr>
        <td><strong>Name:</strong></td>
        <td>${firstName} ${lastName}</td>
      </tr>
      <tr>
        <td><strong>Email:</strong></td>
        <td>${email}</td>
      </tr>
      <tr>
        <td><strong>Mobile:</strong></td>
        <td>${mobile || 'N/A'}</td>
      </tr>
      <tr>
        <td><strong>Interest:</strong></td>
        <td>${interest || 'N/A'}</td>
      </tr>
    </table>

    <hr />

    <p style="color: #6c757d; font-size: 14px;">
      This is an automated notification from the Sneh Jeet NGO membership system.
    </p>
  </div>
</div>`;

    await sendEmail(process.env.ADMIN_EMAIL, adminSubject, adminText, adminHtml);

    res.status(200).json({ message: 'Membership application submitted successfully' });
  } catch (error) {
    console.error('Error submitting membership application:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getAllMemberships = async (req, res) => {
  try {
    const memberships = await Membership.find().sort({ createdAt: -1 });
    res.status(200).json(memberships);
  } catch (error) {
    console.error('Error fetching memberships:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getMembershipById = async (req, res) => {
  try {
    const { id } = req.params;
    const membership = await Membership.findById(id);
    if (!membership) {
      return res.status(404).json({ error: 'Membership not found' });
    }
    res.status(200).json(membership);
  } catch (error) {
    console.error('Error fetching membership:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const updateMembership = async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, email, mobile, interest, position, status } = req.body;
    const membership = await Membership.findByIdAndUpdate(
      id,
      { firstName, lastName, email, mobile, interest, position, status },
      { new: true, runValidators: true }
    );
    if (!membership) {
      return res.status(404).json({ error: 'Membership not found' });
    }
    res.status(200).json(membership);
  } catch (error) {
    console.error('Error updating membership:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const deleteMembership = async (req, res) => {
  try {
    const { id } = req.params;
    const membership = await Membership.findByIdAndDelete(id);
    if (!membership) {
      return res.status(404).json({ error: 'Membership not found' });
    }
    res.status(200).json({ message: 'Membership deleted successfully' });
  } catch (error) {
    console.error('Error deleting membership:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  submitMembership,
  getAllMemberships,
  getMembershipById,
  updateMembership,
  deleteMembership,
};