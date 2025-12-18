import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const provider = await prisma.provider.findUnique({
            where: { userId: session.user.id },
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
