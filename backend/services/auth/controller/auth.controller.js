import { randomUUID } from "node:crypto";
import { getAuth } from "firebase-admin/auth";
import { app } from "../config/firebase.js";
import User from "../models/user.model.js";
import redis from "../../../shared/redis/redis.js";

const SESSION_TTL = 7 * 24 * 60 * 60; // seconds (Redis uses seconds)

export const login = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(400).json({ message: "Token is required" });
    }

    const decoded = await getAuth(app).verifyIdToken(token);

    let user = await User.findOne({ firebaseUid: decoded.uid });
    if (!user) {
      user = await User.create({
        firebaseUid: decoded.uid,
        name: decoded.name,
        email: decoded.email,
        avatar: decoded.picture,
      });
    }

    const sessionId = randomUUID();

    await redis.set(
      `session:${sessionId}`,
      JSON.stringify({
        userId: user._id,
        name: decoded.name,
        email: decoded.email,
        avatar: decoded.picture,
      }),
      "EX",
      SESSION_TTL,
    );

    res.cookie("session", sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: SESSION_TTL * 1000, // cookies use milliseconds
    });

    return res.status(200).json(user);
  } catch (error) {
    console.error("Login error:", error);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export const logout = async (req, res) => {
  try {
    const sessionId = req?.cookies?.session;
    await redis.del(`session:${sessionId}`);
    res.clearCookie("session");
    return res.status(200).json({ message: "Logout successfully!" });
  } catch (error) {
    return res.status(401).json({ message: "Logout Error" });
  }
};
