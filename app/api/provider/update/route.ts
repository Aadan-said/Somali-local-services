import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth-utils";

export async function POST(req: Request) {
    try {
        const user = await getAuthUser(req);

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { name, category, city, bio } = await req.json();

        // Update User name
        await prisma.user.update({
            where: { id: user.id },
            data: { name },
        });

        // Update Provider specific data using upsert
        const updatedProvider = await prisma.provider.upsert({
            where: { userId: user.id },
            update: { category, city, bio },
            create: {
                userId: user.id,
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
