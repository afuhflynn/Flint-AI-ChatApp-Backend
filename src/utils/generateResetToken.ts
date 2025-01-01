import crypto from "node:crypto";

const generateResetToken = async () => {
  const resetToken = await crypto.randomBytes(60).toString("hex");
  const expiresAt = Date.now() + 1 * 60 * 60 * 1000;
  return { resetToken, expiresAt };
};
export default generateResetToken;
