const WELCOME_EMAIL_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to ScholarlyEdge</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(to right, #4CAF50, #45a049); padding: 20px; text-align: center;">
    <h1 style="color: white; margin: 0;">Welcome to ScholarlyEdge!</h1>
  </div>
  <div style="background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
    <p>Hello {name},</p>
    <p>We're thrilled to have you join our team of professional writers! ScholarlyEdge is dedicated to delivering high-quality academic and professional content, and we're excited to see your contributions.</p>
    <p>You can now log in to your dashboard to view available projects and manage your assignments.</p>
    <div style="text-align: center; margin: 30px 0;">
      <a href="{login_url}" style="background-color: #4CAF50; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Go to Dashboard</a>
    </div>
    <p>If you have any questions, feel free to reach out to our support team.</p>
    <p>Best regards,<br>The ScholarlyEdge Team</p>
  </div>
  <div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.8em;">
    <p>This is an automated message, please do not reply to this email.</p>
  </div>
</body>
</html>
`;

const PROJECT_ASSIGNMENT_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Project Assigned</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(to right, #2196F3, #1976D2); padding: 20px; text-align: center;">
    <h1 style="color: white; margin: 0;">New Project Assigned!</h1>
  </div>
  <div style="background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
    <p>Hello {name},</p>
    <p>An admin has assigned a new project to you:</p>
    <div style="background-color: #fff; padding: 15px; border-left: 4px solid #2196F3; margin: 20px 0;">
      <p><strong>Project Title:</strong> {project_title}</p>
      <p><strong>Deadline:</strong> {deadline}</p>
    </div>
    <p>Please log in to your dashboard to review the project details and start working.</p>
    <div style="text-align: center; margin: 30px 0;">
      <a href="{project_url}" style="background-color: #2196F3; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">View Project</a>
    </div>
    <p>Good luck with the assignment!</p>
    <p>Best regards,<br>The ScholarlyEdge Team</p>
  </div>
  <div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.8em;">
    <p>This is an automated message, please do not reply to this email.</p>
  </div>
</body>
</html>
`;

module.exports = {
  WELCOME_EMAIL_TEMPLATE,
  PROJECT_ASSIGNMENT_TEMPLATE,
};
