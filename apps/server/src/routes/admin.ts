import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { authenticateAdmin, AuthRequest } from "../middleware/auth";

const router = Router();
const prisma = new PrismaClient();
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

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign({ adminId: admin.id, role: admin.role }, JWT_SECRET, { expiresIn: "1d" });

    // Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    res.json({ success: true, token, admin: { id: admin.id, name: admin.name, email: admin.email, role: admin.role } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Login failed" });
  }
});

// Verify Auth
router.get("/me", authenticateAdmin, async (req, res) => {
  try {
    const adminReq = req as AuthRequest;
    const admin = await prisma.admin.findUnique({
      where: { id: adminReq.adminId },
      select: { id: true, name: true, email: true, role: true },
    });
    if (!admin) return res.status(404).json({ error: "Admin not found" });
    res.json({ admin });
  } catch (err) {
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
router.use(authenticateAdmin);

// Memberships
router.get("/memberships", async (req, res) => {
  try {
    const applications = await prisma.memberApplication.findMany({ orderBy: { createdAt: "desc" } });
    res.json(applications);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch memberships" });
  }
});

router.patch("/memberships/:id/status", async (req, res) => {
  try {
    const adminReq = req as AuthRequest;
    const { status } = req.body;
    const application = await prisma.memberApplication.update({
      where: { id: parseInt(req.params.id) },
      data: { status },
    });
    await createAuditLog(adminReq.adminId, `${status}_MEMBERSHIP`, `Membership ID: ${application.id}`);
    res.json(application);
  } catch (err) {
    res.status(500).json({ error: "Failed to update status" });
  }
});

// Loans
router.get("/loans", async (req, res) => {
  try {
    const applications = await prisma.loanApplication.findMany({ orderBy: { createdAt: "desc" } });
    res.json(applications);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch loans" });
  }
});

router.patch("/loans/:id/status", async (req, res) => {
  try {
    const adminReq = req as AuthRequest;
    const { status } = req.body;
    const application = await prisma.loanApplication.update({
      where: { id: parseInt(req.params.id) },
      data: { status },
    });
    await createAuditLog(adminReq.adminId, `${status}_LOAN`, `Loan ID: ${application.id}`);
    res.json(application);
  } catch (err) {
    res.status(500).json({ error: "Failed to update status" });
  }
});

// Welfare
router.get("/welfare", async (req, res) => {
  try {
    const applications = await prisma.welfareApplication.findMany({ orderBy: { createdAt: "desc" } });
    res.json(applications);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch welfare applications" });
  }
});

router.patch("/welfare/:id/status", async (req, res) => {
  try {
    const adminReq = req as AuthRequest;
    const { status } = req.body;
    const application = await prisma.welfareApplication.update({
      where: { id: parseInt(req.params.id) },
      data: { status },
    });
    await createAuditLog(adminReq.adminId, `${status}_WELFARE`, `Welfare ID: ${application.id}`);
    res.json(application);
  } catch (err) {
    res.status(500).json({ error: "Failed to update status" });
  }
});

// Contact Messages
router.get("/messages", async (req, res) => {
  try {
    const messages = await prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" } });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

// --- HELPER FOR AUDIT LOGGING ---
const createAuditLog = async (adminId: number, action: string, details?: string) => {
  try {
    const admin = await prisma.admin.findUnique({ where: { id: adminId } });
    if (admin) {
      await prisma.auditLog.create({
        data: {
          adminId: admin.id,
          adminName: admin.name,
          action,
          details,
        },
      });
    }
  } catch (err) {
    console.error("Failed to create audit log", err);
  }
};

// --- CMS ROUTES ---
router.get("/content", async (req, res) => {
  try {
    const content = await prisma.websiteContent.findMany();
    res.json(content);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch content" });
  }
});

router.put("/content/:key", async (req, res) => {
  try {
    const adminReq = req as AuthRequest;
    const { value, type } = req.body;
    const content = await prisma.websiteContent.upsert({
      where: { key: req.params.key },
      update: { value, type },
      create: { key: req.params.key, value, type: type || "TEXT" },
    });
    
    await createAuditLog(adminReq.adminId, "UPDATED_CMS", `Updated CMS key: ${req.params.key}`);
    
    res.json(content);
  } catch (err) {
    res.status(500).json({ error: "Failed to update content" });
  }
});

// --- SMS MOCK ROUTE ---
router.post("/sms/send", async (req, res) => {
  try {
    const { recipients, message } = req.body;
    const adminReq = req as AuthRequest;
    
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
    
    await createAuditLog(adminReq.adminId, "SENT_SMS", `Sent SMS to ${recipients.length} recipients`);
    
    // In a real app, you would call Twilio or Africa's Talking here
    res.json({ success: true, message: `Sent ${recipients.length} messages.` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to send SMS" });
  }
});

// --- USER MANAGEMENT & AUDIT LOGS (SUPERADMIN ONLY) ---
import { authenticateSuperAdmin } from "../middleware/auth";

router.get("/users", authenticateSuperAdmin, async (req, res) => {
  try {
    const users = await prisma.admin.findMany({
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

router.post("/users", authenticateSuperAdmin, async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.admin.create({
      data: { name, email, password: hashedPassword, role: role || "ADMIN" },
      select: { id: true, name: true, email: true, role: true },
    });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Failed to create user" });
  }
});

router.delete("/users/:id", authenticateSuperAdmin, async (req, res) => {
  try {
    const adminReq = req as AuthRequest;
    const userId = parseInt(req.params.id as string);
    if (adminReq.adminId === userId) {
      return res.status(400).json({ error: "Cannot delete yourself." });
    }
    await prisma.admin.delete({ where: { id: userId } });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete user" });
  }
});

router.get("/audit-logs", authenticateSuperAdmin, async (req, res) => {
  try {
    const logs = await prisma.auditLog.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch audit logs" });
  }
});

export default router;
