"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const sms_1 = require("../utils/sms");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const supabase_js_1 = require("@supabase/supabase-js");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "your-super-secret-jwt-key-change-in-production";
// Initialize Supabase Client for Storage
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_KEY || '';
// Only create real client if URL is provided to prevent crash on boot
const supabase = supabaseUrl
    ? (0, supabase_js_1.createClient)(supabaseUrl, supabaseKey)
    : { storage: { from: () => ({ upload: async () => ({ error: { message: "Supabase not configured" } }), getPublicUrl: () => ({ data: { publicUrl: "" } }) }) } };
// Use memory storage for uploads before pushing to Supabase
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({
    storage,
    limits: { fileSize: 7 * 1024 * 1024 } // 7MB limit
});
// Initialize Nodemailer Transport
const transporter = nodemailer_1.default.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
        user: process.env.SMTP_USER || "",
        pass: process.env.SMTP_PASS || "",
    },
});
// --- HELPER: AUDIT LOGGING ---
const createAuditLog = async (adminId, action, details) => {
    if (!adminId)
        return;
    try {
        const admin = await prisma.admin.findUnique({ where: { id: adminId } });
        if (admin) {
            await prisma.auditLog.create({ data: { adminId: admin.id, adminName: admin.name, action, details } });
        }
    }
    catch (err) {
        console.error("Failed to create audit log", err);
    }
};
// --- HELPER: Normalize Ghana phone number to 233XXXXXXXXX ---
function normalizeGhanaNumber(raw) {
    const num = raw.trim().replace(/[\s\-()]/g, "");
    if (num.startsWith("+233"))
        return num.slice(1);
    if (num.startsWith("233") && num.length >= 12)
        return num;
    if (num.startsWith("0") && num.length === 10)
        return "233" + num.slice(1);
    if (num.length === 9)
        return "233" + num;
    return num;
}
// ============================================================
// AUTHENTICATION (public routes - no middleware)
// ============================================================
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const admin = await prisma.admin.findUnique({ where: { email } });
        if (!admin)
            return res.status(401).json({ error: "Invalid email or password" });
        const isMatch = await bcrypt_1.default.compare(password, admin.password);
        if (!isMatch)
            return res.status(401).json({ error: "Invalid email or password" });
        const token = jsonwebtoken_1.default.sign({ adminId: admin.id, role: admin.role }, JWT_SECRET, { expiresIn: "1d" });
        res.cookie("token", token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", maxAge: 86400000 });
        res.json({ success: true, token, admin: { id: admin.id, name: admin.name, email: admin.email, role: admin.role } });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Login failed" });
    }
});
router.get("/me", auth_1.authenticateAdmin, async (req, res) => {
    try {
        const adminReq = req;
        const admin = await prisma.admin.findUnique({ where: { id: adminReq.adminId }, select: { id: true, name: true, email: true, role: true } });
        if (!admin)
            return res.status(404).json({ error: "Admin not found" });
        res.json({ admin });
    }
    catch (err) {
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
router.use(auth_1.authenticateAdmin);
// --- FILE UPLOAD ---
router.post("/upload", upload.single("image"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }
        if (!supabaseUrl || !supabaseKey) {
            return res.status(500).json({ error: "Supabase storage is not configured in .env" });
        }
        const adminReq = req;
        // Generate unique filename
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const filename = 'cms-' + uniqueSuffix + path_1.default.extname(req.file.originalname);
        // Upload to Supabase Storage bucket named 'cms-media'
        const { data, error } = await supabase.storage
            .from('cms-media')
            .upload(filename, req.file.buffer, {
            contentType: req.file.mimetype,
            upsert: false
        });
        if (error) {
            console.error("Supabase Storage Error:", error);
            return res.status(500).json({ error: "Failed to upload to Supabase" });
        }
        // Get public URL
        const { data: publicUrlData } = supabase.storage
            .from('cms-media')
            .getPublicUrl(filename);
        await createAuditLog(adminReq.adminId, "UPLOAD_FILE", `Uploaded to Supabase: ${filename}`);
        // Return the public URL path
        res.json({ success: true, url: publicUrlData.publicUrl });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "File upload failed" });
    }
});
// --- MEDIA MANAGER ---
router.get("/media", async (req, res) => {
    try {
        if (!supabaseUrl || !supabaseKey) {
            return res.status(500).json({ error: "Supabase storage is not configured in .env" });
        }
        const { data, error } = await supabase.storage.from('cms-media').list();
        if (error) {
            console.error("Supabase List Error:", error);
            return res.status(500).json({ error: "Failed to fetch files" });
        }
        const files = data
            .filter((file) => file.name !== '.emptyFolderPlaceholder')
            .map((file) => {
            const { data: publicUrlData } = supabase.storage.from('cms-media').getPublicUrl(file.name);
            return {
                name: file.name,
                url: publicUrlData.publicUrl,
                created_at: file.created_at
            };
        })
            .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        res.json({ files });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to list media files" });
    }
});
router.delete("/media/:filename", async (req, res) => {
    try {
        if (!supabaseUrl || !supabaseKey) {
            return res.status(500).json({ error: "Supabase storage is not configured" });
        }
        const { filename } = req.params;
        const { error } = await supabase.storage.from('cms-media').remove([filename]);
        if (error) {
            console.error("Supabase Delete Error:", error);
            return res.status(500).json({ error: "Failed to delete file" });
        }
        const adminReq = req;
        await createAuditLog(adminReq.adminId, "DELETE_FILE", `Deleted media file: ${filename}`);
        res.json({ success: true });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to delete media file" });
    }
});
// --- DASHBOARD STATS ---
router.get("/dashboard-stats", async (req, res) => {
    try {
        // Run queries sequentially to prevent Vercel serverless connection pool exhaustion
        const membershipsCount = await prisma.memberApplication.count();
        const loansCount = await prisma.loanApplication.count();
        const welfareCount = await prisma.welfareApplication.count();
        const messagesCount = await prisma.contactMessage.count();
        const recentMemberships = await prisma.memberApplication.findMany({ take: 5, orderBy: { createdAt: "desc" } });
        const recentLoans = await prisma.loanApplication.findMany({ take: 5, orderBy: { createdAt: "desc" } });
        const recentMessages = await prisma.contactMessage.findMany({ take: 5, orderBy: { createdAt: "desc" } });
        res.json({
            counts: {
                memberships: membershipsCount,
                loans: loansCount,
                welfare: welfareCount,
                messages: messagesCount
            },
            recent: {
                memberships: recentMemberships,
                loans: recentLoans,
                messages: recentMessages
            }
        });
    }
    catch (err) {
        console.error("Dashboard stats error:", err);
        res.status(500).json({ error: "Failed to fetch dashboard stats" });
    }
});
// --- MEMBERSHIPS ---
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
        const adminReq = req;
        const { status } = req.body;
        const application = await prisma.memberApplication.update({ where: { id: parseInt(req.params.id) }, data: { status } });
        if (status === "APPROVED") {
            const existingMember = await prisma.member.findFirst({ where: { email: application.email } });
            if (!existingMember) {
                const memberId = `ROA-${Math.floor(1000 + Math.random() * 9000)}`;
                const randomPassword = Math.random().toString(36).slice(-8);
                const hashedPassword = await bcrypt_1.default.hash(randomPassword, 10);
                await prisma.member.create({ data: { memberId, password: hashedPassword, initialPassword: randomPassword, firstName: application.firstName, lastName: application.lastName, email: application.email, telNo: application.telNo, balance: 0.0 } });
                await createAuditLog(adminReq.adminId, `${status}_MEMBERSHIP`, `Membership ID: ${application.id}`);
                return res.json({ ...application, generatedMemberId: memberId, generatedPassword: randomPassword });
            }
        }
        await createAuditLog(adminReq.adminId, `${status}_MEMBERSHIP`, `Membership ID: ${application.id}`);
        res.json(application);
    }
    catch (err) {
        res.status(500).json({ error: "Failed to update status" });
    }
});
router.delete("/memberships/:id", async (req, res) => {
    try {
        const adminReq = req;
        const id = parseInt(req.params.id);
        await prisma.memberApplication.delete({ where: { id } });
        await createAuditLog(adminReq.adminId, "DELETE_MEMBERSHIP", `Deleted Membership ID: ${id}`);
        res.json({ success: true });
    }
    catch (err) {
        res.status(500).json({ error: "Failed to delete membership application" });
    }
});
// --- LOANS ---
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
        const adminReq = req;
        const { status } = req.body;
        const application = await prisma.loanApplication.update({ where: { id: parseInt(req.params.id) }, data: { status } });
        await createAuditLog(adminReq.adminId, `${status}_LOAN`, `Loan ID: ${application.id}`);
        // Send SMS Notification
        if (application.telNo && process.env.KAIROS_API_KEY) {
            const formatted = normalizeGhanaNumber(application.telNo);
            try {
                let template = await (0, sms_1.getSmsTemplate)("sms_template_loan_status", "Hello {name}, your ROAACCU loan application status has been updated to: {status}.", prisma);
                const message = template.replace(/{name}/g, application.fullName).replace(/{status}/g, status);
                await (0, sms_1.sendSms)(formatted, message);
            }
            catch (smsErr) {
                console.error("Failed to send loan status update SMS:", smsErr);
            }
        }
        res.json(application);
    }
    catch (err) {
        res.status(500).json({ error: "Failed to update status" });
    }
});
router.delete("/loans/:id", async (req, res) => {
    try {
        const adminReq = req;
        const id = parseInt(req.params.id);
        await prisma.loanApplication.delete({ where: { id } });
        await createAuditLog(adminReq.adminId, "DELETE_LOAN", `Deleted Loan ID: ${id}`);
        res.json({ success: true });
    }
    catch (err) {
        res.status(500).json({ error: "Failed to delete loan application" });
    }
});
// --- WELFARE ---
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
        const adminReq = req;
        const { status } = req.body;
        const application = await prisma.welfareApplication.update({ where: { id: parseInt(req.params.id) }, data: { status } });
        await createAuditLog(adminReq.adminId, `${status}_WELFARE`, `Welfare ID: ${application.id}`);
        res.json(application);
    }
    catch (err) {
        res.status(500).json({ error: "Failed to update status" });
    }
});
router.delete("/welfare/:id", async (req, res) => {
    try {
        const adminReq = req;
        const id = parseInt(req.params.id);
        await prisma.welfareApplication.delete({ where: { id } });
        await createAuditLog(adminReq.adminId, "DELETE_WELFARE", `Deleted Welfare ID: ${id}`);
        res.json({ success: true });
    }
    catch (err) {
        res.status(500).json({ error: "Failed to delete welfare application" });
    }
});
// --- MESSAGES ---
router.get("/messages", async (req, res) => {
    try {
        const messages = await prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" } });
        res.json(messages);
    }
    catch (err) {
        res.status(500).json({ error: "Failed to fetch messages" });
    }
});
router.delete("/messages/:id", async (req, res) => {
    try {
        const adminReq = req;
        const id = parseInt(req.params.id);
        await prisma.contactMessage.delete({ where: { id } });
        await createAuditLog(adminReq.adminId, "DELETE_MESSAGE", `Deleted Message ID: ${id}`);
        res.json({ success: true });
    }
    catch (err) {
        res.status(500).json({ error: "Failed to delete message" });
    }
});
// --- CMS ---
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
        const adminReq = req;
        const { value, type } = req.body;
        const content = await prisma.websiteContent.upsert({
            where: { key: req.params.key },
            update: { value, type },
            create: { key: req.params.key, value, type: type || "TEXT" },
        });
        await createAuditLog(adminReq.adminId, "UPDATED_CMS", `Updated CMS key: ${req.params.key}`);
        res.json(content);
    }
    catch (err) {
        res.status(500).json({ error: "Failed to update content" });
    }
});
// --- SMS (Kairos Afrika Integration) ---
router.get("/sms", async (req, res) => {
    try {
        const logs = await prisma.smsLog.findMany({ orderBy: { createdAt: "desc" } });
        res.json(logs);
    }
    catch (err) {
        res.status(500).json({ error: "Failed to fetch SMS logs" });
    }
});
// Diagnostic: verify Kairos API key + check balance
router.get("/sms/test", async (req, res) => {
    try {
        const data = await (0, sms_1.checkSmsBalance)();
        res.json({ configured: true, kairos_response: data });
    }
    catch (err) {
        res.status(500).json({ error: "Failed to reach Kairos Afrika API", details: String(err) });
    }
});
router.post("/sms/send", async (req, res) => {
    try {
        const { recipients, message } = req.body;
        const adminReq = req;
        if (!process.env.KAIROS_API_KEY) {
            return res.status(500).json({ error: "SMS API keys not configured on the server." });
        }
        if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
            return res.status(400).json({ error: "No recipients provided." });
        }
        if (!message || message.trim().length === 0) {
            return res.status(400).json({ error: "Message cannot be empty." });
        }
        const results = [];
        for (const recipient of recipients) {
            const formatted = normalizeGhanaNumber(recipient);
            try {
                const response = await (0, sms_1.sendSms)(formatted, message.trim());
                console.log(`[SMS] ${recipient} → ${formatted}: success`, response);
                await prisma.smsLog.create({
                    data: {
                        recipient: formatted,
                        message: message.trim(),
                        status: "SENT",
                        senderId: adminReq.adminId,
                    },
                });
                results.push({
                    recipient,
                    formatted,
                    status: "SENT",
                    detail: `Delivered to ${formatted}`,
                });
            }
            catch (perErr) {
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
    }
    catch (err) {
        console.error("[SMS] Unexpected error:", err);
        res.status(500).json({ error: "Unexpected server error while sending SMS. Check server logs." });
    }
});
router.post("/sms/broadcast", async (req, res) => {
    try {
        const { targetGroup, message } = req.body;
        const adminReq = req;
        if (!targetGroup || !message) {
            return res.status(400).json({ error: "Missing targetGroup or message" });
        }
        let recipients = [];
        if (targetGroup === "MEMBERS") {
            const members = await prisma.member.findMany();
            recipients = members.map(m => m.telNo).filter(Boolean);
        }
        else if (targetGroup === "ADMINS") {
            const admins = await prisma.admin.findMany();
            recipients = admins.map(a => a.telNo).filter(Boolean);
        }
        else if (targetGroup === "LOAN_APPLICANTS") {
            const loans = await prisma.loanApplication.findMany();
            recipients = loans.map(l => l.telNo).filter(Boolean);
        }
        else {
            return res.status(400).json({ error: "Invalid target group" });
        }
        if (recipients.length === 0) {
            return res.status(400).json({ error: "No recipients found in the selected group." });
        }
        if (!process.env.KAIROS_API_KEY) {
            return res.status(500).json({ error: "SMS API keys not configured on the server." });
        }
        const results = [];
        for (const recipient of recipients) {
            const formatted = normalizeGhanaNumber(recipient);
            try {
                await (0, sms_1.sendSms)(formatted, message.trim());
                await prisma.smsLog.create({
                    data: { recipient: formatted, message: message.trim(), status: "SENT", senderId: adminReq.adminId },
                });
                results.push({ recipient, formatted, status: "SENT" });
            }
            catch (err) {
                await prisma.smsLog.create({ data: { recipient: formatted, message: message.trim(), status: "FAILED", senderId: adminReq.adminId } });
                results.push({ recipient, formatted, status: "FAILED" });
            }
        }
        const sentCount = results.filter(r => r.status === "SENT").length;
        await createAuditLog(adminReq.adminId, "BROADCAST_SMS", `Group: ${targetGroup}, Sent: ${sentCount}`);
        res.json({ success: true, message: `Broadcast complete: ${sentCount} sent.`, results });
    }
    catch (err) {
        console.error("[SMS Broadcast]", err);
        res.status(500).json({ error: "Server error during broadcast." });
    }
});
// ============================================================
// SUPERADMIN ONLY ROUTES
// ============================================================
router.get("/users", auth_1.authenticateSuperAdmin, async (req, res) => {
    try {
        const users = await prisma.admin.findMany({ select: { id: true, name: true, email: true, role: true, createdAt: true } });
        res.json(users);
    }
    catch (err) {
        res.status(500).json({ error: "Failed to fetch users" });
    }
});
router.post("/users", auth_1.authenticateSuperAdmin, async (req, res) => {
    try {
        const { name, email, password, role, telNo } = req.body;
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        const user = await prisma.admin.create({
            data: { name, email, password: hashedPassword, role: role || "ADMIN", telNo },
            select: { id: true, name: true, email: true, role: true, telNo: true },
        });
        // Send Welcome Email (if configured)
        if (process.env.SMTP_USER) {
            try {
                let emailTemplate = await (0, sms_1.getSmsTemplate)("email_template_admin_welcome", "Hello {name},\n\nYour admin account has been created successfully.\n\nRole: {role}\nEmail: {email}\nPassword: {password}\n\nPlease login and change your password immediately.", prisma);
                const emailMessage = emailTemplate
                    .replace(/{name}/g, name)
                    .replace(/{role}/g, role || "ADMIN")
                    .replace(/{email}/g, email)
                    .replace(/{password}/g, password);
                await transporter.sendMail({
                    from: `"ROAACCU Admin" <${process.env.SMTP_USER}>`,
                    to: email,
                    subject: "Welcome to ROAACCU Admin Dashboard",
                    text: emailMessage,
                });
            }
            catch (emailErr) {
                console.error("Failed to send welcome email to admin:", emailErr);
            }
        }
        // Send Welcome SMS (if telNo is provided and configured)
        if (telNo && process.env.KAIROS_API_KEY) {
            const formatted = normalizeGhanaNumber(telNo);
            try {
                let template = await (0, sms_1.getSmsTemplate)("sms_template_admin_welcome", "Hello {name}, your ROAACCU Admin account has been created. Check your email for login details.", prisma);
                const message = template.replace(/{name}/g, name);
                await (0, sms_1.sendSms)(formatted, message);
            }
            catch (smsErr) {
                console.error("Failed to send welcome SMS to admin:", smsErr);
            }
        }
        res.json(user);
    }
    catch (err) {
        if (err.code === 'P2002') {
            return res.status(400).json({ error: "A user with this email already exists" });
        }
        console.error(err);
        res.status(500).json({ error: "Failed to create user" });
    }
});
router.delete("/users/:id", auth_1.authenticateSuperAdmin, async (req, res) => {
    try {
        const adminReq = req;
        const userId = parseInt(req.params.id);
        if (adminReq.adminId === userId)
            return res.status(400).json({ error: "Cannot delete yourself." });
        await prisma.admin.delete({ where: { id: userId } });
        res.json({ success: true });
    }
    catch (err) {
        res.status(500).json({ error: "Failed to delete user" });
    }
});
router.get("/audit-logs", auth_1.authenticateSuperAdmin, async (req, res) => {
    try {
        const logs = await prisma.auditLog.findMany({ orderBy: { createdAt: "desc" } });
        res.json(logs);
    }
    catch (err) {
        res.status(500).json({ error: "Failed to fetch audit logs" });
    }
});
exports.default = router;
//# sourceMappingURL=admin.js.map