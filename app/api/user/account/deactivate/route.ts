import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Deactivate account
        // Using executeRaw because the Prisma Client might not be fully updated due to file locking during migration
        await prisma.$executeRaw`UPDATE "User" SET "accountStatus" = 'DEACTIVATED' WHERE "id" = ${session.user.id}`;

        return NextResponse.json({
            success: true,
            message: "Account-kaaga waa la joojiyay",
        });
    } catch (error) {
        console.error("Account deactivation error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
