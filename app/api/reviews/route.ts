import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { z } from "zod";

const reviewSchema = z.object({
    providerId: z.string(),
    requestId: z.string(),
    rating: z.number().min(1).max(5),
    comment: z.string().optional(),
});

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { providerId, requestId, rating, comment } = reviewSchema.parse(body);

        const review = await prisma.review.create({
            data: {
                providerId,
                userId: session.user.id,
                requestId,
                rating,
                comment,
            },
        });

        // Notify provider about new review
        await prisma.notification.create({
            data: {
                userId: (await prisma.provider.findUnique({ where: { id: providerId } }))?.userId || "",
                title: "New Review Received",
                message: `You received a ${rating}-star review for a job.`,
                type: "INFO",
            },
        });

        return NextResponse.json(review);
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

