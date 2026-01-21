import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    const email = "kabtanaadanye17@gmail.com";

    console.log(`Checking user: ${email}...`);

    const user = await prisma.user.findUnique({
        where: { email },
    });

    if (!user) {
        console.log("User not found!");
        return;
    }

    console.log(`Current user status: ID=${user.id}, Role=${user.role}`);

    if (user.role !== "ADMIN") {
        console.log("Updating role to ADMIN...");
        await prisma.user.update({
            where: { email },
            data: { role: "ADMIN" },
        });
        console.log("User updated successfully!");
    } else {
        console.log("User already has ADMIN role.");
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
