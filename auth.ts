import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import { compare } from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
    session: {
        strategy: "jwt",
    },

    providers: [
        Credentials({
            credentials: {
                email: {},
                password: {},
            },

            async authorize(credentials) {
                if (
                    typeof credentials.email !== "string" ||
                    typeof credentials.password !== "string"
                ) {
                    return null;
                }

                const email = credentials.email.trim().toLowerCase();

                const usuario = await prisma.usuario.findUnique({
                    where: { email },
                });

                if (!usuario || !usuario.ativo) {
                    return null;
                }

                const senhaValida = await compare(
                    credentials.password,
                    usuario.senhaHash
                );

                if (!senhaValida) {
                    return null;
                }

                return {
                    id: usuario.id,
                    name: usuario.nome,
                    email: usuario.email,
                };
            },
        }),
    ],

    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
            }

            return token;
        },

        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
            }

            return session;
        },
    },
});