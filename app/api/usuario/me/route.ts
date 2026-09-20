import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const sessao = await auth();

        if (!sessao?.user?.id) {
            return NextResponse.json(
                { erro: "Usuário não autenticado" },
                { status: 401 }
            );
        }

        const usuario = await prisma.usuario.findUnique({
            where: {
                id: Number(sessao.user.id),
            },
            select: {
                id: true,
                nome: true,
                email: true,
                perfil: true,
                imagem: true,
                unidadeDeOrigem: true,
                unidadeDeOrigemId: true,
                dataDeNascimento: true,
                ativo: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        if (!usuario) {
            return NextResponse.json(
                { erro: "Usuário não encontrado" },
                { status: 404 }
            );
        }

        return NextResponse.json(usuario);
    } catch (error) {
        console.error("Erro ao buscar usuário:", error);

        return NextResponse.json(
            { erro: "Erro interno do servidor" },
            { status: 500 }
        );
    }
}