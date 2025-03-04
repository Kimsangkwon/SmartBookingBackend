import mongoose from "mongoose";

let isConnected = false; // Track connection status

export async function ConnectToDb() {
    if (!process.env.MONGO_URL) {
        throw new Error("❌ MONGO_URL is not defined. Check your .env.test file.");
    }

    if (mongoose.connection.readyState !== 0) {
        console.log("⚠️ Using existing MongoDB connection");
        return;
    }

    try {
        console.log(`🔗 Connecting to MongoDB: ${process.env.MONGO_URL}`);
        await mongoose.connect(process.env.MONGO_URL);
        console.log("✅ Successfully connected to MongoDB");
    } catch (error) {
        console.error("❌ MongoDB connection error:", error);
    }
}

export async function DisconnectDb() {
    if (isConnected) {
        await mongoose.disconnect();
        isConnected = false;
        console.log("🔌 Disconnected from MongoDB");
    }
}
