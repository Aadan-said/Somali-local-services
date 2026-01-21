import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth-utils";
import { z } from "zod";

const requestSchema = z.object({
    description: z.string().min(10),
    category: z.string().optional(),
    location: z.string().optional(),
    price: z.union([z.number(), z.string()]).optional(),
    providerId: z.string().optional(),
});

export async function POST(req: Request) {
    try {
        const user = await getAuthUser(req);
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { description, category, location, price, providerId } = requestSchema.parse(body);

        const request = await prisma.serviceRequest.create({
            data: {
                userId: user.id,
                description,
                category,
                location,
                price: price ? parseFloat(price.toString()) : null,
                providerId,
                status: "PENDING",
            },
        });

        return NextResponse.json(request);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: (error as any).errors }, { status: 400 });
        }
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}

export async function GET(req: Request) {
    try {
        const user = await getAuthUser(req);
        console.log("GET /api/requests - User:", user?.id, user?.role);

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Always return requests created by the user (Client View)
        // If a provider wants to see their assigned jobs, they use /api/provider/jobs
        const where: any = {
            userId: user.id
        };

        console.log("GET /api/requests - Query Where:", JSON.stringify(where));

        const requests = await (prisma as any).serviceRequest.findMany({
            where,
            include: {
                user: { select: { name: true, email: true } },
                provider: {
                    include: {
                        user: { select: { name: true, image: true, createdAt: true, phone: true } },
                        _count: {
                            select: {
                                requests: {
                                    where: { status: "COMPLETED" }
                                }
                            }
                        }
                    }
                },
                review: true, // Include review to check if already rated
                proposals: {
                    include: {
                        provider: {
                            include: {
                                user: { select: { name: true, image: true } }
                            }
                        }
                    },
                    orderBy: { createdAt: 'desc' }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        console.log("GET /api/requests - Found count:", requests.length);

        return NextResponse.json(requests);

    } catch (error) {
        console.error("GET Requests Error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
