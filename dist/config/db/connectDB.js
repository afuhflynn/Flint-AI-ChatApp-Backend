var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import mongoose from "mongoose";
import dotenv from "dotenv";
import logger from "../../utils/loger.js";
dotenv.config();
const disConnectDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield mongoose.disconnect();
        logger.error(`Disconnected from db`);
    }
    catch (error) {
        logger.error(`Error disconnecting from db: ${error.message}`);
        process.exit(1);
    }
});
const connectDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const conn = yield mongoose.connect(process.env.MONGODB_URL);
        logger.error(`MongoDB Connected: ${conn.connection.host}`);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    }
    catch (error) {
        logger.error(`Error connecting to db: ${error.message}`);
        disConnectDB();
        process.exit(1);
    }
});
export default connectDB;
//# sourceMappingURL=connectDB.js.map