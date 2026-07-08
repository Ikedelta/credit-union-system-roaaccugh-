import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-super-secret-jwt-key-change-in-production";

export interface AuthRequest extends Request {
  adminId?: number;
  adminRole?: string;
}

export const authenticateAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  // Bypass in development mode for easier testing
  if (process.env.NODE_ENV !== "production" && process.env.BYPASS_AUTH !== "false") {
    req.adminId = 1;
    req.adminRole = "SUPERADMIN";
    return next();
  }

  let token = req.cookies?.token;
  if (!token && req.headers.authorization?.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { adminId: number, role: string };
    req.adminId = decoded.adminId;
    req.adminRole = decoded.role;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid or expired token." });
  }
};

export const authenticateSuperAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  authenticateAdmin(req, res, () => {
    if (req.adminRole !== "SUPERADMIN") {
      return res.status(403).json({ error: "Access denied. Super Admin privileges required." });
    }
    next();
  });
};
