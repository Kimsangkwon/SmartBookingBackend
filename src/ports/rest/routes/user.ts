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

ConnectToDb();

router.post("/create", async (req: Request, res: Response, next: NextFunction) => {

    try {
        const email = req.body.email;
        const userPassword = req.body.userPassword;
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ error: "User already exists" });
        }
        
        const salt = await bcrypt.genSalt(10); 
        const hashedPassword = await bcrypt.hash(userPassword, salt);

        const newUser = new User({ email, userPassword: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: "User registered successfully." });

    } catch (error) {
        res.status(500).json({
          message: `Error in user/create: ${JSON.stringify((error as Error).message)}`
        });
      }
})


router.post("/login", async (req, res) => {
    const {config} = dependencies;
    const {secret} = config;
    try {
        const { email, userPassword } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const isPasswordValid = await bcrypt.compare(userPassword, user.userPassword);
        if (!isPasswordValid) {
            return res.status(401).json({ error: "Invalid password" });
        }

        const token = jwt.sign({ userId: user._id, email: user.email }, secret, { expiresIn: "1h" });
        res.status(200).json({ accessToken: token });
    } catch (error) {
        res.status(500).json({ error:"Error at /login" });
    }
});


router.post("/checkUserAuthenticated", authenticateToken, async (req: any, res: any, next: any) => {
    try {
        const user = req.user;
        console.log(user);
        res.json({
            // Will also contain an IAT which is the time when the token was issued
            message: "Users token is valid",
            user,
        })

    } catch (error) {
        console.log(`Error in retrieving shopping cart: ${JSON.stringify((error as Error).message)}`);
        res.status(500).json({
            message: `Error in retrieving shopping cart: ${JSON.stringify((error as Error).message)}`
        });
    }
})

router.get("/profile",authenticateToken, async (req: any, res: any) => {
    try {
        const userId = req.user?.id;        //current user id
        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        const profile = await findUserProfile(userId);
        if (!profile) {
            return res.status(200).json({ profile: null }); // if no profile, return empty form
        }

        res.status(200).json(profile);
    } catch (error) {
        console.error("❌ Error fetching user profile:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.post("/profile", authenticateToken, async (req: any, res: any) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        const validationError = validateProfileData(req.body); // validate data in the controller
        if (validationError) {
            return res.status(400).json(validationError);
        }

        const profileData = req.body;
        const result = await updateUserProfile(userId, profileData);
        return res.status(200).json(result);

    } catch (error) {
        console.error("❌ Error creating/updating user profile:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
export = router;


