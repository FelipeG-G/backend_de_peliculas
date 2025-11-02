/**
 * @file controllers/UserController.ts
 * @description Main User Controller. Manages user registration, authentication, 
 * password reset, profile handling, and basic CRUD operations on the User model.
 * 
 * Uses SendGrid for email delivery and JWT for authentication.
 * 
 * @module Controllers/UserController
 */

import { Request, Response } from "express";
import GlobalController from "./GlobalController"; 
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User";
import sgMail from "@sendgrid/mail";
import crypto from "crypto";
import UserDAO from "../dao/UserDAO";

// SendGrid configuration using API Key from environment variables
sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

/**
 * Sends a password reset email to the user.
 * 
 * @async
 * @function sendResetEmail
 * @param {string} email - User's email address.
 * @param {string} token - Unique reset token.
 * @throws {Error} If the email fails to send.
 */
const sendResetEmail = async (email: string, token: string) => {
  const resetUrl = `https://to-do-list-client-movienest.vercel.app/#/new-password/${token}`;

  const msg = {
    to: email,
    from: {
      email: process.env.EMAIL_USER as string,
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

  await sgMail.send(msg);
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
export const requestPasswordReset = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user)
      return res.status(404).json({ message: "User not found" });

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpires = Date.now() + 3600000; // 1 hour

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = new Date(resetTokenExpires);
    await user.save();

    await sendResetEmail(email, resetToken);
    res.json({ message: "Password reset email sent successfully" });
  } catch (error: any) {
    res.status(500).json({
      message: "Error processing password reset request.",
      details: error.message,
    });
  }
};

/**
 * Resets the user's password using a valid reset token.
 * 
 * @async
 * @function resetPassword
 * @param {Request} req - Contains the token and the new password.
 * @param {Response} res - Returns success or error message.
 * @returns {Promise<Response>}
 */
export const resetPassword = async (req: Request, res: Response) => {
  const { token, newPassword } = req.body;

  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user)
      return res.status(400).json({ message: "❌ Token expired or invalid" });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    return res.status(200).json({ message: "✅ Password successfully reset" });
  } catch (error) {
    return res.status(500).json({ message: "❌ Error resetting password", error });
  }
};

/**
 * Registers a new user in the database.
 * 
 * @async
 * @function registerUser
 * @param {Request} req - Contains user data (username, email, password, etc.).
 * @param {Response} res - Returns success or error message.
 * @returns {Promise<Response>}
 */
export const registerUser = async (req: Request, res: Response) => {
  const { username, lastname, birthdate, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "❌ This email is already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      lastname,
      birthdate,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    return res.status(201).json({ message: "✅ User registered successfully" });
  } catch (error: any) {
    return res.status(500).json({
      message: "❌ Error registering user",
      error: error.message,
    });
  }
};

/**
 * Logs in an existing user and returns a JWT token.
 * 
 * @async
 * @function loginUser
 * @param {Request} req - Contains email and password.
 * @param {Response} res - Returns a JWT if credentials are valid.
 * @returns {Promise<Response>}
 */
export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "❌ Invalid email or password" });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.status(400).json({ message: "❌ Invalid email or password" });

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" }
    );

    return res.status(200).json({
      message: "✅ Login successful",
      token,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "❌ Error during login attempt",
      error: error.message,
    });
  }
};

/**
 * Retrieves the authenticated user's profile using the JWT token.
 * 
 * @async
 * @function getProfile
 * @param {Request} req - Must include the Authorization header with JWT.
 * @param {Response} res - Returns user data without the password field.
 * @returns {Promise<Response>}
 */
export const getProfile = async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Token not provided" });

    if (!process.env.JWT_SECRET)
      return res.status(500).json({ message: "JWT secret not configured" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET as jwt.Secret) as { userId: string };
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ user });
  } catch (error: any) {
    res.status(401).json({ message: "Invalid or expired token", error: error.message });
  }
};

/**
 * Updates the authenticated user's profile information.
 * 
 * @async
 * @function updateProfile
 * @param {Request} req - Contains updated profile data.
 * @param {Response} res - Returns confirmation message and updated user data.
 * @returns {Promise<Response>}
 */
export const updateProfile = async (req: Request, res: Response) => {
  try {
    const { email, username, lastname, birthdate, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: "❌ User not found" });

    if (username) user.username = username;
    if (lastname) user.lastname = lastname;
    if (birthdate) user.birthdate = birthdate;
    if (password) user.password = await bcrypt.hash(password, 10);
    if (email) user.email = email;
    await user.save();

    return res.status(200).json({
      message: "✅ Profile updated successfully",
      user,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "❌ Error updating profile",
      error: error.message,
    });
  }
};

/**
 * Deletes the authenticated user's account.
 * 
 * @async
 * @function deleteProfile
 * @param {Request} req - Must include the Authorization header with JWT.
 * @param {Response} res - Returns success or error message.
 * @returns {Promise<Response>}
 */
export const deleteProfile = async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Token not provided" });

    if (!process.env.JWT_SECRET)
      return res.status(500).json({ message: "JWT secret not configured" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET as jwt.Secret) as { userId: string };
    const user = await User.findById(decoded.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    await user.deleteOne();
    return res.status(200).json({ message: "✅ Account deleted successfully" });
  } catch (error: any) {
    return res.status(500).json({ message: "❌ Error deleting account", error: error.message });
  }
};

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
const globalController = new GlobalController(UserDAO);
const UserController = {
  create: globalController.create.bind(globalController),
  read: globalController.read.bind(globalController),
  update: globalController.update.bind(globalController),
  delete: globalController.delete.bind(globalController),
  getAll: globalController.getAll.bind(globalController),
  registerUser,
  loginUser,
  requestPasswordReset,
  resetPassword,
  getProfile,
  updateProfile,
  deleteProfile
};

export default UserController;
