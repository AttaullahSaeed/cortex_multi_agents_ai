import redis from "../../shared/redis/redis.js";

export const protect = async (req, res, next) => {
  try {
    const sessionId = req?.cookies?.session;
    if (!sessionId) {
      return res.status(400).json({ message: "unauthorized" });
    }
    const session = await redis.get(`session:${sessionId}`);
    if (!session) {
      return res.status(400).json({ message: "session expire" });
    }
    req.user = JSON.parse(session);
    next();
  } catch (error) {
    return res.status(400).json({ message: `protected route error ${error}` });
  }
};
