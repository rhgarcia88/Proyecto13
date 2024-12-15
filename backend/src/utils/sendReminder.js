const nodemailer = require("nodemailer");

const sendReminder = async (email, subscriptionName, renewalDate) => {

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER, 
      pass: process.env.EMAIL_PASS, 
    },
  });

 
  const mailOptions = {
    from: `"SmartySub" <${process.env.EMAIL_USER}>`, // Sender
    to: email, 
    subject: `Reminder: Your subscription to ${subscriptionName} is renewing soon`,
    text: `Hey! Remember that your subscription to ${subscriptionName} is renewing on ${new Date(
      renewalDate
    ).toLocaleDateString()}. Make sure you have sufficient funds or review your payment method.`,
    html: `
      <h1>Don't forget to renew your subscription!</h1>
      <p>Your subscription to <strong>${subscriptionName}</strong> is renewing on <strong>${new Date(
      renewalDate
    ).toLocaleDateString()}</strong>.</p>
      <p>Make sure you have sufficient funds or check your payment method.</p>
      <p>Thank you for using SmartySub!</p>
    `,
  };

  // Send the email
  try {
    await transporter.sendMail(mailOptions);
    console.log(`Reminder sent to ${email} for the subscription ${subscriptionName}`);
  } catch (error) {
    console.error(`Error sending reminder to ${email}:`, error.message);
  }
};

module.exports = sendReminder;
