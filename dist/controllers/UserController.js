"use strict";
/**
 * @file controllers/UserController.ts
 * @description Main User Controller. Manages user registration, authentication,
 * password reset, profile handling, and basic CRUD operations on the User model.
 *
 * Uses SendGrid for email delivery and JWT for authentication.
 *
 * @module Controllers/UserController
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProfile = exports.updateProfile = exports.getProfile = exports.loginUser = exports.registerUser = exports.resetPassword = exports.requestPasswordReset = void 0;
const GlobalController_1 = __importDefault(require("./GlobalController"));
const allowedOrigins_1 = require("../config/allowedOrigins");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const mail_1 = __importDefault(require("@sendgrid/mail"));
const crypto_1 = __importDefault(require("crypto"));
const UserDAO_1 = __importDefault(require("../dao/UserDAO"));
// SendGrid configuration using API Key from environment variables
mail_1.default.setApiKey(process.env.SENDGRID_API_KEY);
/**
 * Sends a password reset email to the user.
 *
 * @async
 * @function sendResetEmail
 * @param {string} email - User's email address.
 * @param {string} token - Unique reset token.
 * @throws {Error} If the email fails to send.
 */
const sendResetEmail = async (email, token, origin) => {
    const resetUrl = `${origin}/#/new-password/${token}`;
    const msg = {
        to: email,
        from: {
            email: process.env.EMAIL_USER,
            name: "MovieNest 🎬",
        },
        subject: "Password Reset Request",
        html: `
      <p>Hello,</p>
      <p>You have requested to reset your password.</p>
      <p>Click the link below to continue:</p>
      <a href="${resetUrl}" target="_blank">${resetUrl}</a>
      <p>If you didn’t request this change, please ignore this email.</p>
      <br/>
      <p>Best regards,<br/>The MovieNest 🎬 Team</p>
    `,
    };
    await mail_1.default.send(msg);
};
/**
 * Handles password reset requests by generating a temporary token
 * and sending it to the user's email.
 *
 * @async
 * @function requestPasswordReset
 * @param {Request} req - HTTP request object.
 * @param {Response} res - HTTP response object.
 * @returns {Promise<Response>} A success or error message.
 */
const requestPasswordReset = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User_1.default.findOne({ email });
        if (!user)
            return res.status(404).json({ message: "User not found" });
        const resetToken = crypto_1.default.randomBytes(32).toString("hex");
        const resetTokenExpires = Date.now() + 3600000; // 1 hour
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = new Date(resetTokenExpires);
        await user.save();
        const origin = req.headers.origin;
        if (!origin || !allowedOrigins_1.allowedOrigins.includes(origin)) {
            return res.status(403).json({ msg: "Origin not allowed" });
        }
        await sendResetEmail(email, resetToken, origin);
        res.json({ message: "Password reset email sent successfully" });
    }
    catch (error) {
        res.status(500).json({
            message: "Error processing password reset request.",
            details: error.message,
        });
    }
};
exports.requestPasswordReset = requestPasswordReset;
/**
 * Resets the user's password using a valid reset token.
 *
 * @async
 * @function resetPassword
 * @param {Request} req - Contains the token and the new password.
 * @param {Response} res - Returns success or error message.
 * @returns {Promise<Response>}
 */
const resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;
    try {
        const user = await User_1.default.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() },
        });
        if (!user)
            return res.status(400).json({ message: "❌ Token expired or invalid" });
        const hashedPassword = await bcrypt_1.default.hash(newPassword, 10);
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();
        return res.status(200).json({ message: "✅ Password successfully reset" });
    }
    catch (error) {
        return res.status(500).json({ message: "❌ Error resetting password", error });
    }
};
exports.resetPassword = resetPassword;
/**
 * Registers a new user in the database.
 *
 * @async
 * @function registerUser
 * @param {Request} req - Contains user data (username, email, password, etc.).
 * @param {Response} res - Returns success or error message.
 * @returns {Promise<Response>}
 */
const registerUser = async (req, res) => {
    const { username, lastname, birthdate, email, password } = req.body;
    try {
        const existingUser = await User_1.default.findOne({ email });
        if (existingUser)
            return res.status(400).json({ message: "❌ This email is already registered" });
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        const newUser = new User_1.default({
            username,
            lastname,
            birthdate,
            email,
            password: hashedPassword,
        });
        await newUser.save();
        return res.status(201).json({ message: "✅ User registered successfully" });
    }
    catch (error) {
        return res.status(500).json({
            message: "❌ Error registering user",
            error: error.message,
        });
    }
};
exports.registerUser = registerUser;
/**
 * Logs in an existing user and returns a JWT token.
 *
 * @async
 * @function loginUser
 * @param {Request} req - Contains email and password.
 * @param {Response} res - Returns a JWT if credentials are valid.
 * @returns {Promise<Response>}
 */
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User_1.default.findOne({ email });
        if (!user)
            return res.status(400).json({ message: "❌ Invalid email or password" });
        const isPasswordValid = await bcrypt_1.default.compare(password, user.password);
        if (!isPasswordValid)
            return res.status(400).json({ message: "❌ Invalid email or password" });
        const token = jsonwebtoken_1.default.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "1h" });
        return res.status(200).json({
            message: "✅ Login successful",
            token,
        });
    }
    catch (error) {
        return res.status(500).json({
            message: "❌ Error during login attempt",
            error: error.message,
        });
    }
};
exports.loginUser = loginUser;
/**
 * Retrieves the authenticated user's profile using the JWT token.
 *
 * @async
 * @function getProfile
 * @param {Request} req - Must include the Authorization header with JWT.
 * @param {Response} res - Returns user data without the password field.
 * @returns {Promise<Response>}
 */
const getProfile = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(" ")[1];
        if (!token)
            return res.status(401).json({ message: "Token not provided" });
        if (!process.env.JWT_SECRET)
            return res.status(500).json({ message: "JWT secret not configured" });
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const user = await User_1.default.findById(decoded.userId).select("-password");
        if (!user)
            return res.status(404).json({ message: "User not found" });
        res.json({ user });
    }
    catch (error) {
        res.status(401).json({ message: "Invalid or expired token", error: error.message });
    }
};
exports.getProfile = getProfile;
/**
 * Updates the authenticated user's profile information.
 *
 * @async
 * @function updateProfile
 * @param {Request} req - Contains updated profile data.
 * @param {Response} res - Returns confirmation message and updated user data.
 * @returns {Promise<Response>}
 */
const updateProfile = async (req, res) => {
    try {
        const { email, username, lastname, birthdate, password } = req.body;
        const user = await User_1.default.findOne({ email });
        if (!user)
            return res.status(404).json({ message: "❌ User not found" });
        if (username)
            user.username = username;
        if (lastname)
            user.lastname = lastname;
        if (birthdate)
            user.birthdate = birthdate;
        if (password)
            user.password = await bcrypt_1.default.hash(password, 10);
        if (email)
            user.email = email;
        await user.save();
        return res.status(200).json({
            message: "✅ Profile updated successfully",
            user,
        });
    }
    catch (error) {
        return res.status(500).json({
            message: "❌ Error updating profile",
            error: error.message,
        });
    }
};
exports.updateProfile = updateProfile;
/**
 * Deletes the authenticated user's account.
 *
 * @async
 * @function deleteProfile
 * @param {Request} req - Must include the Authorization header with JWT.
 * @param {Response} res - Returns success or error message.
 * @returns {Promise<Response>}
 */
const deleteProfile = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(" ")[1];
        if (!token)
            return res.status(401).json({ message: "Token not provided" });
        if (!process.env.JWT_SECRET)
            return res.status(500).json({ message: "JWT secret not configured" });
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const user = await User_1.default.findById(decoded.userId);
        if (!user)
            return res.status(404).json({ message: "User not found" });
        await user.deleteOne();
        return res.status(200).json({ message: "✅ Account deleted successfully" });
    }
    catch (error) {
        return res.status(500).json({ message: "❌ Error deleting account", error: error.message });
    }
};
exports.deleteProfile = deleteProfile;
/**
 * Combined User Controller.
 * Merges generic GlobalController methods with user-specific logic.
 *
 * @constant
 * @type {Object}
 * @property {Function} create - Create a new record.
 * @property {Function} read - Retrieve a record by ID.
 * @property {Function} update - Update a record.
 * @property {Function} delete - Delete a record.
 * @property {Function} getAll - Retrieve all records.
 * @property {Function} registerUser - User registration.
 * @property {Function} loginUser - User login.
 * @property {Function} requestPasswordReset - Password reset request.
 * @property {Function} resetPassword - Password reset.
 * @property {Function} getProfile - Retrieve user profile.
 * @property {Function} updateProfile - Update user profile.
 * @property {Function} deleteProfile - Delete user account.
 */
const globalController = new GlobalController_1.default(UserDAO_1.default);
const UserController = {
    create: globalController.create.bind(globalController),
    read: globalController.read.bind(globalController),
    update: globalController.update.bind(globalController),
    delete: globalController.delete.bind(globalController),
    getAll: globalController.getAll.bind(globalController),
    registerUser: exports.registerUser,
    loginUser: exports.loginUser,
    requestPasswordReset: exports.requestPasswordReset,
    resetPassword: exports.resetPassword,
    getProfile: exports.getProfile,
    updateProfile: exports.updateProfile,
    deleteProfile: exports.deleteProfile
};
exports.default = UserController;
//# sourceMappingURL=UserController.js.map