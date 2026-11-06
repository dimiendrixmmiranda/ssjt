import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import {
    AtendimentoDentroOuForaDoMunicipio,
    TipoDeLocal,
} from "@/generated/prisma/enums";

interface Params {
    params: Promise<{ id: string }>;
}

export async function PUT(request: Request, { params }: Params) {
    try {
        const sessao = await auth();

        if (!sessao?.user) {
            return NextResponse.json(
                { erro: "Não autorizado." },
                { status: 401 }
            );
        }

        const { id } = await params;
        const idLocal = Number(id);

        if (!Number.isInteger(idLocal) || idLocal <= 0) {
            return NextResponse.json(
                { erro: "ID do local inválido." },
                { status: 400 }
            );
        }

        const dados = await request.json();

        const {
            nome,
            tipoDeLocal,
            atendimentoDentroOuForaDoMunicipio,
            quantidadeDeSalas,
            cidade,
            cep,
            rua,
            numero,
            bairro,
            complemento,
            telefone1,
            email,
        } = dados;

        const camposObrigatorios = [
            nome,
            cidade,
            cep,
            rua,
            numero,
            bairro,
            telefone1,
        ];

        if (
            camposObrigatorios.some(
                campo => typeof campo !== "string" || !campo.trim()
            ) ||
            !Object.values(TipoDeLocal).includes(tipoDeLocal) ||
            !Object.values(AtendimentoDentroOuForaDoMunicipio).includes(
                atendimentoDentroOuForaDoMunicipio
            )
        ) {
            return NextResponse.json(
                { erro: "Preencha corretamente todos os campos obrigatórios." },
                { status: 400 }
            );
        }

        const localExistente = await prisma.local.findUnique({
            where: { id: idLocal },
        });

        if (!localExistente) {
            return NextResponse.json(
                { erro: "Local não encontrado." },
                { status: 404 }
            );
        }

        const localAtualizado = await prisma.local.update({
            where: { id: idLocal },
            data: {
                nome: nome.trim(),
                tipoDeLocal,
                atendimentoDentroOuForaDoMunicipio,
                quantidadeDeSalas,
                cidade: cidade.trim(),
                cep: cep.trim(),
                rua: rua.trim(),
                numero: numero.trim(),
                bairro: bairro.trim(),
                complemento: complemento?.trim() || null,
                telefone1: telefone1.trim(),
                email: email?.trim() || null,
            },
        });

        return NextResponse.json(localAtualizado, { status: 200 });

    } catch (erro) {
        console.error("Erro ao atualizar local:", erro);

        return NextResponse.json(
            { erro: "Não foi possível atualizar o local." },
            { status: 500 }
        );
    }
}


export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const sessao = await auth();

        if (!sessao?.user) {
            return NextResponse.json(
                { erro: "Não autorizado." },
                { status: 401 }
            );
        }

        const { id } = await params;
        const idLocal = Number(id);

        if (!Number.isInteger(idLocal) || idLocal <= 0) {
            return NextResponse.json(
                { erro: "ID do local inválido." },
                { status: 400 }
            );
        }

        const { ativo } = await request.json();

        if (typeof ativo !== "boolean") {
            return NextResponse.json(
                { erro: "Status inválido." },
                { status: 400 }
            );
        }

        const localExistente = await prisma.local.findUnique({
            where: { id: idLocal },
        });

        if (!localExistente) {
            return NextResponse.json(
                { erro: "Local não encontrado." },
                { status: 404 }
            );
        }

        const localAtualizado = await prisma.local.update({
            where: { id: idLocal },
            data: { ativo },
        });

        return NextResponse.json(localAtualizado, { status: 200 });

    } catch (erro) {
        console.error("Erro ao alterar status do local:", erro);

        return NextResponse.json(
            { erro: "Não foi possível alterar o status do local." },
            { status: 500 }
        );
    }
}