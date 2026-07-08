"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const multer_1 = __importDefault(require("multer"));
const client_1 = require("@prisma/client");
dotenv_1.default.config();
const app = (0, express_1.default)();
const prisma = new client_1.PrismaClient();
const PORT = process.env.PORT || 3000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Setup simple local upload storage
const upload = (0, multer_1.default)({ dest: 'uploads/' });
// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'ROAACCU API is running' });
});
// Member Application Route
app.post('/api/join', upload.fields([
    { name: 'ghanaCardFront', maxCount: 1 },
    { name: 'ghanaCardBack', maxCount: 1 }
]), async (req, res) => {
    try {
        const files = req.files;
        const frontUrl = files?.['ghanaCardFront']?.[0]?.path;
        const backUrl = files?.['ghanaCardBack']?.[0]?.path;
        const application = await prisma.memberApplication.create({
            data: {
                ...req.body,
                ghanaCardFrontUrl: frontUrl || null,
                ghanaCardBackUrl: backUrl || null,
            }
        });
        res.json({ success: true, application });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Failed to submit application' });
    }
});
// Loan Application Route
app.post('/api/loan', upload.fields([
    { name: 'ghanaCardFront', maxCount: 1 },
    { name: 'ghanaCardBack', maxCount: 1 }
]), async (req, res) => {
    try {
        const files = req.files;
        const frontUrl = files?.['ghanaCardFront']?.[0]?.path;
        const backUrl = files?.['ghanaCardBack']?.[0]?.path;
        const { amount, durationMonths, monthlyPayment, ...rest } = req.body;
        const application = await prisma.loanApplication.create({
            data: {
                ...rest,
                amount: parseFloat(amount),
                durationMonths: durationMonths ? parseInt(durationMonths) : null,
                monthlyPayment: monthlyPayment ? parseFloat(monthlyPayment) : null,
                ghanaCardFrontUrl: frontUrl || null,
                ghanaCardBackUrl: backUrl || null,
            }
        });
        res.json({ success: true, application });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Failed to submit loan application' });
    }
});
// Welfare Application Route
app.post('/api/welfare', async (req, res) => {
    try {
        const application = await prisma.welfareApplication.create({
            data: req.body
        });
        res.json({ success: true, application });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Failed to join welfare' });
    }
});
// Contact Route
app.post('/api/contact', async (req, res) => {
    try {
        const message = await prisma.contactMessage.create({
            data: req.body
        });
        res.json({ success: true, message });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Failed to send message' });
    }
});
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
//# sourceMappingURL=index.js.map