"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma = new client_1.PrismaClient();
async function main() {
    const hashedPassword = await bcrypt_1.default.hash('admin123', 10);
    await prisma.admin.update({
        where: { email: 'admin@roaaccugh.com' },
        data: { password: hashedPassword }
    });
    console.log("Password reset successfully for admin@roaaccugh.com");
}
main().catch(console.error).finally(() => prisma.$disconnect());
//# sourceMappingURL=reset-pass.js.map