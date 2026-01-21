import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
    process.env.NEXTAUTH_SECRET || "fallback-secret-for-dev"
);

export async function getAuthUser(req: Request) {
    try {
        // 1. Try to get session from cookies (Web)
        const session = await getServerSession(authOptions);
        if (session?.user) {
            return {
                id: session.user.id,
                email: session.user.email,
                name: session.user.name,
                role: session.user.role,
                phone: session.user.phone,
            };
        }

        // 2. Try to get token from Authorization header (Mobile)
        const authHeader = req.headers.get("authorization");
        if (authHeader?.startsWith("Bearer ")) {
            const token = authHeader.substring(7);
            try {
                const { payload } = await jwtVerify(token, JWT_SECRET);

                if (payload) {
                    console.log("Auth verified via Bearer token:", payload.email);
                    return {
                        id: payload.id as string,
                        email: payload.email as string,
                        name: payload.name as string,
                        role: payload.role as string,
                        phone: payload.phone as string,
                    };
                }
            } catch (jwtError: any) {
                console.error("JWT Verification failed:", jwtError.message);
                return null;
            }
        }

        console.log("No valid session or Bearer token found");
        return null;
    } catch (error) {
        console.error("Auth verification error:", error);
        return null;
    }
}
