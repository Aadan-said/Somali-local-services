import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { z } from "zod";

const requestSchema = z.object({
    description: z.string().min(10),
    providerId: z.string().optional(),
});

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { description, providerId } = requestSchema.parse(body);

        const request = await prisma.serviceRequest.create({
            data: {
                userId: session.user.id,
                description,
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
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // If provider, get requests assigned to them
        // If user, get their requests
        const where: any = {};
        if (session.user.role === "PROVIDER") {
            // Find provider record first
            const provider = await prisma.provider.findUnique({
                where: { userId: session.user.id }
            });
            if (provider) {
                where.providerId = provider.id;
            } else {
                return NextResponse.json([]);
            }
        } else {
            where.userId = session.user.id;
        }

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

        return NextResponse.json(requests);

    } catch (error) {
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
