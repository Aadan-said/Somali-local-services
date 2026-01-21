import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth-utils";
import { withRetry } from "@/lib/prisma-utils";

export async function GET(req: Request) {
    try {
        const user = await getAuthUser(req);
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const requests = await withRetry(async () => {
            // Find provider record to get their category
            const provider = await prisma.provider.findUnique({
                where: { userId: user.id }
            });

            // Build the where clause for fetching requests
            const whereClause: any = {
                status: "PENDING"
            };

            return await prisma.serviceRequest.findMany({
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
