import { config } from "dotenv";
config();
const allowedOrigins = [
    process.env.CLIENT_URL,
    process.env.EXTERNAL_CLIENT_URL,
];
export default allowedOrigins;
//# sourceMappingURL=corsOptions.js.map