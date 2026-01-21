import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: "/login",
        error: "/login",
    },
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                identifier: { label: "Email or Phone", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.identifier || !credentials?.password) {
                    return null;
                }

                const { identifier, password } = credentials;
                let user = null;

                // Check if identifier looks like an email
                if (identifier.includes("@")) {
                    console.log(`AUTH_DEBUG: Attempting login with EMAIL: ${identifier}`);
                    user = await prisma.user.findUnique({
                        where: { email: identifier },
                    });
                } else {
                    console.log(`AUTH_DEBUG: Attempting login with PHONE: ${identifier}`);
                    user = await prisma.user.findUnique({
                        where: { phone: identifier },
                    });
                }

                if (!user) {
                    console.log(`AUTH_FAIL: User not found for identifier: '${identifier}'`);
                    return null;
                }

                console.log(`AUTH_DEBUG: User ${user.phone || user.email} found with role: ${user.role}`);

                const isPasswordValid = await bcrypt.compare(
                    password,
                    user.password
                );

                if (!isPasswordValid) {
                    return null;
                }

                if (user.accountStatus !== 'ACTIVE') {
                    console.log(`AUTH_BLOCKED: User ${user.phone} is ${user.accountStatus}`);
                    throw new Error("Your account has been deactivated. Contact support.");
                }

                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                    phone: user.phone,
                };
            },
        }),
    ],
    callbacks: {
        async session({ token, session }) {
            if (token) {
                session.user.id = token.id;
                session.user.name = token.name;
                session.user.email = token.email;
                session.user.role = token.role;
                session.user.phone = token.phone;
            }
            return session;
        },
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.role = (user as any).role;
                token.phone = (user as any).phone;
            }
            return token;
        },
    },
    debug: process.env.NODE_ENV === "development",
    secret: process.env.NEXTAUTH_SECRET,
    logger: {
        error(code, metadata) {
            console.error("NextAuth Error:", code, metadata);
        },
        warn(code) {
            console.warn("NextAuth Warn:", code);
        },
        debug(code, metadata) {
            console.debug("NextAuth Debug:", code, metadata);
        },
    },
};
