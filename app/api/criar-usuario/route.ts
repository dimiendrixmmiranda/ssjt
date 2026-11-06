import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";
import { TipoDeConta } from "@/generated/prisma/enums";

export async function GET() {
    try {
        const sessao = await auth();

        if (!sessao?.user) {
            return NextResponse.json(
                { erro: "Não autorizado." },
                { status: 401 }
            );
        }

        const usuarios = await prisma.usuario.findMany({
            select: {
                id: true,
                nome: true,
                email: true,
                imagem: true,
                dataDeNascimento: true,
                ativo: true,
                tipoDeConta: true,
                localId: true,
                local: {
                    select: {
                        id: true,
                        nome: true,
                    },
                },
                createdAt: true,
                updatedAt: true,
            },
            orderBy: {
                nome: "asc",
            },
        });

        return NextResponse.json(usuarios, { status: 200 });

    } catch (erro) {
        console.error("Erro ao buscar usuários:", erro);

        return NextResponse.json(
            { erro: "Não foi possível buscar os usuários." },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const sessao = await auth();

        if (!sessao?.user) {
            return NextResponse.json(
                { erro: "Não autorizado." },
                { status: 401 }
            );
        }

        const dados = await request.json();

        const {
            nome,
            email,
            dataDeNascimento,
            senha,
            tipoDeConta,
            unidadeDeOrigem,
        } = dados;

        if (
            !nome?.trim() ||
            !email?.trim() ||
            !senha ||
            !Object.values(TipoDeConta).includes(tipoDeConta)
        ) {
            return NextResponse.json(
                { erro: "Preencha corretamente os campos obrigatórios." },
                { status: 400 }
            );
        }

        if (senha.length < 8) {
            return NextResponse.json(
                { erro: "A senha deve possuir pelo menos 8 caracteres." },
                { status: 400 }
            );
        }

        const emailExistente = await prisma.usuario.findUnique({
            where: { email: email.trim() },
        });

        if (emailExistente) {
            return NextResponse.json(
                { erro: "Este email já está cadastrado." },
                { status: 409 }
            );
        }

        const dataNascimento = dataDeNascimento
            ? new Date(`${dataDeNascimento}T12:00:00`)
            : null;

        if (dataDeNascimento && isNaN(dataNascimento!.getTime())) {
            return NextResponse.json(
                { erro: "Data de nascimento inválida." },
                { status: 400 }
            );
        }

        const localId = unidadeDeOrigem
            ? Number(unidadeDeOrigem)
            : null;

        if (localId !== null) {
            const localExistente = await prisma.local.findUnique({
                where: { id: localId },
            });

            if (!localExistente) {
                return NextResponse.json(
                    { erro: "A unidade de origem informada não existe." },
                    { status: 400 }
                );
            }
        }

        const senhaHash = await hash(senha, 12);

        const novoUsuario = await prisma.usuario.create({
            data: {
                nome: nome.trim(),
                email: email.trim(),
                dataDeNascimento: dataNascimento,
                senhaHash,
                tipoDeConta,
                localId,
            },
            select: {
                id: true,
                nome: true,
                email: true,
                dataDeNascimento: true,
                ativo: true,
                tipoDeConta: true,
                localId: true,
                createdAt: true,
            },
        });

        return NextResponse.json(novoUsuario, { status: 201 });

    } catch (erro) {
        console.error("Erro ao cadastrar usuário:", erro);

        return NextResponse.json(
            { erro: "Não foi possível cadastrar o usuário." },
            { status: 500 }
        );
    }
}