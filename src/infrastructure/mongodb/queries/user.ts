import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User";
import dependencies from "../../../infrastructure/dependencies";
import UserProfile from "../models/userProfile";

const { config } = dependencies;
const { secret, admin_email, admin_password } = config;

export const registerUser = async (email: string, password: string) => {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new Error("User already exists");
    }

    const salt = await bcrypt.genSalt();
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

export const loginAsAdmin = async (email: string, password: string) => {
    console.log("Trying admin login with:", email, password);

    if (email === admin_email && password === admin_password) {
      const token = jwt.sign(
        { userId: "admin-id", email, role: "admin" },secret,{ expiresIn: "1h" }
      );
      return token;
    }
    return null;
  };

export const getUserProfile = async (userId: string) => {
    return await UserProfile.findOne({ userId });
};

export const saveUserProfile = async (userId: string, profileData: any) => {
    let profile = await UserProfile.findOne({ userId });

    if (profile) {
        Object.assign(profile, profileData);
        await profile.save();
        return { message: "Profile updated successfully", profile };
    } else {
        profile = new UserProfile({ userId, ...profileData });
        await profile.save();
        return { message: "Profile created successfully", profile };
    }
};
