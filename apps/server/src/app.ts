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
        let newsItems = [];
    if (content && content.value) {
      try {
        newsItems = JSON.parse(content.value);
      } catch (e) {}
    }
    
    if (!newsItems || newsItems.length === 0) {
      newsItems = [
        {
          title: "Annual General Meeting 2026",
          date: "August 15, 2026",
          image: "https://roaaccugh.com/assets/img/slider2.webp",
          content: "Join us for our upcoming AGM where we will discuss the financial performance of the past year and outline our strategic goals for the future. All registered members are encouraged to attend."
        },
        {
          title: "New Mobile Banking Features",
          date: "July 2, 2026",
          image: "https://roaaccugh.com/assets/img/slider1.webp",
          content: "We are excited to announce new features to our mobile banking app, including instant loan approvals and improved security measures."
        },
        {
          title: "Community Outreach Program",
          date: "June 10, 2026",
          image: "https://roaaccugh.com/assets/img/slider3.webp",
          content: "ROAACCU recently partnered with local farmers to provide financial literacy training and subsidized farming equipment to help boost local agriculture."
        }
      ];
    }
    
    let newsItem = null;
    const generateSlug = (text: string) => text ? text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') : '';
    const decodedId = id ? decodeURIComponent(id) : '';
    newsItem = newsItems.find((item: any, index: number) => item.id?.toString() === id || index.toString() === id || generateSlug(item.title) === id || generateSlug(item.title) === generateSlug(decodedId));

    
    // Fetch the live frontend index.html
    const frontendUrl = process.env.FRONTEND_URL || "https://www.roaaccugh.com";
    let html = "";
    try {
      const response = await fetch(frontendUrl);
      if (response.ok) {
        html = await response.text();
      } else {
        throw new Error("Failed to fetch frontend");
      }
    } catch (e) {
      console.error("Failed to fetch frontend html:", e);
      // Fallback minimal HTML if fetch fails
      html = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8" /><title>ROAACCU - Credit Union</title></head><body><div id="root"></div></body></html>`;
    }
    
    if (newsItem) {
      let imageUrl = newsItem.image || "";
      if (imageUrl && imageUrl.startsWith("/uploads")) {
        imageUrl = `https://${req.get('host')}${imageUrl}`;
      } else if (imageUrl && !imageUrl.startsWith("http")) {
        imageUrl = `https://${req.get('host')}${imageUrl}`;
      }

      const ogTitle = `<meta property="og:title" content="${newsItem.title?.replace(/"/g, '&quot;') || 'News Update'}" />`;
      const ogDesc = `<meta property="og:description" content="${newsItem.content?.substring(0, 150).replace(/"/g, '&quot;') || ''}..." />`;
      const ogImage = imageUrl ? `<meta property="og:image" content="${imageUrl}" />\n<meta name="twitter:card" content="summary_large_image" />\n<meta name="twitter:image" content="${imageUrl}" />` : '';
      
      const customTags = `${ogTitle}\n${ogDesc}\n${ogImage}`;
      html = html.replace('</head>', `${customTags}\n</head>`);
    }
    
    res.send(html);
  } catch (err) {
    console.error("Error generating news preview:", err);
    res.status(500).send("Internal Server Error");
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