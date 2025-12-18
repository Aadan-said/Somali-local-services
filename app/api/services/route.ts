import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        // Get unique categories using groupBy
        const groupedCategories = await prisma.provider.groupBy({
            by: ['category'],
        });

        // Extract category names
        const categories = groupedCategories.map((c: any) => c.category);

        const topProviders = await prisma.provider.findMany({
            take: 6,
            include: {
                user: { select: { name: true } },
                reviews: true
            }
        });

        return NextResponse.json({
            categories,
            featuredProviders: topProviders
        });
    } catch (error) {
        console.error("Error in services API:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
