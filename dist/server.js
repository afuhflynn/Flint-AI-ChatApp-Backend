import express from "express";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import { config } from "dotenv";
import { fileURLToPath } from "node:url";
import geminiRouter from "./routes/gemini.route.js";
import connectDB from "./config/db/connectDB.js";
import mongoose from "mongoose";
import path from "node:path";
import githubAuth from "./config/passwordJs.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Connect to MongoDB
connectDB();
// Initialize envs vars
config();
// Create a new express application instance
const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());
app.use(morgan("dev"));
app.use(cors());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use("/assist", geminiRouter);
app.use("/github-auth", (req, res) => {
    githubAuth(req, res);
});
app.get("/", (_, res) => {
    res.send("Hello, world!");
});
// Target wrong routes
app.get("*", (req, res) => {
    if (req.accepts("json"))
        res.status(404).json({ success: false, message: "Page not found!" });
    if (req.accepts("text"))
        res.status(404).send("Page not found!");
    if (req.accepts("html"))
        return res
            .status(404)
            .sendFile(path.join(__dirname, "views", "404page.html"));
});
mongoose.connection.once("open", () => {
    app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
    });
});
//# sourceMappingURL=server.js.map