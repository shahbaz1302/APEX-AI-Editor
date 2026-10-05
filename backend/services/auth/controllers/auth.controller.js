import { app } from "../config/firebase.js";
import { getAuth } from "firebase-admin/auth";
import userModel from "../models/user.model.js";
import crypto from "crypto";
import redis from "../../../shared/redis/redis.js";

export const login = async (req, res) => {
  try {
    const { token } = req.body;
    const decoded = await getAuth(app).verifyIdToken(token);
    let user = await userModel.findOne({
      $or: [{ firebaseUid: decoded.uid }, { email: decoded.email }],
    });

    if (!user) {
      user = await userModel.create({
        firebaseUid: decoded.uid,
        name: decoded.name,
        email: decoded.email,
        avatar: decoded.picture || "",
      });
    }

    const sessionId = crypto.randomUUID();

    await redis.set(
      `user-session-${user._id}`,
      sessionId,
      "EX",
      7 * 24 * 60 * 60,
    );

    await redis.set(
      `session-${sessionId}`,
      JSON.stringify({
        name: user.name,
        _id: user._id,
        email: user.email,
        avatar: user.avatar,
        credits: user.credits,
      }),
      "EX",
      7 * 24 * 60 * 60,
    );

    res.cookie("session", sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production" ? true : false,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json(user);
  } catch (error) {
    console.error("Login error:", error);
    return res
      .status(500)
      .json({ message: `Login error ${error.message || error}` });
  }
};

export const logout = async (req, res) => {
  try {
    const sessionId = req.cookies?.session;
    await redis.del(`session-${sessionId}`);
    res.clearCookie("session");
    return res.status(200).json({ message: "Logout successfully" });
  } catch (error) {
    return res.status(500).json({ message: `Logout error ${error}` });
  }
};

export const deductCredits = async (req, res) => {
  try {
    const { userId, amount } = req.body;
    if (!userId) {
      return res.status(401).json({ message: "User id not found" });
    }

    const user = await userModel
      .findOneAndUpdate(
        { _id: userId, credits: { $gte: amount } },
        { $inc: { credits: -amount } },
        { returnDocument: "after" },
      )
      .select("credits");

    if (!user) {
      return res.status(401).json({ message: "Insufficient credits" });
    }

    const sessionId = await redis.get(`user-session-${userId}`);

    await redis.set(
      `session-${sessionId}`,
      JSON.stringify({
        name: user.name,
        _id: user._id,
        email: user.email,
        avatar: user.avatar,
        credits: user.credits,
      }),
      "EX",
      7 * 24 * 60 * 60,
    );

    return res.status(200).json({ credits: user.credits });
  } catch (error) {
    return res.status(500).json({ message: `Deduct credits ${error}` });
  }
};

export const addCredits = async (req, res) => {
  try {
    const { userId, credits } = req.body;
    if (!userId) {
      return res.status(401).json({ message: "User id not found" });
    }

    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    user.credits = (user.credits || 0) + credits;
    await user.save();

    const sessionId = await redis.get(`user-session-${userId}`);

    await redis.set(
      `session-${sessionId}`,
      JSON.stringify({
        name: user.name,
        _id: user._id,
        email: user.email,
        avatar: user.avatar,
        credits: user.credits,
      }),
      "EX",
      7 * 24 * 60 * 60,
    );

    return res.status(200).json(user.credits);
  } catch (error) {
    return res.status(500).json({ message: `Add credits error ${error}` });
  }
};
