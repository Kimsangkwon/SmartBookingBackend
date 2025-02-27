import mongoose from "mongoose";

const UserProfileSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true }, // Connect to login user
    firstName: { type: String, required: true, minlength: 2 },
    lastName: { type: String, required: true, minlength: 2 },
    uniqueDisplayName: { type: String, required: true, unique: true, minlength: 2 },
    phoneNumber: { type: String, required: true, match: /^[0-9]{10}$/ }, 
    country: { type: String, required: true, minlength: 2 },
    province: { type: String, required: true, minlength: 2 },
    city: { type: String, required: true, minlength: 2 },
    address1: { type: String, required: true, minlength: 2 },
    address2: { type: String, minlength: 2 }, // Optional
    birthdate: { type: Date, required: true },
    createdAt: { type: Date, default: Date.now }
});

const UserProfile = mongoose.model("UserProfile", UserProfileSchema);
export default UserProfile;
