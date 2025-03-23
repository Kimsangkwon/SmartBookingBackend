import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User";
import dependencies from "../../../infrastructure/dependencies";
import { findUserProfile, updateUserProfile } from "../../../infrastructure/userProfileRepository";

const { config } = dependencies;
const { secret } = config;

export const registerUser = async (email: string, password: string) => {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new Error("User already exists");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({ email, userPassword: hashedPassword });
    await newUser.save();
};

export const loginUser = async (email: string, password: string) => {
    const user = await User.findOne({ email });
    if (!user) throw new Error("User not found");

    const isPasswordValid = await bcrypt.compare(password, user.userPassword);
    if (!isPasswordValid) throw new Error("Invalid password");

    const token = jwt.sign({ userId: user._id, email: user.email }, secret, { expiresIn: "1h" });
    return token;
};

export const getUserProfile = async (userId: string) => {
    return await findUserProfile(userId);
};

export const saveUserProfile = async (userId: string, profileData: any) => {
    return await updateUserProfile(userId, profileData);
};
