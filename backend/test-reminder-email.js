const dotenv = require("dotenv");
const path = require("path");

// Load .env from the backend directory BEFORE requiring other files
dotenv.config({ path: path.join(__dirname, ".env") });

const { sendProjectDeadlineReminderEmail } = require("./mailtrap/email");

function formatDateISO(date) {
  return date.toISOString().split("T")[0];
}

async function testReminderEmail() {
  const targetEmail = process.env.ADMIN_MAIL || "scholarlyedgenexus2025@gmail.com";
  const name = "Admin";

  // Demo project details
  const projectTitle = "DEMO: Literature Review on AI Ethics (5000 words)";
  const deadline = new Date();
  deadline.setDate(deadline.getDate() + 3);
  const deadlineText = formatDateISO(deadline);

  console.log(`Sending reminder email to: ${targetEmail}`);
  console.log(`Project: ${projectTitle}`);
  console.log(`Deadline: ${deadlineText}`);

  await sendProjectDeadlineReminderEmail(
    targetEmail,
    name,
    projectTitle,
    deadlineText,
    3
  );
}

testReminderEmail();

