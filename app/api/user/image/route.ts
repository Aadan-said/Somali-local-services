import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth-utils";

export async function POST(req: Request) {
    try {
        const user = await getAuthUser(req);

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { image } = await req.json();

        if (!image) {
            return NextResponse.json({ error: "No image provided" }, { status: 400 });
        }

        // In a real app, you might upload this to S3/Cloudinary
        // For this local dev, we'll store the base64/URL in the DB
        const updatedUser = await prisma.user.update({
            where: { id: user.id },
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
