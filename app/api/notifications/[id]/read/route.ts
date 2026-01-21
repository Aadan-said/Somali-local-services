import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth-utils";

export async function PATCH(
    req: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const user = await getAuthUser(req);
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await context.params;

        const notification = await prisma.notification.findUnique({
            where: { id }
        });

        if (!notification) {
            return NextResponse.json({ error: "Notification not found" }, { status: 404 });
        }

        if (notification.userId !== user.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        const updated = await prisma.notification.update({
            where: { id },
            data: { read: true }
        });

        return NextResponse.json(updated);
    } catch (error) {
        console.error("NOTIFICATION_UPDATE_ERROR:", error);
        return NextResponse.json({ error: "Internal Server Error", details: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
    }
}
