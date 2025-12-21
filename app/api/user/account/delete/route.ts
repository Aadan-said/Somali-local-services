import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function DELETE(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { password } = await req.json();

        if (!password) {
            return NextResponse.json(
                { error: "Fadlan geli password-kaaga si aad u xaqiijiso" },
                { status: 400 }
            );
        }

        // Get current user
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return NextResponse.json(
                { error: "Password-ku waa khalad" },
                { status: 400 }
            );
        }

        // Mark account as deleted (soft delete)
        // Using executeRaw because the Prisma Client might not be fully updated due to file locking during migration
        await prisma.$executeRaw`UPDATE "User" SET "accountStatus" = 'DELETED' WHERE "id" = ${session.user.id}`;

        return NextResponse.json({
            success: true,
            message: "Account-kaaga waa la tirtiray",
        });
    } catch (error) {
        console.error("Account deletion error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
