import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";

export const { handlers, signIn, signOut, auth } = NextAuth({
    secret: process.env.AUTH_SECRET,

    providers: [
        Credentials({
            credentials: {
                email: {
                    label: "Email",
                    type: "email",
                },
                senha: {
                    label: "Senha",
                    type: "password",
                },
            },

            async authorize(credentials) {

                if (!credentials?.email || !credentials?.senha) {
                    return null;
                }

                const usuario = await prisma.usuario.findUnique({
                    where: {
                        email: credentials.email as string,
                    },
                });

                if (!usuario) {
                    return null;
                }

                if (!usuario.ativo) {
                    return null;
                }

                const senhaValida = await bcrypt.compare(
                    credentials.senha as string,
                    usuario.senha
                );

                if (!senhaValida) {
                    return null;
                }

                return {
                    id: usuario.id.toString(),
                    name: usuario.nome,
                    email: usuario.email,
                    perfil: usuario.perfil,
                };
            },
        }),
    ],

    callbacks: {
        async jwt({ token, user }) {

            if (user) {
                token.id = user.id;
                token.perfil = user.perfil;
            }

            return token;
        },

        async session({ session, token }) {

            if (session.user) {
                session.user.id = token.id as string;
                session.user.perfil = token.perfil as string;
            }

            return session;
        },
    },
});