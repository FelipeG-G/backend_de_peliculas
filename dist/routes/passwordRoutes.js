"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const PasswordController_1 = __importDefault(require("../controllers/PasswordController"));
const router = (0, express_1.Router)();
/**
 * @route POST /password/forgot-password
 * @description Send password reset email
 * @access Public
 */
router.post("/forgot-password", (req, res) => {
    PasswordController_1.default.forgotPassword(req, res);
});
/**
 * @route POST /password/reset-password/:token
 * @description Reset user password using token
 * @access Public
 */
router.post("/reset-password/:token", (req, res) => {
    PasswordController_1.default.resetPassword(req, res);
});
exports.default = router;
//# sourceMappingURL=passwordRoutes.js.map