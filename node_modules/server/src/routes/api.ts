import { Router } from "express";
import multer from "multer";
import path from "path";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { authenticateMember, MemberAuthRequest } from "../middleware/auth";

const router = Router();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "your-super-secret-jwt-key-change-in-production";

// Multer config - memory storage for Vercel
const storage = multer.memoryStorage();
const upload = multer({ storage });

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
  upload.fields([{ name: "ghanaCardFront" }, { name: "ghanaCardBack" }]),
  async (req, res) => {
    try {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      // In production (Vercel), these should be uploaded to S3/Cloudinary.
      // For now, since it's memory storage, we'll store a placeholder or base64.
      const frontUrl = files["ghanaCardFront"]?.[0] ? "placeholder_front.jpg" : null;
      const backUrl = files["ghanaCardBack"]?.[0] ? "placeholder_back.jpg" : null;

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
          ghanaCardFrontUrl: frontUrl,
          ghanaCardBackUrl: backUrl,
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
  upload.fields([{ name: "ghanaCardFront" }, { name: "ghanaCardBack" }]),
  async (req, res) => {
    try {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      const frontUrl = files["ghanaCardFront"]?.[0]?.filename || null;
      const backUrl = files["ghanaCardBack"]?.[0]?.filename || null;

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
          ghanaCardFrontUrl: frontUrl,
          ghanaCardBackUrl: backUrl,
        },
      });

      res.json({ success: true });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to submit application" });
    }
  }
);

// Welfare Application
router.post(
  "/welfare",
  upload.fields([
    { name: "ghanaCardFront" },
    { name: "ghanaCardBack" },
    { name: "beneficiaryCardFront" },
    { name: "beneficiaryCardBack" },
  ]),
  async (req, res) => {
    try {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      const frontUrl = files["ghanaCardFront"]?.[0]?.filename || null;
      const backUrl = files["ghanaCardBack"]?.[0]?.filename || null;
      const bFrontUrl = files["beneficiaryCardFront"]?.[0]?.filename || null;
      const bBackUrl = files["beneficiaryCardBack"]?.[0]?.filename || null;

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
          ghanaCardFrontUrl: frontUrl,
          ghanaCardBackUrl: backUrl,
          beneficiaryName: data.beneficiaryName,
          beneficiaryGhanaCard: data.beneficiaryGhanaCard,
          beneficiaryCardFrontUrl: bFrontUrl,
          beneficiaryCardBackUrl: bBackUrl,
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
