import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        // 1. Check Admin Auth
        if (!session || session.user?.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { userId, status } = body;

        if (!userId || !status) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // 2. Update User Status
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { accountStatus: status }
        });

        return NextResponse.json({
            success: true,
            user: { id: updatedUser.id, status: updatedUser.accountStatus }
        });

    } catch (error) {
        console.error("ADMIN_BLOCK_ERROR:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
