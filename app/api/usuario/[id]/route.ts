import { Perfil } from "@/app/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

// PUT - Editar usuário
export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const usuarioId = Number(id);

        if (isNaN(usuarioId)) {
            return NextResponse.json(
                { erro: "ID inválido." },
                { status: 400 }
            );
        }

        const body = await request.json();

        const {
            nome,
            email,
            senha,
            perfil,
            dataDeNascimento,
            unidadeDeOrigemId,
        } = body;

        if (!nome || !email || !perfil) {
            return NextResponse.json(
                {
                    erro: "Nome, email e perfil são obrigatórios.",
                },
                { status: 400 }
            );
        }

        const usuario = await prisma.usuario.findUnique({
            where: {
                id: usuarioId,
            },
        });

        if (!usuario) {
            return NextResponse.json(
                { erro: "Usuário não encontrado." },
                { status: 404 }
            );
        }

        if (!Object.values(Perfil).includes(perfil)) {
            return NextResponse.json(
                { erro: "Perfil inválido." },
                { status: 400 }
            );
        }

        const emailNormalizado = email.trim().toLowerCase();

        const outroUsuario = await prisma.usuario.findFirst({
            where: {
                email: emailNormalizado,
                NOT: {
                    id: usuarioId,
                },
            },
        });

        if (outroUsuario) {
            return NextResponse.json(
                {
                    erro: "Já existe outro usuário com esse email.",
                },
                { status: 409 }
            );
        }

        if (unidadeDeOrigemId) {
            const local = await prisma.local.findUnique({
                where: {
                    id: Number(unidadeDeOrigemId),
                },
            });

            if (!local) {
                return NextResponse.json(
                    {
                        erro: "Unidade de origem não encontrada.",
                    },
                    { status: 404 }
                );
            }
        }
        const dataNascimento = dataDeNascimento
            ? new Date(`${dataDeNascimento}T00:00:00`)
            : null
            
        const dadosAtualizacao: {
            nome: string;
            email: string;
            perfil: Perfil;
            unidadeDeOrigemId: number | null;
            dataDeNascimento: Date | null;
            senha?: string;
        } = {
            nome: nome.trim(),
            email: emailNormalizado,
            perfil,
            unidadeDeOrigemId: unidadeDeOrigemId
                ? Number(unidadeDeOrigemId)
                : null,
            dataDeNascimento: dataNascimento
        };

        if (senha && senha.trim()) {
            dadosAtualizacao.senha = await bcrypt.hash(
                senha,
                10
            );
        }

        const usuarioAtualizado = await prisma.usuario.update({
            where: {
                id: usuarioId,
            },
            data: dadosAtualizacao,
            select: {
                id: true,
                nome: true,
                email: true,
                perfil: true,
                unidadeDeOrigemId: true,
                dataDeNascimento: true,
                ativo: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        return NextResponse.json(
            usuarioAtualizado
        );

    } catch (error) {
        console.error("Erro ao editar usuário:", error);

        return NextResponse.json(
            {
                erro: "Erro interno ao editar usuário.",
            },
            {
                status: 500,
            }
        );
    }
}
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const usuarioId = Number(id);

        if (isNaN(usuarioId)) {
            return NextResponse.json(
                { erro: "ID inválido." },
                { status: 400 }
            );
        }

        const usuario = await prisma.usuario.findUnique({
            where: {
                id: usuarioId,
            },
        });

        if (!usuario) {
            return NextResponse.json(
                { erro: "Usuário não encontrado." },
                { status: 404 }
            );
        }

        await prisma.usuario.delete({
            where: {
                id: usuarioId,
            },
        });

        return NextResponse.json({
            mensagem: "Usuário excluído com sucesso.",
        });

    } catch (error) {
        console.error("Erro ao excluir usuário:", error);

        return NextResponse.json(
            { erro: "Erro interno ao excluir usuário." },
            { status: 500 }
        );
    }
}