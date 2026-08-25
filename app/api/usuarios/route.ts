import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const {
            nome,
            email,
            senha,
            role,
            contaAtiva,
            localId,
        } = body;

        if (!nome || !email || !senha || !role) {
            return NextResponse.json(
                {
                    erro: "Preencha todos os campos obrigatórios.",
                },
                { status: 400 }
            );
        }

        const usuarioExistente = await prisma.usuario.findUnique({
            where: {
                email: email.toLowerCase(),
            },
        });

        if (usuarioExistente) {
            return NextResponse.json(
                {
                    erro: "Já existe um usuário com este e-mail.",
                },
                { status: 409 }
            );
        }

        // Se foi informado um local, verifica se ele existe
        if (localId) {
            const localExistente = await prisma.local.findUnique({
                where: {
                    id: localId,
                },
            });

            if (!localExistente) {
                return NextResponse.json(
                    {
                        erro: "O local informado não existe.",
                    },
                    { status: 400 }
                );
            }
        }

        const senhaHash = await bcrypt.hash(senha, 10);

        const usuario = await prisma.usuario.create({
            data: {
                nome,
                email: email.toLowerCase(),
                senha: senhaHash,
                role,
                ativo: contaAtiva ?? true,
                localId: localId || null,
            },

            include: {
                local: true,
            },
        });

        return NextResponse.json(
            {
                mensagem: "Usuário criado com sucesso.",
                usuario: {
                    id: usuario.id,
                    nome: usuario.nome,
                    email: usuario.email,
                    role: usuario.role,
                    ativo: usuario.ativo,

                    localId: usuario.localId,
                    local: usuario.local,
                },
            },
            { status: 201 }
        );

    } catch (error) {
        console.error("Erro ao criar usuário:", error);

        return NextResponse.json(
            {
                erro: "Erro interno ao criar usuário.",
            },
            { status: 500 }
        );
    }
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);

        const usuarioAtualId = searchParams.get("usuarioAtualId");

        const usuarios = await prisma.usuario.findMany({
            where: usuarioAtualId
                ? {
                      id: {
                          not: usuarioAtualId,
                      },
                  }
                : undefined,

            select: {
                id: true,
                nome: true,
                email: true,
                role: true,
                ativo: true,
                createdAt: true,

                localId: true,
            },

            orderBy: {
                nome: "asc",
            },
        });

        return NextResponse.json(usuarios);

    } catch (error) {
        console.error("Erro ao buscar usuários:", error);

        return NextResponse.json(
            {
                erro: "Erro ao buscar usuários.",
            },
            {
                status: 500,
            }
        );
    }
}