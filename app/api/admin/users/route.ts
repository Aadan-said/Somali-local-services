import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth-utils";

// GET all users
export async function GET(req: Request) {
    try {
        const user = await getAuthUser(req);

        if (!user || user.role !== "ADMIN") {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const users = await prisma.user.findMany({
            orderBy: {
                createdAt: "desc"
            },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                role: true,
                accountStatus: true,
                createdAt: true,
                image: true
            }
        });

        return NextResponse.json(users);
    } catch (error) {
        console.error("[ADMIN_USERS_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

// PATCH update user status/role
export async function PATCH(req: Request) {
    try {
        const user = await getAuthUser(req);

        if (!user || user.role !== "ADMIN") {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const body = await req.json();
        const { userId, accountStatus, role } = body;

        if (!userId) {
            return new NextResponse("User ID is required", { status: 400 });
        }

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                ...(accountStatus && { accountStatus }),
                ...(role && { role })
            }
        });

        return NextResponse.json(updatedUser);
    } catch (error) {
        console.error("[ADMIN_USERS_PATCH]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
