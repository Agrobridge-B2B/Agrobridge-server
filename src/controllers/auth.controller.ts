import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User';
import { generateToken } from '../utils/jwt';

// Register a new user
/**
 * @route   POST /api/auth/register
 */

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

        const user = await User.create({
            fullName,
            email,
            password: hashedPassword,
            country,
            role,
        });

        const token = generateToken({
            id: user._id,
            role: user.role
        });

        return res.status(201).json({
            message: "User registered successfully",
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
            message: "Registration failed",
        });
    }
}

/**
 * @route   POST /api/auth/login
 */
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