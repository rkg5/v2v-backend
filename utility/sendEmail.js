const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: process.env.SMTP_PORT,
  secure: true,
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER_ID,
    pass: process.env.GMAIL_PASSWORD,
  },
});

// sending email for reset password link
module.exports.sendEmail = async function sendEmail(
  email,
  subject,
  htmlString
) {
  //console.log(email, " - ", token);
  const mailOptions = {
    from: '"Ankit Maurya" <ankitm.ac.in@gmail.com>',
    to: email,
    subject: subject,
    html: htmlString,
  };
  console.log(email);
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log("Error sending email");
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};
