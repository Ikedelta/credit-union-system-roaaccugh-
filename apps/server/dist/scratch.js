"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    const admins = await prisma.admin.findMany();
    console.log(admins);
}
main().catch(console.error).finally(() => prisma.$disconnect());
//# sourceMappingURL=scratch.js.map