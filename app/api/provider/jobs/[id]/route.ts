import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth-utils";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const user = await getAuthUser(req);
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;

        const job = await prisma.serviceRequest.findUnique({
            where: { id },
            include: {
                user: {
                    select: {
                        name: true,
                        image: true,
                        phone: true
                    }
                },
                review: true,
                provider: {
                    select: {
                        verified: true
                    }
                }
            }
        });

        if (!job) {
            return NextResponse.json({ error: "Job not found" }, { status: 404 });
        }

        // Add clientName for consistency with mobile expectations
        const responseData = {
            ...job,
            clientName: job.user.name,
        };

        return NextResponse.json(responseData);
    } catch (error) {
        console.error("GET_JOB_ERROR:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
