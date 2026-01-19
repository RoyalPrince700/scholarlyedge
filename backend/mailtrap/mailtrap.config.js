const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

dotenv.config();

// Mailtrap configuration for both local and production
// Local: uses the sandbox SMTP credentials
// Production: uses the production SMTP credentials (MAILTRAP_PROD_*)
const transporter = nodemailer.createTransport({
  host: process.env.MAILTRAP_PROD_HOST || process.env.MAILTRAP_HOST || "sandbox.smtp.mailtrap.io",
  port: process.env.MAILTRAP_PROD_PORT || process.env.MAILTRAP_PORT || 2525,
  auth: {
    user: process.env.MAILTRAP_PROD_USER || process.env.MAILTRAP_USER,
    pass: process.env.MAILTRAP_PROD_PASS || process.env.MAILTRAP_PASS,
  },
});

const sender = {
  email: process.env.MAIL_FROM || "no-reply@schorlarlyedgenexus.com",
  name: "ScholarlyEdge Nexus",
};

module.exports = {
  transporter,
  sender,
};
