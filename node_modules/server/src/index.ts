import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import { PrismaClient } from '@prisma/client';
import path from 'path';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Setup simple local upload storage
const upload = multer({ dest: 'uploads/' });

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
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
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
  } catch (error) {
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
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
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
  } catch (error) {
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
  } catch (error) {
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
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Failed to send message' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
