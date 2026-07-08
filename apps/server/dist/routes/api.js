"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
// Multer config - memory storage for Vercel
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage });
// Contact Form
router.post("/contact", async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;
        await prisma.contactMessage.create({
            data: { name, email, subject, message },
        });
        res.json({ success: true });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to submit contact message" });
    }
});
router.get("/contact", async (req, res) => {
    try {
        const messages = await prisma.contactMessage.findMany({ orderBy: { createdAt: 'desc' } });
        res.json(messages);
    }
    catch (err) {
        res.status(500).json({ error: "Failed to fetch messages" });
    }
});
// Join Form (Member Application)
router.post("/join", upload.fields([{ name: "ghanaCardFront" }, { name: "ghanaCardBack" }]), async (req, res) => {
    try {
        const files = req.files;
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
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to submit application" });
    }
});
// Loan Application
router.post("/loan", upload.fields([{ name: "ghanaCardFront" }, { name: "ghanaCardBack" }]), async (req, res) => {
    try {
        const files = req.files;
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
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to submit application" });
    }
});
// Welfare Application
router.post("/welfare", upload.fields([
    { name: "ghanaCardFront" },
    { name: "ghanaCardBack" },
    { name: "beneficiaryCardFront" },
    { name: "beneficiaryCardBack" },
]), async (req, res) => {
    try {
        const files = req.files;
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
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to submit application" });
    }
});
router.get("/welfare", async (req, res) => {
    try {
        const applications = await prisma.welfareApplication.findMany({ orderBy: { createdAt: 'desc' } });
        res.json(applications);
    }
    catch (err) {
        res.status(500).json({ error: "Failed to fetch applications" });
    }
});
exports.default = router;
//# sourceMappingURL=api.js.map