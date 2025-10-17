import { Request, Response } from "express";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import sgMail from "@sendgrid/mail";
import User, { IUser } from "../models/User"; // ✅ importa bien el modelo y la interfaz

sgMail.setApiKey(process.env.SENDGRID_API_KEY || "");

/**
 * Controlador de recuperación y restablecimiento de contraseña.
 */
class PasswordController {
  /**
   * Paso 1: Solicitar recuperación de contraseña
   */
  async forgotPassword(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;
      const user = (await User.findOne({ email })) as IUser; // ✅ casteo explícito

      if (!user) {
        res.status(404).json({ msg: "Usuario no encontrado" });
        return;
      }

      const resetToken = crypto.randomBytes(32).toString("hex");
      user.resetPasswordToken = resetToken;
      user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hora

      await user.save();

      // URL del cliente para restablecer contraseña
      const resetURL = `https://to-do-list-client-nextstep.vercel.app/#/reset-password?token=${resetToken}`;
      // Si trabajas en local:
      // const resetURL = `http://localhost:5173/#/reset-password?token=${resetToken}`;

      const msg = {
        to: user.email,
        from: "movienestplataforma@gmail.com", // debe estar verificado en SendGrid
        subject: "Recuperación de contraseña",
        html: `
          <p>Has solicitado recuperar tu contraseña</p>
          <p>Haz clic aquí: <a href="${resetURL}">${resetURL}</a></p>
        `,
      };

      await sgMail.send(msg);
      res.json({ msg: "Se envió un email para recuperar tu contraseña" });
    } catch (err: any) {
      console.error("ForgotPassword error:", err.response?.body || err);
      res.status(500).json({ msg: "Error en el servidor" });
    }
  }

  /**
   * Paso 2: Restablecer la contraseña con el token
   */
  async resetPassword(req: Request, res: Response): Promise<void> {
    try {
      const { token, newPassword } = req.body;

      const user = (await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() },
      })) as IUser; // ✅ casteo explícito

      if (!user) {
        res.status(400).json({ msg: "Token inválido o expirado" });
        return;
      }

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);

      // Limpiar el token
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;

      await user.save();

      res.json({ msg: "Contraseña actualizada correctamente" });
    } catch (err) {
      console.error("ResetPassword error:", err);
      res.status(500).json({ msg: "Error en el servidor" });
    }
  }
}

export default new PasswordController();
