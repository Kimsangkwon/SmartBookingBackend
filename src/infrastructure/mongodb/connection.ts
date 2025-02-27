import mongoose from "mongoose";
import {config} from "../../config/config"

const mongoDb = config.mongo.url;

export const ConnectToDb = async () => {
  try {
      if (!mongoDb) {
          throw new Error("❌ MongoDB URL is empty. Check your environment variables!");
      }

      console.log(`🔗 Connecting to MongoDB: ${mongoDb}`);
      await mongoose.connect(mongoDb, {});
      console.log("✅ Successfully connected to MongoDB");
  } catch (err) {
      console.error("❌ MongoDB connection error:", err);
      process.exit(1);
  }
};

