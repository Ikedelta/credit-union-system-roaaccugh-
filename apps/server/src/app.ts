import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import cookieParser from "cookie-parser";
import fs from "fs";
import { PrismaClient } from "@prisma/client";
import apiRoutes from "./routes/api";
import adminRoutes from "./routes/admin";

const app = express();
const prisma = new PrismaClient();

// Security
app.use(helmet());

// Allow frontend requests
app.use(cors());

// Parse JSON requests
app.use(express.json({ limit: '10mb' }));

// Parse form data
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Parse cookies
app.use(cookieParser());

// Log incoming requests
app.use(morgan("dev"));

// Serve uploaded files statically
app.use("/uploads", express.static(path.join(__dirname, "../../uploads")));

// Dynamic OG tags for News pages
app.get("/news/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const content = await prisma.websiteContent.findUnique({ where: { key: 'news_list' } });
    let newsItem = null;
    if (content && content.value) {
      const newsItems = JSON.parse(content.value);
      newsItem = newsItems.find((item: any, index: number) => item.id?.toString() === id || index.toString() === id);
    }
    
    // Read the static index.html from public dir
    const indexPath = path.join(process.cwd(), "public", "index.html");
    let html = fs.readFileSync(indexPath, "utf8");
    
    if (newsItem) {
      let imageUrl = newsItem.image || "";
      if (imageUrl && imageUrl.startsWith("/uploads")) {
        // Construct absolute URL for local/uploaded images
        imageUrl = `https://${req.get('host')}${imageUrl}`;
      } else if (imageUrl && !imageUrl.startsWith("http")) {
        imageUrl = `https://${req.get('host')}${imageUrl}`;
      }

      const ogTitle = `<meta property="og:title" content="${newsItem.title?.replace(/"/g, '&quot;') || 'News Update'}" />`;
      const ogDesc = `<meta property="og:description" content="${newsItem.content?.substring(0, 150).replace(/"/g, '&quot;') || ''}..." />`;
      const ogImage = imageUrl ? `<meta property="og:image" content="${imageUrl}" />\n<meta name="twitter:image" content="${imageUrl}" />` : '';
      
      const customTags = `${ogTitle}\n${ogDesc}\n${ogImage}`;
      html = html.replace('</head>', `${customTags}\n</head>`);
    }
    
    res.send(html);
  } catch (err) {
    console.error("Error generating news preview:", err);
    // Fallback to sending the raw index.html or letting Vercel handle it
    const indexPath = path.join(process.cwd(), "public", "index.html");
    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      res.status(404).send("Not Found");
    }
  }
});

// API Routes
app.use("/api", apiRoutes);
app.use("/api/admin", adminRoutes);

// Health Check Route
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Credit Union API is running 🚀",
  });
});

export default app;