import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { SignJWT } from "jose";

const JWT_SECRET = new TextEncoder().encode(
    process.env.NEXTAUTH_SECRET || "fallback-secret-for-dev"
);

const registerSchema = z.object({
    name: z.string().min(2),
    email: z.string().email().optional().or(z.literal('')),
    phone: z.string().min(6),
    password: z.string().min(6),
    role: z.enum(["USER", "CLIENT", "PROVIDER"]).default("USER"),
});

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const parsed = registerSchema.parse(body);
        const { name, email, password, role, phone } = parsed;

        const existingUser = await prisma.user.findUnique({
            where: { phone },
        });

        if (existingUser) {
            return NextResponse.json(
                { error: "Phone number already registered" },
                { status: 400 }
            );
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                name,
                email: email || null,
                phone,
                password: hashedPassword,
                role: role as any,
                // If it's a provider, we can auto-create the profile with defaults
                ...(role === "PROVIDER" && {
                    provider: {
                        create: {
                            category: "General", // Default category
                            city: "Mogadishu",
                            verified: false,
                        }
                    }
                }),
                // Also create a wallet for everyone
                wallet: {
                    create: {
                        balance: 0,
                    }
                }
            },
            include: {
                provider: true,
                wallet: true,
            }
        });

        // Generate JWT token
        const token = await new SignJWT({
            id: user.id,
            email: user.email,
            role: user.role,
        })
            .setProtectedHeader({ alg: "HS256" })
            .setIssuedAt()
            .setExpirationTime("30d")
            .sign(JWT_SECRET);

        return NextResponse.json({
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
            },
            token,
        });
    } catch (error) {
        console.error("REGISTER_ERROR:", error);

        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: (error as any).errors }, { status: 400 });
        }
        const errorMessage = error instanceof Error ? error.message : "Internal Server Error";
        return NextResponse.json(
            { error: errorMessage },
            { status: 500 }
        );
    }
}
