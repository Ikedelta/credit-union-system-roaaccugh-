import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { authenticateAdmin, authenticateSuperAdmin, AuthRequest } from "../middleware/auth";

const router = Router();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "your-super-secret-jwt-key-change-in-production";

// --- HELPER: AUDIT LOGGING ---
const createAuditLog = async (adminId: number | undefined, action: string, details?: string) => {
  if (!adminId) return;
  try {
    const admin = await prisma.admin.findUnique({ where: { id: adminId } });
    if (admin) {
      await prisma.auditLog.create({ data: { adminId: admin.id, adminName: admin.name, action, details } });
    }
  } catch (err) {
    console.error("Failed to create audit log", err);
  }
};

// --- HELPER: Normalize Ghana phone number to 233XXXXXXXXX ---
function normalizeGhanaNumber(raw: string): string {
  const num = raw.trim().replace(/[\s\-()]/g, "");
  if (num.startsWith("+233")) return num.slice(1);
  if (num.startsWith("233") && num.length >= 12) return num;
  if (num.startsWith("0") && num.length === 10) return "233" + num.slice(1);
  if (num.length === 9) return "233" + num;
  return num;
}

// ============================================================
// AUTHENTICATION (public routes - no middleware)
// ============================================================

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await prisma.admin.findUnique({ where: { email } });
    if (!admin) return res.status(401).json({ error: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(401).json({ error: "Invalid email or password" });

    const token = jwt.sign({ adminId: admin.id, role: admin.role }, JWT_SECRET, { expiresIn: "1d" });
    res.cookie("token", token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", maxAge: 86400000 });
    res.json({ success: true, token, admin: { id: admin.id, name: admin.name, email: admin.email, role: admin.role } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Login failed" });
  }
});

router.get("/me", authenticateAdmin, async (req, res) => {
  try {
    const adminReq = req as AuthRequest;
    const admin = await prisma.admin.findUnique({ where: { id: adminReq.adminId }, select: { id: true, name: true, email: true, role: true } });
    if (!admin) return res.status(404).json({ error: "Admin not found" });
    res.json({ admin });
  } catch (err) {
    res.status(500).json({ error: "Failed to verify session" });
  }
});

router.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ success: true });
});

// ============================================================
// PROTECTED ROUTES (all require authentication)
// ============================================================
router.use(authenticateAdmin);

// --- MEMBERSHIPS ---
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
    const application = await prisma.memberApplication.update({ where: { id: parseInt(req.params.id) }, data: { status } });

    if (status === "APPROVED") {
      const existingMember = await prisma.member.findFirst({ where: { email: application.email } });
      if (!existingMember) {
        const memberId = `ROA-${Math.floor(1000 + Math.random() * 9000)}`;
        const randomPassword = Math.random().toString(36).slice(-8);
        const hashedPassword = await bcrypt.hash(randomPassword, 10);
        await prisma.member.create({ data: { memberId, password: hashedPassword, initialPassword: randomPassword, firstName: application.firstName, lastName: application.lastName, email: application.email, telNo: application.telNo, balance: 0.0 } });
        await createAuditLog(adminReq.adminId, `${status}_MEMBERSHIP`, `Membership ID: ${application.id}`);
        return res.json({ ...application, generatedMemberId: memberId, generatedPassword: randomPassword });
      }
    }
    await createAuditLog(adminReq.adminId, `${status}_MEMBERSHIP`, `Membership ID: ${application.id}`);
    res.json(application);
  } catch (err) {
    res.status(500).json({ error: "Failed to update status" });
  }
});

// --- LOANS ---
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
    const application = await prisma.loanApplication.update({ where: { id: parseInt(req.params.id) }, data: { status } });
    await createAuditLog(adminReq.adminId, `${status}_LOAN`, `Loan ID: ${application.id}`);
    res.json(application);
  } catch (err) {
    res.status(500).json({ error: "Failed to update status" });
  }
});

// --- WELFARE ---
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
    const application = await prisma.welfareApplication.update({ where: { id: parseInt(req.params.id) }, data: { status } });
    await createAuditLog(adminReq.adminId, `${status}_WELFARE`, `Welfare ID: ${application.id}`);
    res.json(application);
  } catch (err) {
    res.status(500).json({ error: "Failed to update status" });
  }
});

// --- MESSAGES ---
router.get("/messages", async (req, res) => {
  try {
    const messages = await prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" } });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

// --- CMS ---
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

// --- SMS (Arkesel Integration) ---
router.get("/sms", async (req, res) => {
  try {
    const logs = await prisma.smsLog.findMany({ orderBy: { createdAt: "desc" } });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch SMS logs" });
  }
});

// Diagnostic: verify Arkesel API key + check balance
router.get("/sms/test", async (req, res) => {
  const ARKESEL_API_KEY = process.env.ARKESEL_API_KEY;
  if (!ARKESEL_API_KEY) {
    return res.status(500).json({ error: "ARKESEL_API_KEY not set in .env" });
  }
  try {
    const apiRes = await fetch("https://sms.arkesel.com/api/v2/clients/balance-details", {
      headers: { "api-key": ARKESEL_API_KEY },
    });
    const data = await apiRes.json();
    res.json({ configured: true, arkesel_response: data });
  } catch (err) {
    res.status(500).json({ error: "Failed to reach Arkesel API", details: String(err) });
  }
});

router.post("/sms/send", async (req, res) => {
  try {
    const { recipients, message } = req.body;
    const adminReq = req as AuthRequest;

    const ARKESEL_API_KEY = process.env.ARKESEL_API_KEY;
    // NOTE: SENDER_ID must be registered on Arkesel dashboard.
    // Use "TEST" for testing, or register "ROAACCU" at https://sms.arkesel.com
    const SENDER_ID = process.env.SMS_SENDER_ID || "ROAACCU";

    if (!ARKESEL_API_KEY) {
      return res.status(500).json({ error: "SMS API key not configured on the server." });
    }

    if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
      return res.status(400).json({ error: "No recipients provided." });
    }

    if (!message || message.trim().length === 0) {
      return res.status(400).json({ error: "Message cannot be empty." });
    }

    const results: { recipient: string; formatted: string; status: string; detail: string }[] = [];

    for (const recipient of recipients) {
      const formatted = normalizeGhanaNumber(recipient);
      try {
        const apiRes = await fetch("https://sms.arkesel.com/api/v2/sms/send", {
          method: "POST",
          headers: {
            "api-key": ARKESEL_API_KEY,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sender: SENDER_ID,
            message: message.trim(),
            recipients: [formatted],
          }),
        });

        const rawText = await apiRes.text();
        let data: { status?: string; message?: string; code?: string; data?: any[] } = {};
        try { data = JSON.parse(rawText); } catch { data = { message: rawText }; }

        console.log(`[SMS] ${recipient} → ${formatted}: status=${data.status}, response=${rawText}`);

        const isSuccess = data.status === "success";
        await prisma.smsLog.create({
          data: {
            recipient: formatted,
            message: message.trim(),
            status: isSuccess ? "SENT" : "FAILED",
            senderId: adminReq.adminId,
          },
        });

        results.push({
          recipient,
          formatted,
          status: isSuccess ? "SENT" : "FAILED",
          detail: isSuccess ? `Delivered to ${formatted}` : (data.message || data.code || "Rejected by network"),
        });
      } catch (perErr) {
        console.error(`[SMS] Error sending to ${formatted}:`, perErr);
        await prisma.smsLog.create({ data: { recipient: formatted, message: message.trim(), status: "FAILED", senderId: adminReq.adminId } });
        results.push({ recipient, formatted, status: "FAILED", detail: "Network error: " + String(perErr) });
      }
    }

    const sentCount = results.filter(r => r.status === "SENT").length;
    const failedCount = results.filter(r => r.status === "FAILED").length;

    await createAuditLog(adminReq.adminId, "SENT_SMS", `Sent: ${sentCount}, Failed: ${failedCount} of ${recipients.length}`);

    res.json({
      success: true,
      message: `${sentCount} sent, ${failedCount} failed out of ${recipients.length}.`,
      results,
    });
  } catch (err) {
    console.error("[SMS] Unexpected error:", err);
    res.status(500).json({ error: "Unexpected server error while sending SMS. Check server logs." });
  }
});

// ============================================================
// SUPERADMIN ONLY ROUTES
// ============================================================

router.get("/users", authenticateSuperAdmin, async (req, res) => {
  try {
    const users = await prisma.admin.findMany({ select: { id: true, name: true, email: true, role: true, createdAt: true } });
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
    if (adminReq.adminId === userId) return res.status(400).json({ error: "Cannot delete yourself." });
    await prisma.admin.delete({ where: { id: userId } });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete user" });
  }
});

router.get("/audit-logs", authenticateSuperAdmin, async (req, res) => {
  try {
    const logs = await prisma.auditLog.findMany({ orderBy: { createdAt: "desc" } });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch audit logs" });
  }
});

export default router;
