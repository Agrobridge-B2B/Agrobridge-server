import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User';
import { generateToken } from '../utils/jwt';
import { generateCryptoToken } from '../utils/cryptoToken';
import crypto from 'crypto';

/* ======================================================
   AUTH CONTROLLER — USER REGISTRATION
   Goal: Create a new user and issue a token
====================================================== */

export const register = async (req: Request, res: Response) => {
    try {
        const { fullName, email, password, country, role } = req.body;

        if (!fullName || !email || !password || !country || !role) {
            return res.status(400).json({
                message: "All fields are required",
            })
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({
                message: "User with this email already exists",
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const { raw, hashed } = generateCryptoToken();

        const user = await User.create({
            fullName,
            email,
            password: hashedPassword,
            country,
            role,
            emailVerificationToken: hashed,
            emailVerificationExpires: new Date(Date.now() + 1000 * 60 * 60 * 24), // 24 hours from now
        });

        const verificationLink = `${process.env.CLIENT_URL}/verify-email?token=${raw}`;

        return res.status(201).json({
            message: "Registration successful! Please verify your email.",
            verificationLink, // temporary for testing
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                country: user.country,
                role: user.role,
            },
        });
    } catch (error) {
        return res.status(500).json({
            message: "Registration failed",
        });
    }
}

/* ======================================================
   AUTH CONTROLLER — USER LOGIN
   Goal: Authenticate user credentials
====================================================== */

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required",
            });
        }

        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password",
            });
        }

        if (!user.isVerified) {
            return res.status(403).json({
                message: 'Please verify your email before logging in',
            });
        }

        if (user.isBlocked) {
            return res.status(403).json({
                message: "Your account has been blocked. Please contact support.",
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid email or password",
            });
        }

        const token = generateToken({
            id: user._id,
            role: user.role
        });

        return res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                country: user.country,
                role: user.role,
            },
        });

    } catch (error) {
        return res.status(500).json({
            message: "Login failed",
        });
    }
}

/* ======================================================
   AUTH CONTROLLER — RESET PASSWORD
   Goal: Reset user password using token
====================================================== */

export const resetPassword = async (req: Request, res: Response) => {
    try {
        const { token, password } = req.body;

        if (!token || !password) {
            return res.status(400).json({ message: 'Invalid request' });
        }

        const hashedToken = crypto
            .createHash('sha256')
            .update(token)
            .digest('hex');

        const user = await User.findOne({
            passwordResetToken: hashedToken,
            passwordResetExpires: { $gt: new Date() },
        }).select('+password');

        if (!user) {
            return res.status(400).json({ message: 'Token expired or invalid' });
        }

        user.password = await bcrypt.hash(password, 10);
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;

        await user.save();

        res.status(200).json({ message: 'Password reset successful' });
    } catch {
        res.status(500).json({ message: 'Password reset failed' });
    }
};

/* ======================================================
   AUTH CONTROLLER — FORGOT PASSWORD
   Goal: Initiate password reset process
====================================================== */

export const forgotPassword = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                message: 'Email is required',
            });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(200).json({
                message: 'If email exists, reset link was sent',
            });
        }

        const { raw, hashed } = generateCryptoToken();

        user.passwordResetToken = hashed;
        user.passwordResetExpires = new Date(Date.now() + 1000 * 60 * 60); // 1 hour

        await user.save();

        const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${raw}`;

        return res.status(200).json({
            message: 'Password reset link sent',
            resetLink,
        });

    } catch (error) {
        console.error('Forgot password error:', error);
        return res.status(500).json({
            message: 'Failed to send reset email',
            error: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : 'Unknown error') : undefined,
        });
    }
};

/* ======================================================
   AUTH CONTROLLER — VERIFY EMAIL
   Goal: Verify user's email address
====================================================== */

export const verifyEmail = async (req: Request, res: Response) => {
    try {
        const { token } = req.query;

        if (!token || typeof token !== 'string') {
            return res.status(400).json({ message: 'Invalid token' });
        }

        const hashedToken = crypto
            .createHash('sha256')
            .update(token)
            .digest('hex');

        const user = await User.findOne({
            emailVerificationToken: hashedToken,
            emailVerificationExpires: { $gt: new Date() },
        });

        if (!user) {
            return res.status(400).json({
                message: 'Verification token is invalid or expired',
            });
        }

        user.isVerified = true;
        user.emailVerificationToken = undefined;
        user.emailVerificationExpires = undefined;

        await user.save();

        return res.status(200).json({
            message: 'Email verified successfully. You can now log in.',
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Email verification failed',
        });
    }
};