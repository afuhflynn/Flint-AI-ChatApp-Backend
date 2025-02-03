import mongoose from "mongoose";
import dotenv from "dotenv";
import logger from "../../utils/loger.js";

dotenv.config();

const disConnectDB = async () => {
  try {
    await mongoose.disconnect();
    logger.error(`Disconnected from db`);
  } catch (error: any | { message: string }) {
    logger.error(`Error disconnecting from db: ${error.message}`);
    process.exit(1);
  }
};

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URL!);
    logger.error(`MongoDB Connected: ${conn.connection.host}`);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error: any | { message: string }) {
    logger.error(`Error connecting to db: ${error.message}`);
    disConnectDB();
    process.exit(1);
  }
};

export default connectDB;
