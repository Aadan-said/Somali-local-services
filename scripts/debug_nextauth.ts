
import { PrismaClient } from "@prisma/client";

async function main() {
    console.log("Checking Environment Variables:");
    console.log("NEXTAUTH_URL:", process.env.NEXTAUTH_URL ? "DEFINED" : "UNDEFINED");
    console.log("NEXTAUTH_SECRET:", process.env.NEXTAUTH_SECRET ? "DEFINED" : "UNDEFINED");
    console.log("DATABASE_URL:", process.env.DATABASE_URL ? "DEFINED" : "UNDEFINED");

    // Also check if they look basically valid
    if (process.env.NEXTAUTH_URL) console.log("NEXTAUTH_URL Value:", process.env.NEXTAUTH_URL);

    console.log("\nChecking Database Connection...");
    const prisma = new PrismaClient();
    try {
        const userCount = await prisma.user.count();
        console.log("Successfully connected to DB. User count:", userCount);
    } catch (error) {
        console.error("Failed to connect to DB:", error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
