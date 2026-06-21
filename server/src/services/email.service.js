const { Resend } = require('resend');

let resend = null;
if (process.env.RESEND_API_KEY) {
  resend = new Resend(process.env.RESEND_API_KEY);
}

const sendEmail = async ({ to, subject, html }) => {
  if (!resend) {
    console.log(`[Email Mock] To: ${to} | Subject: ${subject}`);
    return;
  }
  try {
    // In test mode, you must verify the domain or use a verified "From" address
    // We will use a standard noreply or the default Resend testing email if available
    const { data, error } = await resend.emails.send({
      from: 'Team Task Manager <onboarding@resend.dev>', // Resend testing domain
      to,
      subject,
      html
    });
    
    if (error) {
      console.error('Resend API Error:', error);
    }
  } catch (err) {
    console.error('Email sending failed:', err);
  }
};

module.exports = {
  sendEmail
};
