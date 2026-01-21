const Project = require("../models/Project");
const { sendProjectDeadlineReminderEmail } = require("../mailtrap/email");

const DAY_MS = 24 * 60 * 60 * 1000;

function toLocalMidnight(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function diffDays(deadlineDate, now = new Date()) {
  const deadlineStart = toLocalMidnight(deadlineDate);
  const nowStart = toLocalMidnight(now);
  return Math.round((deadlineStart.getTime() - nowStart.getTime()) / DAY_MS);
}

function isMorning(now = new Date()) {
  const hour = now.getHours();
  return hour >= 6 && hour < 12;
}

async function runDeadlineReminderScan() {
  const enabled = String(process.env.REMINDER_EMAILS_ENABLED || "true").toLowerCase() === "true";
  if (!enabled) return;

  try {
    const now = new Date();

    const projects = await Project.find({
      status: { $nin: ["completed", "cancelled"] },
      assignedTo: { $exists: true, $ne: null },
      deadline: { $exists: true, $ne: null },
    }).populate("assignedTo", "name email");

    for (const project of projects) {
      if (!project.assignedTo?.email) continue;

      const daysLeft = diffDays(project.deadline, now);
      const deadlineText = project.deadline.toISOString().split("T")[0];

      // 3 days before deadline reminder
      if (daysLeft === 3 && !project.reminderEmails?.threeDaysBeforeSentAt) {
        await sendProjectDeadlineReminderEmail(
          project.assignedTo.email,
          project.assignedTo.name,
          project.title,
          deadlineText,
          3
        );

        await Project.updateOne(
          { _id: project._id },
          { $set: { "reminderEmails.threeDaysBeforeSentAt": new Date() } }
        );
      }

      // Deadline-day reminder (morning)
      if (daysLeft === 0 && isMorning(now) && !project.reminderEmails?.deadlineDaySentAt) {
        await sendProjectDeadlineReminderEmail(
          project.assignedTo.email,
          project.assignedTo.name,
          project.title,
          deadlineText,
          0
        );

        await Project.updateOne(
          { _id: project._id },
          { $set: { "reminderEmails.deadlineDaySentAt": new Date() } }
        );
      }
    }
  } catch (err) {
    console.error("Deadline reminder scan failed:", err);
  }
}

function startDeadlineReminderJob() {
  // Run once at startup, then every hour.
  runDeadlineReminderScan();
  const intervalMs = Number(process.env.REMINDER_SCAN_INTERVAL_MS || 60 * 60 * 1000);
  setInterval(runDeadlineReminderScan, intervalMs);
}

module.exports = {
  startDeadlineReminderJob,
  runDeadlineReminderScan,
};

