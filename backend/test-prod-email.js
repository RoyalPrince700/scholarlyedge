const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const path = require("path");

// Load .env
dotenv.config({ path: path.join(__dirname, ".env") });

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

const sendTestMail = async (targetEmail) => {
  console.log("--- Email Configuration Check ---");
  console.log("Host:", transporter.options.host);
  console.log("Port:", transporter.options.port);
  console.log("User:", transporter.options.auth.user ? "****" + String(transporter.options.auth.user).slice(-4) : "MISSING");
  console.log("Sender Email:", sender.email);
  console.log("Target Email:", targetEmail);
  console.log("---------------------------------");

  try {
    const info = await transporter.sendMail({
      from: `"${sender.name}" <${sender.email}>`,
      to: targetEmail,
      subject: "Production SMTP Test - ScholarlyEdge",
      html: `
        <h1>SMTP Test Successful!</h1>
        <p>This email was sent using the current production configuration.</p>
        <p><b>Time Sent:</b> ${new Date().toLocaleString()}</p>
        <p><b>SMTP Host:</b> ${transporter.options.host}</p>
      `,
    });

    console.log("SUCCESS: Email sent successfully!");
    console.log("Message ID:", info.messageId);
    console.log("Accepted Recipients:", info.accepted);
    
    if (transporter.options.host.includes("sandbox")) {
      console.log("\n⚠️ WARNING: You are using the SANDBOX host.");
      console.log("Emails sent to the sandbox will NOT be delivered to the real recipient's inbox.");
      console.log("Check your Mailtrap Sandbox dashboard to see the message.");
    } else {
      console.log("\n✅ You are using a PRODUCTION host. The email should arrive in the inbox shortly.");
    }
  } catch (error) {
    console.error("ERROR: Failed to send test email.");
    console.error("Error Code:", error.code);
    console.error("Error Message:", error.message);
  }
};

// Use the email from the command line or the one provided by the user
const target = process.argv[2] || "royalprincecube@gmail.com";
sendTestMail(target);
