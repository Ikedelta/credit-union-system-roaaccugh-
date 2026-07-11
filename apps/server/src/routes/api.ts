import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { authenticateMember, MemberAuthRequest } from "../middleware/auth";

// --- HELPER: Normalize Ghana phone number to 233XXXXXXXXX ---
function normalizeGhanaNumber(raw: string): string {
  const num = raw.trim().replace(/[\s\-()]/g, "");
  if (num.startsWith("+233")) return num.slice(1);
  if (num.startsWith("233") && num.length >= 12) return num;
  if (num.startsWith("0") && num.length === 10) return "233" + num.slice(1);
  if (num.length === 9) return "233" + num;
  return num;
}

const router = Router();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "your-super-secret-jwt-key-change-in-production";

// Multer config - memory storage for Vercel
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { fileSize: 7 * 1024 * 1024 } // 7MB limit
});

// Member Login
router.post("/member/login", async (req, res) => {
  try {
    const { memberId, password } = req.body;
    const member = await prisma.member.findUnique({ where: { memberId } });
    if (!member) {
      return res.status(401).json({ error: "Invalid member ID or password" });
    }
    const isValid = await bcrypt.compare(password, member.password);
    if (!isValid) {
      return res.status(401).json({ error: "Invalid member ID or password" });
    }
    const token = jwt.sign({ id: member.id, role: "MEMBER" }, JWT_SECRET, { expiresIn: "1d" });
    res.json({ success: true, token, member: { id: member.id, memberId: member.memberId, firstName: member.firstName, lastName: member.lastName, balance: member.balance } });
  } catch (err) {
    res.status(500).json({ error: "Login failed" });
  }
});

// Member Dashboard (Protected)
router.get("/member/me", authenticateMember, async (req, res) => {
  try {
    const memberReq = req as MemberAuthRequest;
    const member = await prisma.member.findUnique({
      where: { id: memberReq.memberId },
      select: {
        id: true,
        memberId: true,
        firstName: true,
        lastName: true,
        email: true,
        telNo: true,
        balance: true,
        createdAt: true,
      }
    });

    if (!member) {
      return res.status(404).json({ error: "Member not found" });
    }

    // Fetch related applications based on telNo or email or a direct relation
    // Currently, applications don't have a direct relation to Member ID, 
    // so we match by telNo or accountNumber/memberId
    const loanApplications = await prisma.loanApplication.findMany({
      where: { accountNumber: member.memberId }
    });

    const welfareApplications = await prisma.welfareApplication.findMany({
      where: { accountNumber: member.memberId }
    });

    res.json({
      member,
      loanApplications,
      welfareApplications
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch member data" });
  }
});

// Contact Form
router.post("/contact", async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    await prisma.contactMessage.create({
      data: { name, email, subject, message },
    });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to submit contact message" });
  }
});

router.get("/contact", async (req, res) => {
  try {
    const messages = await prisma.contactMessage.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

// Join Form (Member Application)
router.post(
  "/join",
  upload.none(),
  async (req, res) => {
    try {
      const data = req.body;
      await prisma.memberApplication.create({
        data: {
          firstName: data.firstName,
          lastName: data.lastName,
          dateOfBirth: data.dateOfBirth,
          gender: data.gender,
          maritalStatus: data.maritalStatus,
          residentialAddress: data.residentialAddress,
          postalAddress: data.postalAddress,
          telNo: data.telNo,
          occupation: data.occupation,
          nationality: data.nationality,
          email: data.email,
          beneficiary1Name: data.beneficiary1Name,
          beneficiary1Rel: data.beneficiary1Rel,
          beneficiary1Share: data.beneficiary1Share,
          beneficiary2Name: data.beneficiary2Name,
          beneficiary2Rel: data.beneficiary2Rel,
          beneficiary2Share: data.beneficiary2Share,
          accountHolder: data.accountHolder,
          bankBranch: data.bankBranch,
          accountNumber: data.accountNumber,
          ghanaCardNumber: data.ghanaCardNo,
          ghanaCardFrontUrl: null,
          ghanaCardBackUrl: null,
        },
      });

      res.json({ success: true });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to submit application" });
    }
  }
);

// Loan Application
router.post(
  "/loan",
  upload.none(),
  async (req, res) => {
    try {
      const data = req.body;
      await prisma.loanApplication.create({
        data: {
          accountNumber: data.accountNumber,
          fullName: data.fullName,
          telNo: data.telNo,
          maritalStatus: data.maritalStatus,
          occupation: data.occupation,
          townLocation: data.townLocation,
          gpsAddress: data.gpsAddress,
          directionToHouse: data.directionToHouse,
          amount: parseFloat(data.amount) || 0,
          durationMonths: parseInt(data.durationMonths) || null,
          monthlyPayment: parseFloat(data.monthlyPayment) || null,
          dateNeeded: data.dateNeeded,
          purpose: data.purpose,
          ghanaCardNumber: data.ghanaCardNumber,
          ghanaCardFrontUrl: null,
          ghanaCardBackUrl: null,
        },
      });

      // Send SMS Notification
      if (data.telNo && process.env.ARKESEL_API_KEY) {
        const formatted = normalizeGhanaNumber(data.telNo);
        try {
          await fetch("https://sms.arkesel.com/api/v2/sms/send", {
            method: "POST",
            headers: {
              "api-key": process.env.ARKESEL_API_KEY,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              sender: process.env.SMS_SENDER_ID || "ROAACCU",
              message: `Hello ${data.fullName}, your ROAACCU loan application has been received and is currently under review. We will notify you when the status changes.`,
              recipients: [formatted],
            }),
          });
        } catch (smsErr) {
          console.error("Failed to send loan submission SMS:", smsErr);
        }
      }

      res.json({ success: true });
    } catch (err: any) {
      console.error(err);
      res.status(500).json({ error: "Failed to submit application", details: err?.message || String(err) });
    }
  }
);

// Welfare Application
router.post(
  "/welfare",
  upload.none(),
  async (req, res) => {
    try {
      const data = req.body;
      await prisma.welfareApplication.create({
        data: {
          accountNumber: data.accountNumber,
          name: data.name,
          contact: data.contact,
          maritalStatus: data.maritalStatus,
          occupation: data.occupation,
          townLocation: data.townLocation,
          ghanaCardNumber: data.ghanaCardNumber,
          ghanaCardFrontUrl: null,
          ghanaCardBackUrl: null,
          beneficiaryName: data.beneficiaryName,
          beneficiaryGhanaCard: data.beneficiaryGhanaCard,
          beneficiaryCardFrontUrl: null,
          beneficiaryCardBackUrl: null,
        },
      });

      res.json({ success: true });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to submit application" });
    }
  }
);

router.get("/welfare", async (req, res) => {
  try {
    const applications = await prisma.welfareApplication.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(applications);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch applications" });
  }
});

// CMS Content
router.get("/content", async (req, res) => {
  try {
    const content = await prisma.websiteContent.findMany();
    // Transform array into key-value map for easier consumption by frontend
    const contentMap = content.reduce((acc: any, item) => {
      acc[item.key] = item.value;
      return acc;
    }, {});
    res.json(contentMap);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch website content" });
  }
});

export default router;
