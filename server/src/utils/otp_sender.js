const nodemailer = require("nodemailer");

const setupTransporter = () => {
  const transporter = nodemailer.createTransport({
    host: "smtp-mail.outlook.com", // Hotmail/Outlook SMTP server
    secure: false, // true for 465, false for other ports
    port: 587,
    auth: {
      user: process.env.EMAIL_USER, // Your email address
      pass: process.env.EMAIL_PASSWORD, // Your password or application-specific password
    },
  });
transporter
  .verify()
  .then(() => {
    console.log("Transporter is ready to send emails");
  })
  .catch((err) => {
    console.error("Error verifying transporter:", err);
  });
  return transporter;
};

const sendMail = async (recipient, subject, htmlContent) => {
  const  transporter  = setupTransporter();

  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER, // Sender address
      to: recipient,
      subject: subject,
      html: htmlContent,
    });

    console.log("Email sent: " + info.response);
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email");
  }
};

module.exports = { sendMail };
