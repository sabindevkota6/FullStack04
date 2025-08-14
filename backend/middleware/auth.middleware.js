import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Authentication token missing" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Add user info to request
    req.user = { userId: decoded.userId };

    next();
  } catch (error) {
    console.error("Auth middleware error:", error);

    if (error.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ message: "Token expired, please login again" });
    }

    return res.status(401).json({ message: "Invalid authentication" });
  }
};
