import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

// Ensure that environment variables are correctly loaded
if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  console.error("Missing EMAIL_USER or EMAIL_PASS in environment variables");
  process.exit(1);
}

const transporter = nodemailer.createTransport({
  service: "gmail", // our service provider
  auth: {
    user: process.env.EMAIL_USER, //From
    pass: process.env.EMAIL_PASS,
  },
});

transporter.verify(function (error, success) {
  if (error) {
    console.log("Error verifying transporter configuration:", error);
  } else {
    console.log("Server is ready to take our messages");
  }
});

function sendVerificationEmail(user, token) {
  const url = `http://localhost:3000/api/auth/verify/${token}`;

  let mailOptions = {
    from: process.env.EMAIL_USER, // From address
    to: user.email, // To address
    subject: "Verify Your Email",
    html: `<h1>Email Verification</h1>
            <p>Please verify your email by clicking the link below:</p>
            <a href="${url}">Verify Email</a>`,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      return console.log("Error sending email:", error);
    }
    console.log("Email sent successfully:", info.response);
  });
}

export default sendVerificationEmail;
