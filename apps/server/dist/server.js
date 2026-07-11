"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config(); // Must be before any other import that uses process.env
const app_1 = __importDefault(require("./app"));
const PORT = process.env.PORT || 5000;
app_1.default.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
    console.log(`📱 Kairos Afrika SMS: ${process.env.KAIROS_API_KEY && process.env.KAIROS_API_SECRET ? '✅ Configured' : '❌ Missing API Keys'}`);
});
//# sourceMappingURL=server.js.map