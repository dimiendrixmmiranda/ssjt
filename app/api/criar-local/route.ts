import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import {
    TipoDeLocal,
    AtendimentoDentroOuForaDoMunicipio,
} from "@/generated/prisma/enums";

export async function GET() {
    try {
        const sessao = await auth();

        if (!sessao?.user) {
            return NextResponse.json(
                { erro: "Não autorizado." },
                { status: 401 }
            );
        }

        const locais = await prisma.local.findMany({
            orderBy: {
                nome: "asc",
            },
        });

        return NextResponse.json(locais, { status: 200 });

    } catch (erro) {
        console.error("Erro ao buscar locais:", erro);

        return NextResponse.json(
            { erro: "Não foi possível buscar os locais." },
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
            tipoDeLocal,
            atendimentoDentroOuForaDoMunicipio,
            quantidadeDeSalas,
            cidade,
            cep,
            uf,
            rua,
            numero,
            bairro,
            complemento,
            telefone1,
            email,
        } = dados;

        if (
            !nome ||
            !Object.values(TipoDeLocal).includes(tipoDeLocal) ||
            !Object.values(AtendimentoDentroOuForaDoMunicipio).includes(
                atendimentoDentroOuForaDoMunicipio
            ) ||
            !cidade ||
            !cep ||
            !uf ||
            !rua ||
            !numero ||
            !bairro ||
            !telefone1
        ) {
            return NextResponse.json(
                { erro: "Preencha corretamente todos os campos obrigatórios." },
                { status: 400 }
            );
        }

        const novoLocal = await prisma.local.create({
            data: {
                nome,
                tipoDeLocal,
                atendimentoDentroOuForaDoMunicipio,
                quantidadeDeSalas,
                ativo: true,
                cidade,
                cep,
                uf,
                rua,
                numero,
                bairro,
                complemento: complemento || null,
                telefone1,
                email: email || null,
            },
        });

        return NextResponse.json(novoLocal, { status: 201 });

    } catch (erro) {
        console.error("Erro ao cadastrar local:", erro);

        return NextResponse.json(
            { erro: "Não foi possível cadastrar o local." },
            { status: 500 }
        );
    }
}