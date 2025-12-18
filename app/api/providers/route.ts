import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const category = searchParams.get("category");
        const city = searchParams.get("city");

        const where: any = {};
        if (category) where.category = category;
        if (city) where.city = city;

        const providers = await prisma.provider.findMany({
            where,
            include: {
                user: {
                    select: {
                        name: true,
                        email: true,
                    },
                },
                reviews: true,
            },
        });

        return NextResponse.json(providers);
    } catch (error) {
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== "PROVIDER") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { category, city, bio } = body;

        const provider = await prisma.provider.upsert({
            where: { userId: session.user.id },
            update: { category, city, bio },
            create: {
                userId: session.user.id,
                category,
                city,
                bio,
            },
        });

        return NextResponse.json(provider);
    } catch (error) {
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
