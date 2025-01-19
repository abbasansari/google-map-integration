import mongoose from "mongoose";
export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected successfully".bgBlue);
  } catch (err) {
    console.error("MongoDB connection failed:".bgRed, err.message);
    process.exit(1);
  }
};
