import express from "express";
import nodemailer from "nodemailer";

const router = express.Router();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

router.post("/email", async (req, res) => {
  const { name, email, preferredTime, callType, meetingLink, type } = req.body;

  if (!name || !email || !preferredTime || !callType || !type) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const subject = type === "confirmation" ? "Appointment Confirmation" : "Appointment Reminder";
  const message = `
    Dear ${name},<br><br>
    This is a ${type} for your ${callType} session scheduled at <strong>${preferredTime}</strong>.<br><br>
    ${meetingLink ? `Here is your meeting link: <a href="${meetingLink}">${meetingLink}</a><br><br>` : ""}
    Thank you,<br>
    Saathi Mindcare
  `;

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject,
      html: message,
    });

    res.json({ message: "Email sent successfully" });
  } catch (err) {
    console.error("Email send error:", err);
    res.status(500).json({ message: "Failed to send email" });
  }
});

export default router;
