"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateSuperAdmin = exports.authenticateAdmin = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || "your-super-secret-jwt-key-change-in-production";
const authenticateAdmin = (req, res, next) => {
    let token = req.cookies?.token;
    if (!token && req.headers.authorization?.startsWith("Bearer ")) {
        token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
        return res.status(401).json({ error: "Access denied. No token provided." });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        req.adminId = decoded.adminId;
        req.adminRole = decoded.role;
        next();
    }
    catch (error) {
        return res.status(401).json({ error: "Invalid or expired token." });
    }
};
exports.authenticateAdmin = authenticateAdmin;
const authenticateSuperAdmin = (req, res, next) => {
    (0, exports.authenticateAdmin)(req, res, () => {
        if (req.adminRole !== "SUPERADMIN") {
            return res.status(403).json({ error: "Access denied. Super Admin privileges required." });
        }
        next();
    });
};
exports.authenticateSuperAdmin = authenticateSuperAdmin;
//# sourceMappingURL=auth.js.map