import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";

const registerSchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    phone: z.string().optional(),
    password: z.string().min(6),
    role: z.enum(["USER", "PROVIDER"]).default("USER"),
});

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, email, phone, password, role } = registerSchema.parse(body);

        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json(
                { error: "User already exists" },
                { status: 400 }
            );
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                name,
                email,
                phone,
                password: hashedPassword,
                role,
            },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                role: true,
            },
        });

        return NextResponse.json(user);
    } catch (error) {
        console.error("REGISTER_ERROR:", error);
        try {
            const fs = require('fs');
            // Write to desktop or project root to be sure we can find it
            const path = require('path');
            const logPath = path.join(process.cwd(), 'error_debug.txt');
            fs.writeFileSync(logPath, String(error) + '\n' + (error instanceof Error ? error.stack : ''));
        } catch (e) {
            console.error("Failed to write log", e);
        }

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
