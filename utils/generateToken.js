// generateToken.js
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';
const JWT_EXPIRY = process.env.JWT_EXPIRY || '24h';

export function generateToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { 
    expiresIn: JWT_EXPIRY 
  });
}