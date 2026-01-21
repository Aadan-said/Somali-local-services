// 
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { v4 as uuidv4 } from "uuid";
import { logger } from "@/lib/logger";

export async function POST(req: Request) {
    try {
        const { phone } = await req.json();

        if (!phone) {
            return NextResponse.json({ error: "Phone number is required" }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { phone },
        });

        if (!user) {
            // For security, don't reveal if user exists or not
            return NextResponse.json({ message: "If an account exists with this phone, a reset link has been sent." });
        }

        // Generate token
        const token = uuidv4();
        const expires = new Date(Date.now() + 3600000); // 1 hour from now

        // Check if token already exists for this phone, if so delete it (or upsert, but delete/create is safer)
        await prisma.passwordResetToken.deleteMany({
            where: { phone }
        });

        // Save new token to DB
        await prisma.passwordResetToken.create({
            data: {
                phone,
                token,
                expires,
            },
        });

        // Generate reset link
        const resetLink = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`;

        // MOCK SMS SENDING
        // In a real app, you would use an SMS gateway like Twilio here
        logger.info(`Password reset requested for ${phone}. Link: ${resetLink}`);
        console.log(`[SMS MOCK] To: ${phone}, Message: "Guji halkaan si aad password-kaaga u bedelato: ${resetLink}"`);

        return NextResponse.json({ message: "If an account exists with this phone, a reset link has been sent." });
    } catch (error) {
        logger.error("Forgot password API error", error);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}
