"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = __importDefault(require("crypto"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const mail_1 = __importDefault(require("@sendgrid/mail"));
const User_1 = __importDefault(require("../models/User")); // ✅ importa bien el modelo y la interfaz
mail_1.default.setApiKey(process.env.SENDGRID_API_KEY || "");
/**
 * Controlador de recuperación y restablecimiento de contraseña.
 */
class PasswordController {
    /**
     * Paso 1: Solicitar recuperación de contraseña
     */
    async forgotPassword(req, res) {
        try {
            const { email } = req.body;
            const user = (await User_1.default.findOne({ email })); // ✅ casteo explícito
            if (!user) {
                res.status(404).json({ msg: "Usuario no encontrado" });
                return;
            }
            const resetToken = crypto_1.default.randomBytes(32).toString("hex");
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
            await mail_1.default.send(msg);
            res.json({ msg: "Se envió un email para recuperar tu contraseña" });
        }
        catch (err) {
            console.error("ForgotPassword error:", err.response?.body || err);
            res.status(500).json({ msg: "Error en el servidor" });
        }
    }
    /**
     * Paso 2: Restablecer la contraseña con el token
     */
    async resetPassword(req, res) {
        try {
            const { token, newPassword } = req.body;
            const user = (await User_1.default.findOne({
                resetPasswordToken: token,
                resetPasswordExpires: { $gt: Date.now() },
            })); // ✅ casteo explícito
            if (!user) {
                res.status(400).json({ msg: "Token inválido o expirado" });
                return;
            }
            const salt = await bcryptjs_1.default.genSalt(10);
            user.password = await bcryptjs_1.default.hash(newPassword, salt);
            // Limpiar el token
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;
            await user.save();
            res.json({ msg: "Contraseña actualizada correctamente" });
        }
        catch (err) {
            console.error("ResetPassword error:", err);
            res.status(500).json({ msg: "Error en el servidor" });
        }
    }
}
exports.default = new PasswordController();
//# sourceMappingURL=PasswordController.js.map