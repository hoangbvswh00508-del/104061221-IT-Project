const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendOtpEmail = (email, otp) => {
  console.log(`Preparing to send OTP (${otp}) to email: ${email}`);

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Your OTP Code', 
    text: `Your OTP code is: ${otp}`,
  };

  return transporter.sendMail(mailOptions)
    .then(() => {
      console.log(`Email sent to ${email} with OTP: ${otp}`); 
    })
    .catch((error) => {
      console.error("Error in sendOtpEmail:", error);
      throw error;
    });
};

module.exports = { sendOtpEmail };
