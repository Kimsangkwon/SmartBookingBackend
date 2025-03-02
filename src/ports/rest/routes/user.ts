import express, { NextFunction, Response, Request } from "express";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import crypto from "crypto";
import { authenticateToken } from '../middleware/authentication';
import { ConnectToDb } from "../../../infrastructure/mongodb/connection";
import User from "../../../infrastructure/mongodb/models/User";
import dependencies from "../../../infrastructure/dependencies";
import { validateProfileData } from "../../../controllers/validateProfileData";
import { findUserProfile, updateUserProfile } from "../../../infrastructure/userProfileRepository";

const router = express.Router();

// Establish database connection
ConnectToDb();

/**
 * Route: POST /create
 * Description: Registers a new user by storing their email and hashed password.
 */
router.post("/create", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const email = req.body.email;
        const userPassword = req.body.userPassword;

        // Check if user already exists in the database
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "User already exists" });
        }
        
        // Generate salt and hash the password
        const salt = await bcrypt.genSalt(10); 
        const hashedPassword = await bcrypt.hash(userPassword, salt);

        // Create new user document and save it in the database
        const newUser = new User({ email, userPassword: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: "User registered successfully." });

    } catch (error) {
        res.status(500).json({
          message: `Error in user/create: ${JSON.stringify((error as Error).message)}`
        });
    }
});

/**
 * Route: POST /login
 * Description: Authenticates the user by verifying their email and password, then generates a JWT token.
 */
router.post("/login", async (req, res) => {
    const { config } = dependencies;
    const { secret } = config;

    try {
        const { email, userPassword } = req.body;

        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Compare provided password with the stored hashed password
        const isPasswordValid = await bcrypt.compare(userPassword, user.userPassword);
        if (!isPasswordValid) {
            return res.status(401).json({ error: "Invalid password" });
        }

        // Generate JWT token
        const token = jwt.sign({ userId: user._id, email: user.email }, secret, { expiresIn: "1h" });

        res.status(200).json({ accessToken: token });

    } catch (error) {
        res.status(500).json({ error: "Error at /login" });
    }
});

/**
 * Route: POST /checkUserAuthenticated
 * Description: Validates the JWT token and returns user details if the token is valid.
 */
router.post("/checkUserAuthenticated", authenticateToken, async (req: any, res: any, next: any) => {
    try {
        const user = req.user;
        console.log(user);

        res.json({
            message: "User's token is valid",
            user,
        });

    } catch (error) {
        console.log(`Error in retrieving user authentication: ${JSON.stringify((error as Error).message)}`);
        res.status(500).json({
            message: `Error in retrieving user authentication: ${JSON.stringify((error as Error).message)}`
        });
    }
});

/**
 * Route: GET /profile
 * Description: Retrieves the authenticated user's profile.
 */
router.get("/profile", authenticateToken, async (req: any, res: any) => {
    try {
        const userId = req.user?.id; // Extract user ID from JWT token
        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        // Fetch user profile from the database
        const profile = await findUserProfile(userId);
        if (!profile) {
            return res.status(200).json({ profile: null }); // If no profile exists, return empty response
        }

        res.status(200).json(profile);

    } catch (error) {
        console.error("❌ Error fetching user profile:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

/**
 * Route: POST /profile
 * Description: Creates or updates the authenticated user's profile.
 */
router.post("/profile", authenticateToken, async (req: any, res: any) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        // Validate the incoming profile data
        const validationError = validateProfileData(req.body);
        if (validationError) {
            return res.status(400).json(validationError);
        }

        // Update user profile
        const profileData = req.body;
        const result = await updateUserProfile(userId, profileData);

        return res.status(200).json(result);

    } catch (error) {
        console.error("❌ Error creating/updating user profile:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

export = router;
