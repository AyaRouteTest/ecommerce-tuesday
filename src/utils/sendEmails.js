import nodemailer from "nodemailer";
export const sendEmail = async ({ to, subject, html, attachments }) => {
  // sender
  const transporter = nodemailer.createTransport({
    host: "localhost",
    port: 465,
    secure: true,
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAILPASS,
    },
  });

  // receiver
  const emailInfo = await transporter.sendMail({
    from: `"Route Academy" <${process.env.EMAIL}>`,
    to,
    subject,
    html,
    attachments,
  });

  return emailInfo.accepted.length > 0 ? true : false;
};
