import { config } from "dotenv";

config();

export const defaultAvatarUrl: string =
  "https://cdn-icons-png.flaticon.com/128/149/149071.png";

export const clientBaseUrl = process.env.CLIENT_URL!;
