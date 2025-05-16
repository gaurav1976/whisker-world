const nodemailer = require('nodemailer');

// Configure transporter
const transport = nodemailer.createTransport({
    service:'gmail',
//   host: 'smtp.gmail.com',
//   port: 465,
//   secure: true,
  auth: {
    user: 'gauravdodiya67@gmail.com',
    pass: 'xlsdmyltseicvvng' // App-specific password
  }
});

// Send mail function
function Sendmail(to, subject, msg) {
  transport.sendMail({
    from: 'gauravdodiya67@gmail.com',
    to: to,
    subject: subject,
    html: msg
  }, (error, info) => {
    if (error) {
      console.error("❌ Error sending email:", error);
    } else {
      console.log("✅ Email sent:", info.response);
    }
  });
}

// Example usage
Sendmail("gauravdodiya67@gmail.com", "Test Subject", "<p>This is a test message</p>");
