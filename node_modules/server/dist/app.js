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
const api_1 = __importDefault(require("./routes/api"));
const app = (0, express_1.default)();
// Security
app.use((0, helmet_1.default)());
// Allow frontend requests
app.use((0, cors_1.default)());
// Parse JSON requests
app.use(express_1.default.json());
// Parse form data
app.use(express_1.default.urlencoded({ extended: true }));
// Log incoming requests
app.use((0, morgan_1.default)("dev"));
// Serve uploaded files statically
app.use("/uploads", express_1.default.static(path_1.default.join(__dirname, "../../uploads")));
// API Routes
app.use("/api", api_1.default);
// Health Check Route
app.get("/api/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Credit Union API is running 🚀",
    });
});
exports.default = app;
//# sourceMappingURL=app.js.map