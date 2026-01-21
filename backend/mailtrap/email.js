const { transporter, sender } = require("./mailtrap.config");
const { 
  WELCOME_EMAIL_TEMPLATE, 
  PROJECT_ASSIGNMENT_TEMPLATE,
  PROJECT_UPDATE_TEMPLATE,
  ADMIN_PROJECT_UPDATE_TEMPLATE,
  PROJECT_DEADLINE_REMINDER_TEMPLATE
} = require("./emailTemplate");

const sendWelcomeEmail = async (email, name) => {
  try {
    const htmlContent = WELCOME_EMAIL_TEMPLATE
      .replace("{name}", name)
      .replace("{login_url}", process.env.FRONTEND_URL || "http://localhost:5173/login");

    await transporter.sendMail({
      from: `"${sender.name}" <${sender.email}>`,
      to: email,
      subject: "Welcome to ScholarlyEdge!",
      html: htmlContent,
      category: "Welcome Email",
    });

    console.log("Welcome email sent successfully");
  } catch (error) {
    console.error("Error sending welcome email", error);
  }
};

const sendProjectAssignmentEmail = async (email, name, projectTitle, deadline, projectId) => {
  try {
    const htmlContent = PROJECT_ASSIGNMENT_TEMPLATE
      .replace("{name}", name)
      .replace("{project_title}", projectTitle)
      .replace("{deadline}", deadline)
      .replace("{project_url}", `${process.env.FRONTEND_URL || "http://localhost:5173"}/dashboard/writer`);

    console.log(`Attempting to send assignment email to ${email} for project ${projectTitle}`);

    const info = await transporter.sendMail({
      from: `"${sender.name}" <${sender.email}>`,
      to: email,
      subject: "New Project Assigned - ScholarlyEdge",
      html: htmlContent,
      category: "Project Assignment",
    });

    console.log("Project assignment email sent successfully to writer:", info.messageId);
    
    // Warning for sandbox usage in what looks like a production environment
    if (transporter.options.host.includes("sandbox")) {
      console.warn("NOTE: Email was sent to Mailtrap SANDBOX. It will not reach the real recipient's inbox.");
    }
    
    if (info.accepted && info.accepted.length > 0) {
      console.log("Email accepted by SMTP for:", info.accepted.join(", "));
    }
  } catch (error) {
    console.error("Error sending project assignment email", error);
  }
};

const sendProjectUpdateEmail = async (email, name, projectTitle, projectId) => {
  try {
    const htmlContent = PROJECT_UPDATE_TEMPLATE
      .replace("{name}", name)
      .replace("{project_title}", projectTitle)
      .replace("{project_url}", `${process.env.FRONTEND_URL || "http://localhost:5173"}/dashboard/writer`);

    const info = await transporter.sendMail({
      from: `"${sender.name}" <${sender.email}>`,
      to: email,
      subject: `Project Updated - ${projectTitle}`,
      html: htmlContent,
      category: "Project Update",
    });
    console.log("Project update email sent to writer:", info.messageId);
  } catch (error) {
    console.error("Error sending project update email", error);
  }
};

const sendAdminProjectUpdateEmail = async (writerName, projectTitle, status, projectId) => {
  const adminEmail = process.env.ADMIN_MAIL;
  if (!adminEmail) {
    console.warn("ADMIN_MAIL not set in environment variables, skipping admin notification");
    return;
  }

  try {
    const htmlContent = ADMIN_PROJECT_UPDATE_TEMPLATE
      .replace("{writer_name}", writerName)
      .replace("{project_title}", projectTitle)
      .replace("{status}", status)
      .replace("{project_url}", `${process.env.FRONTEND_URL || "http://localhost:5173"}/dashboard/projects`);

    const info = await transporter.sendMail({
      from: `"${sender.name}" <${sender.email}>`,
      to: adminEmail,
      subject: `Writer Update: ${projectTitle}`,
      html: htmlContent,
      category: "Admin Notification",
    });
    console.log("Status update email sent to admin:", info.messageId);
  } catch (error) {
    console.error("Error sending admin project update email", error);
  }
};

const sendProjectDeadlineReminderEmail = async (email, name, projectTitle, deadline, daysLeft) => {
  try {
    const timeLeftText = daysLeft === 0 ? "Due today" : `${daysLeft} day(s) remaining`;
    const htmlContent = PROJECT_DEADLINE_REMINDER_TEMPLATE
      .replace("{name}", name)
      .replace("{project_title}", projectTitle)
      .replace("{deadline}", deadline)
      .replace("{time_left}", timeLeftText)
      .replace("{project_url}", `${process.env.FRONTEND_URL || "http://localhost:5173"}/dashboard/writer`);

    const subject =
      daysLeft === 0
        ? `Deadline Today: ${projectTitle}`
        : `Reminder: ${projectTitle} is due in ${daysLeft} day(s)`;

    const info = await transporter.sendMail({
      from: `"${sender.name}" <${sender.email}>`,
      to: email,
      subject,
      html: htmlContent,
      category: "Project Deadline Reminder",
    });

    console.log("Project deadline reminder email sent:", info.messageId);
  } catch (error) {
    console.error("Error sending project deadline reminder email", error);
  }
};

module.exports = {
  sendWelcomeEmail,
  sendProjectAssignmentEmail,
  sendProjectUpdateEmail,
  sendAdminProjectUpdateEmail,
  sendProjectDeadlineReminderEmail,
};
