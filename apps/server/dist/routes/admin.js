"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "your-super-secret-jwt-key-change-in-production";
// --- AUTHENTICATION ---
// Login
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const admin = await prisma.admin.findUnique({ where: { email } });
        if (!admin) {
            return res.status(401).json({ error: "Invalid email or password" });
        }
        const isMatch = await bcrypt_1.default.compare(password, admin.password);
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid email or password" });
        }
        const token = jsonwebtoken_1.default.sign({ adminId: admin.id, role: admin.role }, JWT_SECRET, { expiresIn: "1d" });
        // Set cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 24 * 60 * 60 * 1000, // 1 day
        });
        res.json({ success: true, token, admin: { id: admin.id, name: admin.name, email: admin.email, role: admin.role } });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Login failed" });
    }
});
// Verify Auth
router.get("/me", auth_1.authenticateAdmin, async (req, res) => {
    try {
        const adminReq = req;
        const admin = await prisma.admin.findUnique({
            where: { id: adminReq.adminId },
            select: { id: true, name: true, email: true, role: true },
        });
        if (!admin)
            return res.status(404).json({ error: "Admin not found" });
        res.json({ admin });
    }
    catch (err) {
        res.status(500).json({ error: "Failed to verify session" });
    }
});
// Logout
router.post("/logout", (req, res) => {
    res.clearCookie("token");
    res.json({ success: true });
});
// --- DATA MANAGEMENT ---
// All routes below require authentication
router.use(auth_1.authenticateAdmin);
// Memberships
router.get("/memberships", async (req, res) => {
    try {
        const applications = await prisma.memberApplication.findMany({ orderBy: { createdAt: "desc" } });
        res.json(applications);
    }
    catch (err) {
        res.status(500).json({ error: "Failed to fetch memberships" });
    }
});
router.patch("/memberships/:id/status", async (req, res) => {
    try {
        const { status } = req.body;
        const application = await prisma.memberApplication.update({
            where: { id: parseInt(req.params.id) },
            data: { status },
        });
        res.json(application);
    }
    catch (err) {
        res.status(500).json({ error: "Failed to update status" });
    }
});
// Loans
router.get("/loans", async (req, res) => {
    try {
        const applications = await prisma.loanApplication.findMany({ orderBy: { createdAt: "desc" } });
        res.json(applications);
    }
    catch (err) {
        res.status(500).json({ error: "Failed to fetch loans" });
    }
});
router.patch("/loans/:id/status", async (req, res) => {
    try {
        const { status } = req.body;
        const application = await prisma.loanApplication.update({
            where: { id: parseInt(req.params.id) },
            data: { status },
        });
        res.json(application);
    }
    catch (err) {
        res.status(500).json({ error: "Failed to update status" });
    }
});
// Welfare
router.get("/welfare", async (req, res) => {
    try {
        const applications = await prisma.welfareApplication.findMany({ orderBy: { createdAt: "desc" } });
        res.json(applications);
    }
    catch (err) {
        res.status(500).json({ error: "Failed to fetch welfare applications" });
    }
});
router.patch("/welfare/:id/status", async (req, res) => {
    try {
        const { status } = req.body;
        const application = await prisma.welfareApplication.update({
            where: { id: parseInt(req.params.id) },
            data: { status },
        });
        res.json(application);
    }
    catch (err) {
        res.status(500).json({ error: "Failed to update status" });
    }
});
// Contact Messages
router.get("/messages", async (req, res) => {
    try {
        const messages = await prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" } });
        res.json(messages);
    }
    catch (err) {
        res.status(500).json({ error: "Failed to fetch messages" });
    }
});
// --- CMS ROUTES ---
router.get("/content", async (req, res) => {
    try {
        const content = await prisma.websiteContent.findMany();
        res.json(content);
    }
    catch (err) {
        res.status(500).json({ error: "Failed to fetch content" });
    }
});
router.put("/content/:key", async (req, res) => {
    try {
        const { value, type } = req.body;
        const content = await prisma.websiteContent.upsert({
            where: { key: req.params.key },
            update: { value, type },
            create: { key: req.params.key, value, type: type || "TEXT" },
        });
        res.json(content);
    }
    catch (err) {
        res.status(500).json({ error: "Failed to update content" });
    }
});
// --- SMS MOCK ROUTE ---
router.post("/sms/send", async (req, res) => {
    try {
        const { recipients, message } = req.body;
        const adminReq = req;
        // Create an SMS log for each recipient
        const logs = [];
        for (const recipient of recipients) {
            logs.push({
                recipient,
                message,
                status: "SENT",
                senderId: adminReq.adminId,
            });
        }
        await prisma.smsLog.createMany({ data: logs });
        // In a real app, you would call Twilio or Africa's Talking here
        res.json({ success: true, message: `Sent ${recipients.length} messages.` });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to send SMS" });
    }
});
// --- USER MANAGEMENT (SUPERADMIN ONLY) ---
const auth_2 = require("../middleware/auth");
router.get("/users", auth_2.authenticateSuperAdmin, async (req, res) => {
    try {
        const users = await prisma.admin.findMany({
            select: { id: true, name: true, email: true, role: true, createdAt: true },
        });
        res.json(users);
    }
    catch (err) {
        res.status(500).json({ error: "Failed to fetch users" });
    }
});
router.post("/users", auth_2.authenticateSuperAdmin, async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        const user = await prisma.admin.create({
            data: { name, email, password: hashedPassword, role: role || "ADMIN" },
            select: { id: true, name: true, email: true, role: true },
        });
        res.json(user);
    }
    catch (err) {
        res.status(500).json({ error: "Failed to create user" });
    }
});
router.delete("/users/:id", auth_2.authenticateSuperAdmin, async (req, res) => {
    try {
        const adminReq = req;
        const userId = parseInt(req.params.id);
        if (adminReq.adminId === userId) {
            return res.status(400).json({ error: "Cannot delete yourself." });
        }
        await prisma.admin.delete({ where: { id: userId } });
        res.json({ success: true });
    }
    catch (err) {
        res.status(500).json({ error: "Failed to delete user" });
    }
});
exports.default = router;
//# sourceMappingURL=admin.js.map