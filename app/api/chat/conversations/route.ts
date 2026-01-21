import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export const dynamic = 'force-dynamic';

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        // Find conversations where the user is either the client or the provider
        const conversations = await prisma.conversation.findMany({
            where: {
                OR: [
                    { request: { userId: session.user.id } },
                    { provider: { userId: session.user.id } }
                ]
            },
            include: {
                request: { include: { user: { select: { name: true, image: true } } } },
                provider: { include: { user: { select: { name: true, image: true } } } },
                messages: {
                    orderBy: { createdAt: "desc" },
                    take: 1
                }
            },
            orderBy: { updatedAt: "desc" }
        });

        return NextResponse.json(conversations);
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { requestId } = await req.json();

        const request = await prisma.serviceRequest.findUnique({
            where: { id: requestId },
            include: { provider: true }
        });

        if (!request || !request.providerId) {
            return NextResponse.json({ error: "Request not found or not assigned" }, { status: 404 });
        }

        // Check if conversation already exists
        let conversation = await prisma.conversation.findUnique({
            where: { requestId }
        });

        if (!conversation) {
            conversation = await prisma.conversation.create({
                data: {
                    requestId,
                    providerId: request.providerId
                }
            });
        }

        return NextResponse.json(conversation);
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
