const prisma = require('../lib/prisma');
const { sendEmail } = require('./email.service');

const notifyUser = async ({ userId, type, title, message, emailHtml }) => {
  try {
    // 1. Create in-app notification
    await prisma.notification.create({
      data: {
        userId,
        title,
        message,
        type
      }
    });

    // 2. Send email
    if (emailHtml) {
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (user) {
        await sendEmail({
          to: user.email,
          subject: title,
          html: emailHtml
        });
      }
    }
  } catch (err) {
    console.error('Failed to notify user:', err);
  }
};

const logActivity = async ({ projectId, userId, action, details }) => {
  try {
    await prisma.activity.create({
      data: {
        projectId,
        userId,
        action,
        details
      }
    });
  } catch (err) {
    console.error('Failed to log activity:', err);
  }
};

module.exports = {
  notifyUser,
  logActivity
};
