"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const path_1 = __importDefault(require("path"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const client_1 = require("@prisma/client");
const api_1 = __importDefault(require("./routes/api"));
const admin_1 = __importDefault(require("./routes/admin"));
const app = (0, express_1.default)();
const prisma = new client_1.PrismaClient();
// Security
app.use((0, helmet_1.default)());
// Allow frontend requests
app.use((0, cors_1.default)());
// Parse JSON requests
app.use(express_1.default.json({ limit: '10mb' }));
// Parse form data
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
// Parse cookies
app.use((0, cookie_parser_1.default)());
// Log incoming requests
app.use((0, morgan_1.default)("dev"));
// Serve uploaded files statically
app.use("/uploads", express_1.default.static(path_1.default.join(__dirname, "../../uploads")));
// Dynamic OG tags for News pages
app.get("/news/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const content = await prisma.websiteContent.findUnique({ where: { key: 'news_list' } });
        let newsItems = [];
        if (content && content.value) {
            try {
                newsItems = JSON.parse(content.value);
            }
            catch (e) { }
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
        const generateSlug = (text) => text ? text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') : '';
        const decodedId = id ? decodeURIComponent(id) : '';
        newsItem = newsItems.find((item, index) => item.id?.toString() === id || index.toString() === id || generateSlug(item.title) === id || generateSlug(item.title) === generateSlug(decodedId));
        // Fetch the live frontend index.html
        const frontendUrl = process.env.FRONTEND_URL || "https://www.roaaccugh.com";
        let html = "";
        try {
            const response = await fetch(frontendUrl);
            if (response.ok) {
                html = await response.text();
            }
            else {
                throw new Error("Failed to fetch frontend");
            }
        }
        catch (e) {
            console.error("Failed to fetch frontend html:", e);
            // Fallback minimal HTML if fetch fails
            html = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8" /><title>ROAACCU - Credit Union</title></head><body><div id="root"></div></body></html>`;
        }
        if (newsItem) {
            let imageUrl = newsItem.image || "";
            if (imageUrl && imageUrl.startsWith("/uploads")) {
                imageUrl = `https://${req.get('host')}${imageUrl}`;
            }
            else if (imageUrl && !imageUrl.startsWith("http")) {
                imageUrl = `https://${req.get('host')}${imageUrl}`;
            }
            const ogTitle = `<meta property="og:title" content="${newsItem.title?.replace(/"/g, '&quot;') || 'News Update'}" />`;
            const ogDesc = `<meta property="og:description" content="${newsItem.content?.substring(0, 150).replace(/"/g, '&quot;') || ''}..." />`;
            const ogImage = imageUrl ? `<meta property="og:image" content="${imageUrl}" />\n<meta name="twitter:card" content="summary_large_image" />\n<meta name="twitter:image" content="${imageUrl}" />` : '';
            const customTags = `${ogTitle}\n${ogDesc}\n${ogImage}`;
            html = html.replace('</head>', `${customTags}\n</head>`);
        }
        res.send(html);
    }
    catch (err) {
        console.error("Error generating news preview:", err);
        res.status(500).send("Internal Server Error");
    }
});
// API Routes
app.use("/api", api_1.default);
app.use("/api/admin", admin_1.default);
// Health Check Route
app.get("/api/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Credit Union API is running 🚀",
    });
});
exports.default = app;
//# sourceMappingURL=app.js.map