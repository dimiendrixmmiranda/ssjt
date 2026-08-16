import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./app/generated/prisma/client";

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
    adapter,
});

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Credentials({
            credentials: {
                email: {},
                senha: {},
            },

            async authorize(credentials) {
                if (!credentials?.email || !credentials?.senha) {
                    return null;
                }

                const usuario = await prisma.usuario.findUnique({
                    where: {
                        email: String(credentials.email),
                    },
                });

                if (!usuario) {
                    return null;
                }

                if (!usuario.ativo) {
                    return null;
                }

                const senhaValida = await bcrypt.compare(
                    String(credentials.senha),
                    usuario.senha
                );

                if (!senhaValida) {
                    return null;
                }

                return {
                    id: usuario.id,
                    name: usuario.nome,
                    email: usuario.email,
                    role: usuario.role,
                };
            },
        }),
    ],

    session: {
        strategy: "jwt",
    },

    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.role = user.role;
            }

            return token;
        },

        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
                session.user.role = token.role as "SUPER_ADMIN" | "ADMIN";
            }

            return session;
        },
    },

    pages: {
        signIn: "/login",
    },
});