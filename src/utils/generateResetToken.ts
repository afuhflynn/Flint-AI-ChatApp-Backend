import crypto from "node:crypto";

const generateResetToken = async () => {
  const resetToken = await crypto.randomBytes(60).toString("hex");
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
  return { resetToken, expiresAt };
};
export default generateResetToken;
