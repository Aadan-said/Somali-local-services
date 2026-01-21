import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth-utils";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
    try {
        const user = await getAuthUser(req);
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { current, new: newPassword } = body;

        if (!current || !newPassword) {
            return NextResponse.json({ error: "Fadlan buuxi password-ka hore iyo kan cusub" }, { status: 400 });
        }

        // 1. Verify current password
        const dbUser = await prisma.user.findUnique({
            where: { id: user.id }
        });

        if (!dbUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const isValid = await bcrypt.compare(current, dbUser.password);
        if (!isValid) {
            return NextResponse.json({ error: "Password-ka hore waa qalad" }, { status: 400 });
        }

        // 2. Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // 3. Update password
        await prisma.user.update({
            where: { id: user.id },
            data: { password: hashedPassword }
        });

        return NextResponse.json({ success: true, message: "Password-ka waa la bedelay" });

    } catch (error) {
        console.error("CHANGE_PASSWORD_ERROR:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
