const nodemailer = require("nodemailer");

exports.handler = async function (event) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  try {
    const data = JSON.parse(event.body);

    // transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // your gmail
        pass: process.env.EMAIL_PASS, // app password
      },
    });

    const mailOptions = {
      from: `"MoneyMarket Loan App" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_RECEIVER,
      subject: "📩 New Loan Application",
      html: `
        <h2>New Loan Application Received</h2>
        <p><b>Name:</b> ${data.name}</p>
        <p><b>Company:</b> ${data.company}</p>
        <p><b>Email:</b> ${data.email}</p>
        <p><b>Phone:</b> ${data.phone}</p>
        <p><b>City:</b> ${data.city}</p>
        <p><b>Pincode:</b> ${data.pincode}</p>
        <p><b>Loan Amount:</b> ₹${data.loanAmount}</p>
        <p><b>Loan Purpose:</b> ${data.loanPurpose}</p>
        <p><b>Monthly Income:</b> ₹${data.monthlyIncome}</p>
        <p><b>Credit Score:</b> ${data.creditScore}</p>
        <p><b>Message:</b> ${data.message || "N/A"}</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, message: "Application sent!" }),
    };
  } catch (err) {
    console.error("Email error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        error: "Failed to send application",
      }),
    };
  }
};
