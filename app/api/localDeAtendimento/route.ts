import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST - Cadastrar local
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const {
            nome,
            tipo,
            rede,
            cidade,
            cep,
            uf,
            rua,
            numero,
            bairro,
            complemento,
            telefone1,
            telefone2,
            email,
        } = body;

        if (
            !nome ||
            !tipo ||
            !rede ||
            !cidade ||
            !cep ||
            !uf ||
            !rua ||
            !numero ||
            !bairro ||
            !telefone1
        ) {
            return NextResponse.json(
                {
                    erro: "Nome, tipo, cidade, CEP, UF, rua, número, bairro e telefone 1 são obrigatórios.",
                },
                { status: 400 }
            );
        }
        const local = await prisma.local.create({
            data: {
                nome,
                tipo,
                rede,
                ativo: true,

                cidade,
                cep,
                uf,

                rua,
                numero,
                bairro,
                complemento: complemento || null,

                telefone1,
                telefone2: telefone2 || null,
                email: email || null,
            },
        });

        return NextResponse.json(
            local,
            { status: 201 }
        );

    } catch (error) {
        console.error("Erro ao cadastrar local:", error);

        return NextResponse.json(
            {
                erro: "Erro interno ao cadastrar local.",
            },
            {
                status: 500,
            }
        );
    }
}


// GET - Buscar locais
export async function GET() {
    try {
        const locais = await prisma.local.findMany({
            where: {
                ativo: true,
            },
            orderBy: {
                nome: "asc",
            },
        });

        return NextResponse.json(locais);

    } catch (error) {
        console.error("Erro ao buscar locais:", error);

        return NextResponse.json(
            {
                erro: "Erro interno ao buscar locais.",
            },
            {
                status: 500,
            }
        );
    }
}