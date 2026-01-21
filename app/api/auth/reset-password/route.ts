import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { logger } from "@/lib/logger";

export async function POST(req: Request) {
    try {
        const { token, password } = await req.json();

        if (!token || !password) {
            return NextResponse.json({ error: "Token and password are required" }, { status: 400 });
        }

        // Find valid token
        const resetToken = await prisma.passwordResetToken.findUnique({
            where: { token },
        });

        if (!resetToken || resetToken.expires < new Date()) {
            return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 });
        }

        // Update user password
        const hashedPassword = await bcrypt.hash(password, 10);

        await prisma.user.update({
            where: { email: resetToken.email },
            data: { password: hashedPassword },
        });

        // Delete token after use
        await prisma.passwordResetToken.delete({
            where: { token },
        });

        logger.info(`Password reset successful for ${resetToken.email}`);

        return NextResponse.json({ message: "Password has been reset successfully" });
    } catch (error) {
        logger.error("Reset password API error", error);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}
