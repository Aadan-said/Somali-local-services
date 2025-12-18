import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Find provider record to get their category
        const provider = await prisma.provider.findUnique({
            where: { userId: session.user.id }
        });

        // Build the where clause for fetching requests
        const whereClause: any = {
            status: "PENDING"
        };

        // If provider profile exists and has a category, we can prioritize it,
        // but for now, let's show all pending requests to make the market feel alive
        // as per user request to "connect" everyone.
        if (provider) {
            if (provider.category) {
                // If they have a category, we could filter, but let's allow seeing everything
                // OR prioritized their category. For now, let's keep it simple: Show all.
            }
        }

        const requests = await prisma.serviceRequest.findMany({
            where: whereClause,
            include: {
                user: {
                    select: {
                        name: true,
                        phone: true,
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return NextResponse.json(requests);

    } catch (error) {
        console.error("MARKET_API_ERROR:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
