const { transporter, sender } = require("./mailtrap.config");
const { WELCOME_EMAIL_TEMPLATE, PROJECT_ASSIGNMENT_TEMPLATE } = require("./emailTemplate");

const sendWelcomeEmail = async (email, name) => {
  const recipient = email;

  try {
    const htmlContent = WELCOME_EMAIL_TEMPLATE
      .replace("{name}", name)
      .replace("{login_url}", process.env.FRONTEND_URL || "http://localhost:5173/login");

    const response = await transporter.sendMail({
      from: `"${sender.name}" <${sender.email}>`,
      to: recipient,
      subject: "Welcome to ScholarlyEdge!",
      html: htmlContent,
      category: "Welcome Email",
    });

    console.log("Welcome email sent successfully", response);
  } catch (error) {
    console.error("Error sending welcome email", error);
    throw new Error(`Error sending welcome email: ${error.message}`);
  }
};

const sendProjectAssignmentEmail = async (email, name, projectTitle, deadline, projectId) => {
  const recipient = email;

  try {
    const htmlContent = PROJECT_ASSIGNMENT_TEMPLATE
      .replace("{name}", name)
      .replace("{project_title}", projectTitle)
      .replace("{deadline}", deadline)
      .replace("{project_url}", `${process.env.FRONTEND_URL || "http://localhost:5173"}/projects/${projectId}`);

    const response = await transporter.sendMail({
      from: `"${sender.name}" <${sender.email}>`,
      to: recipient,
      subject: "New Project Assigned - ScholarlyEdge",
      html: htmlContent,
      category: "Project Assignment",
    });

    console.log("Project assignment email sent successfully", response);
  } catch (error) {
    console.error("Error sending project assignment email", error);
    throw new Error(`Error sending project assignment email: ${error.message}`);
  }
};

module.exports = {
  sendWelcomeEmail,
  sendProjectAssignmentEmail,
};
