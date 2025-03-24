import express, { Request, Response } from "express";
import { authenticateToken } from "../middleware/authentication";
import { validateProfileData } from "../../../controllers/validateProfileData";
import {registerUser, loginUser, getUserProfile, saveUserProfile} from "../../../infrastructure/mongodb/queries/user";

const router = express.Router();
//Create user account
router.post("/create", async (req: Request, res: Response) => {
    try {
        const { email, userPassword } = req.body;
        await registerUser(email, userPassword);
        res.status(201).json({ message: "User registered successfully." });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

//login
router.post("/login", async (req: Request, res: Response) => {
    try {
        const { email, userPassword } = req.body;
        const token = await loginUser(email, userPassword);
        res.status(200).json({ accessToken: token });
    } catch (error: any) {
        res.status(401).json({ error: error.message });
    }
});

//logout
router.post("/logout", authenticateToken, (_req, res) => {
    res.status(200).json({ message: "Logout successful. Please delete token on client side." });
});


 //checkUserAuthenticated
router.post("/checkUserAuthenticated", authenticateToken, (req: any, res: any) => {
    res.json({ message: "User's token is valid", user: req.user });
});

//get user profile
router.get("/profile", authenticateToken, async (req: any, res: Response) => {
    try {
        const profile = await getUserProfile(req.user.id);
        res.status(200).json(profile ? profile : { profile: null });
    } catch {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

//post user profile
router.post("/profile", authenticateToken, async (req: any, res: Response) => {
    const validationError = validateProfileData(req.body);
    if (validationError) return res.status(400).json(validationError);

    try {
        const result = await saveUserProfile(req.user.id, req.body);
        res.status(200).json(result);
    } catch {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

export = router;
