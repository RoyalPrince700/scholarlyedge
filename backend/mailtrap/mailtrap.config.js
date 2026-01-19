const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

dotenv.config();

// Mailtrap configuration for both local and production
// Local: uses the sandbox SMTP credentials
// Production: uses the production SMTP credentials
const transporter = nodemailer.createTransport({
  host: process.env.MAILTRAP_HOST || "sandbox.smtp.mailtrap.io",
  port: process.env.MAILTRAP_PORT || 2525,
  auth: {
    user: process.env.MAILTRAP_USER,
    pass: process.env.MAILTRAP_PASS,
  },
});

const sender = {
  email: process.env.MAIL_FROM || "hello@scholarlyedge.com",
  name: "ScholarlyEdge",
};

module.exports = {
  transporter,
  sender,
};
