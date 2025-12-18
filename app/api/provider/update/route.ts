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

        const { name, category, city, bio } = await req.json();

        // Update User name
        await prisma.user.update({
            where: { id: session.user.id },
            data: { name },
        });

        // Update Provider specific data using upsert
        const updatedProvider = await prisma.provider.upsert({
            where: { userId: session.user.id },
            update: { category, city, bio },
            create: {
                userId: session.user.id,
                category,
                city,
                bio
            },
        });

        return NextResponse.json(updatedProvider);
    } catch (error) {
        console.error("Provider update error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
