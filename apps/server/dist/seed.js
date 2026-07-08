"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma = new client_1.PrismaClient();
async function main() {
    const existingAdmin = await prisma.admin.findUnique({
        where: { email: "admin@creditunion.com" },
    });
    if (!existingAdmin) {
        const hashedPassword = await bcrypt_1.default.hash("admin123", 10);
        await prisma.admin.create({
            data: {
                name: "Super Admin",
                email: "admin@creditunion.com",
                password: hashedPassword,
                role: "SUPERADMIN"
            },
        });
        console.log("Admin seeded: admin@creditunion.com / admin123");
    }
    else {
        await prisma.admin.update({
            where: { email: "admin@creditunion.com" },
            data: { role: "SUPERADMIN" }
        });
        console.log("Admin already exists. Updated role to SUPERADMIN.");
    }
    // Seed default CMS content
    const defaultContent = [
        { key: "home_hero_title", value: "Welcome to Our Credit Union" },
        { key: "home_hero_subtitle", value: "Secure your financial future with us." },
        { key: "about_text", value: "We are dedicated to providing excellent financial services to our members." },
    ];
    for (const item of defaultContent) {
        await prisma.websiteContent.upsert({
            where: { key: item.key },
            update: {},
            create: item,
        });
    }
    console.log("CMS content seeded.");
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map