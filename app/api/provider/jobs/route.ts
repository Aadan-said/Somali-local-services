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

        const provider = await prisma.provider.findUnique({
            where: { userId: session.user.id }
        });

        if (!provider) {
            return NextResponse.json([]);
        }

        // Fetch requests assigned to this provider that are not pending
        const requests = await prisma.serviceRequest.findMany({
            where: {
                providerId: provider.id,
                status: { in: ["ACCEPTED", "IN_PROGRESS", "COMPLETED"] }
            },
            include: {
                user: {
                    select: {
                        name: true,
                        email: true,
                        phone: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return NextResponse.json(requests);

    } catch (error) {
        console.error("PROVIDER_JOBS_API_ERROR:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
