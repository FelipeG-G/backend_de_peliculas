import { Request, Response } from "express";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import sgMail from "@sendgrid/mail";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import User, { IUser } from "../models/User";

dotenv.config();

/**
 * Configurar SendGrid si existe la API key
 */
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  console.log("✅ SendGrid configurado correctamente");
} else {
  console.warn("⚠️ No se encontró SENDGRID_API_KEY, se usará Nodemailer como respaldo");
}

/**
 * Controlador para recuperación y restablecimiento de contraseña.
 */
class PasswordController {
  /**
   * Paso 1: Solicitar recuperación de contraseña
   */
  async forgotPassword(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;

      if (!email) {
        res.status(400).json({ msg: "El campo 'email' es obligatorio" });
        return;
      }

      const user = (await User.findOne({ email })) as IUser;
      if (!user) {
        res.status(404).json({ msg: "Usuario no encontrado" });
        return;
      }

      // Generar token único
      const resetToken = crypto.randomBytes(32).toString("hex");
      user.resetPasswordToken = resetToken;
      user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hora
      await user.save();

      // URL de recuperación
      const resetURL = `https://to-do-list-client-nextstep.vercel.app/#/reset-password?token=${resetToken}`;
      // const resetURL = `http://localhost:5173/#/reset-password?token=${resetToken}`;

      const htmlMessage = `
        <p>Hola ${user.username || "usuario"},</p>
        <p>Has solicitado recuperar tu contraseña.</p>
        <p>Haz clic en el siguiente enlace para restablecerla:</p>
        <a href="${resetURL}">${resetURL}</a>
        <p>⚠️ Este enlace expirará en 1 hora.</p>
      `;

      console.log("📧 Enviando correo a:", user.email);
      console.log("🔗 URL de recuperación:", resetURL);

      // === ENVÍO DEL CORREO ===
      if (process.env.SENDGRID_API_KEY) {
        try {
          await sgMail.send({
            to: user.email,
            from: "movienestplataforma@gmail.com", // Debe estar verificado en SendGrid
            subject: "Recuperación de contraseña",
            html: htmlMessage,
          });
          console.log("✅ Correo enviado con SendGrid");
        } catch (err: any) {
          console.error("❌ Error enviando con SendGrid:", err.response?.body || err);
          throw new Error("Error al enviar el correo con SendGrid");
        }
      } else {
        // === Fallback: Nodemailer (modo local o sin SendGrid)
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
          throw new Error("Faltan EMAIL_USER o EMAIL_PASS en el archivo .env");
        }

        const transporter = nodemailer.createTransport({
          host: "smtp.gmail.com",
          port: 465,
          secure: true,
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        });

        try {
          await transporter.sendMail({
            from: `"MovieNest" <${process.env.EMAIL_USER}>`,
            to: user.email,
            subject: "Recuperación de contraseña",
            html: htmlMessage,
          });
          console.log("✅ Correo enviado con Nodemailer");
        } catch (err: any) {
          console.error("❌ Error enviando con Nodemailer:", err);
          throw new Error("Error al enviar el correo con Nodemailer");
        }
      }

      res.json({ msg: "Se envió un email para recuperar tu contraseña" });
    } catch (err: any) {
      console.error("🔥 ForgotPassword error completo:", err);
      res.status(500).json({
        msg: "Error en el servidor",
        error: err.message || JSON.stringify(err),
      });
    }
  }

  /**
   * Paso 2: Restablecer la contraseña con el token
   */
  async resetPassword(req: Request, res: Response): Promise<void> {
    try {
      const { token, newPassword } = req.body;

      if (!token || !newPassword) {
        res.status(400).json({ msg: "Token y nueva contraseña son requeridos" });
        return;
      }

      const user = (await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() },
      })) as IUser;

      if (!user) {
        res.status(400).json({ msg: "Token inválido o expirado" });
        return;
      }

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();

      res.json({ msg: "Contraseña actualizada correctamente" });
    } catch (err: any) {
      console.error("🔥 ResetPassword error completo:", err);
      res.status(500).json({
        msg: "Error en el servidor",
        error: err.message || JSON.stringify(err),
      });
    }
  }
}

export default new PasswordController();
