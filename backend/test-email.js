const dotenv = require("dotenv");
const path = require("path");

// Load .env from the backend directory BEFORE requiring other files
dotenv.config({ path: path.join(__dirname, ".env") });

const { sendWelcomeEmail } = require("./mailtrap/email");
const { transporter } = require("./mailtrap/mailtrap.config");

const testEmail = async () => {
  const email = "finetex700@gmail.com";
  const name = "Test User";
  const verifiedSender = "no-reply@schorlarlyedgenexus.com";

  console.log(`Attempting to send test email to ${email}...`);
  console.log(`Using Host: ${process.env.MAILTRAP_PROD_HOST || process.env.MAILTRAP_HOST || "sandbox.smtp.mailtrap.io"}`);
  console.log(`Using Verified Sender: ${verifiedSender}`);

  try {
    // Manually setting the from address for this test to match verified domain
    const htmlContent = `<h1>Test Email</h1><p>The domain verification is working!</p>`;
    
    await transporter.sendMail({
      from: `"ScholarlyEdge Nexus" <${verifiedSender}>`,
      to: email,
      subject: "Domain Verification Test",
      html: htmlContent,
    });
    
    console.log("SUCCESS: Test email sent successfully!");
  } catch (error) {
    console.error("FAILED: Error sending test email:");
    console.error(error.message);
  }
};

testEmail();
