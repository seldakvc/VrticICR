import jwt from "jsonwebtoken";
import ApiError from "./ApiError.js";

function getJwtConfiguration() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new ApiError(500, "JWT_SECRET is not configured.");
  }

  const algorithm = process.env.JWT_ALGO || "HS256";
  const supportedAlgorithms = ["HS256", "HS384", "HS512"];
  if (!supportedAlgorithms.includes(algorithm)) {
    throw new ApiError(500, "JWT_ALGO must be HS256, HS384, or HS512.");
  }

  return { algorithm, secret };
}

function getTokenTtl() {
  const ttl = Number(process.env.JWT_TTL || 60);
  if (!Number.isFinite(ttl) || ttl <= 0) {
    throw new ApiError(500, "JWT_TTL must be a positive number of minutes.");
  }
  return ttl;
}

function assertTokenConfiguration() {
  getJwtConfiguration();
  getTokenTtl();
}

function createToken(user, role) {
  const { algorithm, secret } = getJwtConfiguration();
  const ttl = getTokenTtl();

  return jwt.sign(
    { role },
    secret,
    {
      algorithm,
      expiresIn: `${ttl}m`,
      subject: user._id.toString(),
    },
  );
}

function verifyToken(token) {
  const { algorithm, secret } = getJwtConfiguration();
  return jwt.verify(token, secret, { algorithms: [algorithm] });
}

export { assertTokenConfiguration, createToken, verifyToken };
