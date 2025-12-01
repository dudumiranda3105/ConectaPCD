"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authService = __importStar(require("../services/auth.service"));
const passwordReset_controller_1 = require("./passwordReset.controller");
const rateLimiter_1 = require("../middleware/rateLimiter");
const router = (0, express_1.Router)();
// Rotas de reset de senha (com rate limiting)
router.post("/forgot-password", rateLimiter_1.passwordResetLimiter, passwordReset_controller_1.PasswordResetController.forgotPassword);
router.get("/validate-reset-token/:token", passwordReset_controller_1.PasswordResetController.validateToken);
router.post("/reset-password", rateLimiter_1.passwordResetLimiter, passwordReset_controller_1.PasswordResetController.resetPassword);
router.post("/register", rateLimiter_1.registerLimiter, async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        // log keys received to help debug missing fields (avoid logging password value)
        try {
            const keys = Object.keys(req.body || {});
            console.debug('[AUTH][REGISTER] received body keys:', keys);
            console.debug('[AUTH][REGISTER] presence:', { name: !!name, email: !!email, password: !!password });
        }
        catch (e) {
            console.debug('[AUTH][REGISTER] could not inspect body');
        }
        const missing = [];
        if (!name)
            missing.push('name');
        if (!email)
            missing.push('email');
        if (!password)
            missing.push('password');
        if (missing.length) {
            return res.status(400).json({ error: `Missing fields: ${missing.join(', ')}` });
        }
        const result = await authService.register({ name, email, password, role });
        res.status(201).json(result);
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
});
router.post("/login", rateLimiter_1.authLimiter, async (req, res) => {
    try {
        const { email, password } = req.body;
        // log keys received to help debug missing fields (avoid logging password value)
        try {
            const keys = Object.keys(req.body || {});
            console.debug('[AUTH][LOGIN] received body keys:', keys);
            console.debug('[AUTH][LOGIN] presence:', { email: email, password: password });
        }
        catch (e) {
            console.debug('[AUTH][LOGIN] could not inspect body');
        }
        if (!email || !password)
            return res.status(400).json({ error: 'email and password are required' });
        const result = await authService.login(email, password);
        res.json(result);
    }
    catch (err) {
        res.status(401).json({ error: err.message });
    }
});
exports.default = router;
//# sourceMappingURL=auth.controller.js.map