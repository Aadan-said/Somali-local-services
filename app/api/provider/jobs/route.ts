import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth-utils";
import { withRetry } from "@/lib/prisma-utils";

export async function GET(req: Request) {
    try {
        const user = await getAuthUser(req);
        if (!user || user.role !== "PROVIDER") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const statusParam = searchParams.get('status');

        const statusFilter = statusParam
            ? statusParam.split(',')
            : ["WAITING_APPROVAL", "ACCEPTED", "IN_PROGRESS", "COMPLETED"];

        const jobs = await withRetry(async () => {
            const provider = await prisma.provider.findUnique({
                where: { userId: user.id }
            });

            if (!provider) return [];

            const requests = await prisma.serviceRequest.findMany({
                where: {
                    providerId: provider.id,
                    status: { in: statusFilter }
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

            return requests.map(req => ({
                id: req.id,
                category: req.category || "General Service",
                status: req.status,
                price: req.price || 0,
                createdAt: req.createdAt,
                location: "Mogadishu, Somalia",
                description: req.description,
                user: {
                    name: req.user.name,
                    email: req.user.email,
                    phone: req.user.phone
                }
            }));
        });

        return NextResponse.json(jobs);

    } catch (error) {
        console.error("PROVIDER_JOBS_API_ERROR:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
