import jwt from "jsonwebtoken";
import { config } from "dotenv";

// Load env vars
config();

const generateTokens = async (
  id: string | unknown,
  email: string,
  username: string,
  userRole: string
): Promise<{
  accessToken: string;
  accessTokenExpiresAt: Date;
  refreshToken: string;
  refreshTokenExpiresAt: Date;
}> => {
  const privateAccessKey: string | undefined = process.env.ACCESS_TOKEN_SECRET!;
  const privateRefreshKey: string | undefined =
    process.env.REFRESH_TOKEN_SECRET!;

  if (!privateAccessKey) {
    throw new Error(
      "ACCESS_TOKEN_SECRET is not defined in the environment variables."
    );
  }

  const accessToken = await jwt.sign(
    { id: id, email: email, username: username, role: userRole },
    privateAccessKey,
    { algorithm: "HS256", expiresIn: "1h" }
  );

  const refreshToken = await jwt.sign(
    { id: id, email: email, username: username, role: userRole },
    privateRefreshKey,
    { algorithm: "HS256", expiresIn: "30d" }
  );

  const accessTokenExpiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
  const refreshTokenExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

  return {
    accessToken,
    accessTokenExpiresAt,
    refreshToken,
    refreshTokenExpiresAt,
  };
};

export default generateTokens;
