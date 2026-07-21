"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cross_fetch_1 = __importDefault(require("cross-fetch"));
async function main() {
    try {
        console.log("Testing server connectivity...");
        const health = await (0, cross_fetch_1.default)("http://localhost:3000/api/health");
        console.log("Health:", await health.text());
        console.log("Testing login...");
        const res = await (0, cross_fetch_1.default)("http://localhost:3000/api/admin/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: "admin@creditunion.com", password: "admin123" })
        });
        console.log("Login status:", res.status);
        console.log("Login response:", await res.json());
    }
    catch (err) {
        console.error("Error:", err);
    }
}
main();
//# sourceMappingURL=test-login.js.map