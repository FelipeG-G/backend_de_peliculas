"use strict";
/**
 * @file PasswordController.ts
 * @description Controller responsible for managing the complete flow of password recovery
 * and reset for users. Supports email sending with both SendGrid and Nodemailer (fallback mode).
 *
 * @module Controllers/PasswordController
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const allowedOrigins_1 = require("../config/allowedOrigins");
const crypto_1 = __importDefault(require("crypto"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const mail_1 = __importDefault(require("@sendgrid/mail"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
const User_1 = __importDefault(require("../models/User"));
dotenv_1.default.config();
/**
 * Configure SendGrid if the API key is available.
 * If not, the system will use Nodemailer as a fallback.
 */
if (process.env.SENDGRID_API_KEY) {
    mail_1.default.setApiKey(process.env.SENDGRID_API_KEY);
    console.log("✅ SendGrid configured successfully");
}
else {
    console.warn("⚠️ SENDGRID_API_KEY not found, Nodemailer will be used as fallback");
}
/**
 * Controller for handling password recovery and reset processes.
 *
 * @class PasswordController
 * @classdesc Manages password recovery (forgotPassword)
 * and password reset (resetPassword) operations.
 */
class PasswordController {
    /**
     * @async
     * @method forgotPassword
     * @description Step 1 of the recovery process:
     * receives the user’s email, generates a reset token,
     * stores it in the database, and sends an email with a secure link.
     *
     * @param {Request} req - Express request object containing the user's email.
     * @param {Response} res - Express response object to send the result.
     *
     * @returns {Promise<void>} JSON response with confirmation or error message.
     *
     * @example
     * // POST /api/auth/forgot-password
     * {
     *   "email": "user@email.com"
     * }
     */
    async forgotPassword(req, res) {
        try {
            const { email } = req.body;
            if (!email) {
                res.status(400).json({ msg: "The 'email' field is required" });
                return;
            }
            const user = (await User_1.default.findOne({ email }));
            if (!user) {
                res.status(404).json({ msg: "User not found" });
                return;
            }
            // Generate unique reset token
            const resetToken = crypto_1.default.randomBytes(32).toString("hex");
            user.resetPasswordToken = resetToken;
            user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour
            await user.save();
            // Reset link
            const origin = req.headers.origin;
            if (!origin || !allowedOrigins_1.allowedOrigins.includes(origin)) {
                res.status(403).json({ msg: "Origin not allowed" });
                return;
            }
            const resetURL = `${origin}/#/new-password?token=${resetToken}`;
            const htmlMessage = `
        <p>Hello ${user.username || "user"},</p>
        <p>You requested to reset your password.</p>
        <p>Click the following link to set a new password:</p>
        <a href="${resetURL}">${resetURL}</a>
        <p>⚠️ This link will expire in 1 hour.</p>
      `;
            console.log("📧 Sending email to:", user.email);
            console.log("🔗 Password reset URL:", resetURL);
            // Send email using SendGrid or fallback to Nodemailer
            // if (process.env.SENDGRID_API_KEY) {
            //   try {
            //     await sgMail.send({
            //       to: user.email,
            //       from: "movienest1009@gmail.com", // Must be verified in SendGrid
            //       subject: "Password Recovery",
            //       html: htmlMessage,
            //     });
            //     console.log("✅ Email sent using SendGrid");
            //   } catch (err: any) {
            //     console.error("❌ Error sending with SendGrid:", err.response?.body || err);
            //     throw new Error("Error sending email with SendGrid");
            //   }
            // } else {
            // Fallback: send email using Nodemailer (local or no SendGrid)
            if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
                throw new Error("Missing EMAIL_USER or EMAIL_PASS in .env file");
            }
            const transporter = nodemailer_1.default.createTransport({
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
                    subject: "Recuperacion de contraseña",
                    html: htmlMessage,
                });
                console.log("✅ Email sent using Nodemailer");
            }
            catch (err) {
                console.error("❌ Error sending with Nodemailer:", err);
                throw new Error("Error sending email with Nodemailer");
            }
            res.json({ msg: "A password recovery email has been sent" });
        }
        catch (err) {
            console.error("🔥 Full ForgotPassword error:", err);
            res.status(500).json({
                msg: "Server error",
                error: err.message || JSON.stringify(err),
            });
        }
    }
    /**
     * @async
     * @method resetPassword
     * @description Step 2 of the recovery process:
     * validates the received token and updates the user's password.
     *
     * @param {Request} req - Express request object containing the token and new password.
     * @param {Response} res - Express response object to send the result.
     *
     * @returns {Promise<void>} JSON response with success or error message.
     *
     * @example
     * // POST /api/auth/reset-password
     * {
     *   "token": "a12b3c4d5e6f",
     *   "newPassword": "newPassword123"
     * }
     */
    async resetPassword(req, res) {
        try {
            const { token, newPassword } = req.body;
            if (!token || !newPassword) {
                res.status(400).json({ msg: "Token and new password are required" });
                return;
            }
            const user = (await User_1.default.findOne({
                resetPasswordToken: token,
                resetPasswordExpires: { $gt: Date.now() },
            }));
            if (!user) {
                res.status(400).json({ msg: "Invalid or expired token" });
                return;
            }
            const salt = await bcryptjs_1.default.genSalt(10);
            user.password = await bcryptjs_1.default.hash(newPassword, salt);
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;
            await user.save();
            res.json({ msg: "Password successfully updated" });
        }
        catch (err) {
            console.error("🔥 Full ResetPassword error:", err);
            res.status(500).json({
                msg: "Server error",
                error: err.message || JSON.stringify(err),
            });
        }
    }
}
exports.default = new PasswordController();
//# sourceMappingURL=PasswordController.js.map