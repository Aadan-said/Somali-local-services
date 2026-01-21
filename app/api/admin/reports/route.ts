import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth-utils";

// GET all reports
export async function GET(req: Request) {
    try {
        const user = await getAuthUser(req);

        if (!user || user.role !== "ADMIN") {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const reports = await (prisma as any).report.findMany({
            include: {
                user: {
                    select: {
                        name: true,
                        email: true
                    }
                }
            },
            orderBy: {
                createdAt: "desc"
            }
        });

        return NextResponse.json(reports);
    } catch (error) {
        console.error("[ADMIN_REPORTS_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

// PATCH update report status
export async function PATCH(req: Request) {
    try {
        const user = await getAuthUser(req);

        if (!user || user.role !== "ADMIN") {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const body = await req.json();
        const { reportId, status } = body;

        if (!reportId) {
            return new NextResponse("Report ID is required", { status: 400 });
        }

        const updatedReport = await (prisma as any).report.update({
            where: { id: reportId },
            data: { status }
        });

        return NextResponse.json(updatedReport);
    } catch (error) {
        console.error("[ADMIN_REPORTS_PATCH]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
