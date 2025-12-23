import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { image } = await req.json();

        if (!image) {
            return NextResponse.json({ error: "No image provided" }, { status: 400 });
        }

        // In a real app, you might upload this to S3/Cloudinary
        // For this local dev, we'll store the base64/URL in the DB
        const updatedUser = await prisma.user.update({
            where: { id: session.user.id },
            data: { image },
        });

        return NextResponse.json({
            message: "Muuqaalkagii (profile) waa lacusboonaysiiyay!",
            image: updatedUser.image
        });
    } catch (error) {
        console.error("Image upload error:", error);
        return NextResponse.json({ error: "Cillad ayaa dhacday xilligii la soo galinayay sawirka" }, { status: 500 });
    }
}
