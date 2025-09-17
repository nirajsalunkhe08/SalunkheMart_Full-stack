// server/routes/email.route.js
import express from 'express';
import sendEmail from '../config/sendEmail.js';

const router = express.Router();

router.post('/send', async (req, res) => {
  try {
    const response = await sendEmail(req.body);
    res.status(200).json({ success: true, message: 'Email sent', data: response });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to send email', error: error.message });
  }
});

export default router;
