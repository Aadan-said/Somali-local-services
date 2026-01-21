import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
    try {
        const user = await getAuthUser(req);

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const provider = await prisma.provider.findUnique({
            where: { userId: user.id },
            include: {
                user: {
                    select: {
                        image: true,
                    }
                }
            }
        });

        if (!provider) {
            return NextResponse.json({ error: "Provider not found" }, { status: 404 });
        }

        return NextResponse.json(provider);
    } catch (error) {
        console.error("Provider fetch error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
export async function PATCH(req: Request) {
    try {
        const user = await getAuthUser(req);
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { name, bio, city, category, image } = body;

        // Update User table if name or image provided
        if (name || image) {
            await prisma.user.update({
                where: { id: user.id },
                data: {
                    ...(name && { name }),
                    ...(image && { image }),
                }
            });
        }

        // Update Provider table
        const updatedProvider = await prisma.provider.update({
            where: { userId: user.id },
            data: {
                ...(bio !== undefined && { bio }),
                ...(city && { city }),
                ...(category && { category }),
            },
            include: { user: true }
        });

        return NextResponse.json(updatedProvider);
    } catch (error) {
        console.error("Provider update error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
