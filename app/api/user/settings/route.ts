import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: {
                theme: true,
                language: true,
                emailNotifications: true,
                smsNotifications: true,
                requestUpdates: true,
                marketingEmails: true,
            },
        });

        return NextResponse.json(user);
    } catch (error) {
        console.error("Settings fetch error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const data = await req.json();

        const updatedUser = await prisma.user.update({
            where: { id: session.user.id },
            data: {
                theme: data.theme,
                language: data.language,
                emailNotifications: data.emailNotifications,
                smsNotifications: data.smsNotifications,
                requestUpdates: data.requestUpdates,
                marketingEmails: data.marketingEmails,
            },
        });

        return NextResponse.json({
            success: true,
            message: "Settings updated successfully",
        });
    } catch (error) {
        console.error("Settings update error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
