import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function testEmail() {
  try {
    const info = await transporter.sendMail({
      from: `"MovieNest" <${process.env.EMAIL_USER}>`,
      to: "andresfelipemurilli@gmail.com",
      subject: "Prueba de correo - MovieNest",
      html: `
        <h1>Prueba de MovieNest</h1>
        <p>Si recibes este correo, Nodemailer está funcionando correctamente.</p>
      `,
    });

    console.log("✅ Correo enviado correctamente");
    console.log("Message ID:", info.messageId);
  } catch (error) {
    console.error("❌ Error enviando correo:");
    console.error(error);
  }
}

testEmail();