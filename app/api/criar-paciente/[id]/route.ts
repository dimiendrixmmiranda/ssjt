
import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { Prisma } from "@/generated/prisma/client"

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        // Verificar autenticação
        const sessao = await auth()

        if (!sessao?.user) {
            return NextResponse.json(
                { erro: "Não autorizado." },
                { status: 401 }
            )
        }

        // Obter e validar ID
        const { id } = await params
        const pacienteId = Number(id)

        if (!Number.isInteger(pacienteId) || pacienteId <= 0) {
            return NextResponse.json(
                { erro: "ID do paciente inválido." },
                { status: 400 }
            )
        }

        const dados = await request.json()

        const pacienteAtualizado = await prisma.paciente.update({
            where: {
                id: pacienteId,
            },
            data: {
                ...dados,

                dataDeNascimento: new Date(
                    `${dados.dataDeNascimento}T12:00:00.000Z`
                ),

                dataDaEmissaoDoRG: dados.dataDaEmissaoDoRG
                    ? new Date(`${dados.dataDaEmissaoDoRG}T12:00:00.000Z`)
                    : null,

                CTPSDataEmissao: dados.CTPSDataEmissao
                    ? new Date(`${dados.CTPSDataEmissao}T12:00:00.000Z`)
                    : null,

                entradaNoBrasil: dados.entradaNoBrasil
                    ? new Date(`${dados.entradaNoBrasil}T12:00:00.000Z`)
                    : null,
            },
        })
        return NextResponse.json(
            {
                mensagem: "Paciente atualizado com sucesso.",
                paciente: pacienteAtualizado,
            },
            { status: 200 }
        )

    } catch (erro) {
        console.error("Erro ao atualizar paciente:", erro)

        if (
            erro instanceof Prisma.PrismaClientKnownRequestError &&
            erro.code === "P2025"
        ) {
            return NextResponse.json(
                { erro: "Paciente não encontrado." },
                { status: 404 }
            )
        }

        return NextResponse.json(
            { erro: "Não foi possível atualizar o paciente." },
            { status: 500 }
        )
    }
}
