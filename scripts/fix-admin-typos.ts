import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    const emailsToFix = [
        "kabtanaadanyare17@gmail.com",
        "kabtanaadanyare17@gmai.com",
        "kabtanaadanye17@gmail.com"
    ];

    for (const email of emailsToFix) {
        console.log(`Processing: ${email}...`);
        const user = await prisma.user.findUnique({ where: { email } });

        if (user) {
            console.log(`Found user: ${user.id} with role ${user.role}. Setting to ADMIN...`);
            await prisma.user.update({
                where: { email },
                data: { role: "ADMIN" }
            });
            console.log(`Success for ${email}`);
        } else {
            console.log(`User ${email} not found in database.`);
        }
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
