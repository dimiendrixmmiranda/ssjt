import { NextResponse } from "next/server"

import { TipoDoPrestador } from "@/generated/prisma/enums"
import { prisma } from "@/lib/prisma"

export async function GET() {
    try {
        const prestadores = await prisma.prestador.findMany({
            include: {
                especialidades: {
                    include: {
                        especialidade: true
                    }
                },
                procedimentos: {
                    include: {
                        procedimento: true
                    }
                }
            }
        })

        return NextResponse.json(prestadores)
    } catch (erro) {
        console.error("Erro ao buscar prestadores:", erro)

        return NextResponse.json(
            { erro: "Erro ao buscar prestadores." },
            { status: 500 }
        )
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json()

        const {
            nome,
            tipo,
            cor,
            telefone,
            email,
            especialidadesIds = [],
            procedimentosIds = [],
        } = body

        // Validações básicas
        if (!nome || typeof nome !== "string" || !nome.trim()) {
            return NextResponse.json(
                { erro: "Informe o nome do prestador." },
                { status: 400 }
            )
        }

        if (
            tipo !== TipoDoPrestador.MEDICO &&
            tipo !== TipoDoPrestador.PRESTADOR_DE_SERVICOS_MEDICOS
        ) {
            return NextResponse.json(
                { erro: "Tipo de prestador inválido." },
                { status: 400 }
            )
        }

        if (typeof cor !== "string" || !/^#[0-9A-Fa-f]{6}$/.test(cor)) {
            return NextResponse.json(
                { erro: "Selecione uma cor válida." },
                { status: 400 }
            )
        }

        if (
            !Array.isArray(especialidadesIds) ||
            !Array.isArray(procedimentosIds) ||
            !especialidadesIds.every(Number.isInteger) ||
            !procedimentosIds.every(Number.isInteger)
        ) {
            return NextResponse.json(
                { erro: "Especialidades ou procedimentos inválidos." },
                { status: 400 }
            )
        }

        // Remove IDs repetidos
        const idsEspecialidades = [...new Set(especialidadesIds)]
        const idsProcedimentos = [...new Set(procedimentosIds)]

        // Médico precisa ter especialidades
        if (tipo === TipoDoPrestador.MEDICO) {
            if (idsEspecialidades.length === 0) {
                return NextResponse.json(
                    { erro: "Selecione pelo menos uma especialidade." },
                    { status: 400 }
                )
            }

            if (idsProcedimentos.length > 0) {
                return NextResponse.json(
                    { erro: "Médicos não devem possuir procedimentos vinculados diretamente." },
                    { status: 400 }
                )
            }
        }

        // Prestador de serviços médicos precisa ter procedimentos
        if (tipo === TipoDoPrestador.PRESTADOR_DE_SERVICOS_MEDICOS) {
            if (idsProcedimentos.length === 0) {
                return NextResponse.json(
                    { erro: "Selecione pelo menos um procedimento." },
                    { status: 400 }
                )
            }

            if (idsEspecialidades.length > 0) {
                return NextResponse.json(
                    { erro: "Prestadores de serviços médicos não devem possuir especialidades." },
                    { status: 400 }
                )
            }
        }

        // Verifica se todas as especialidades existem e estão ativas
        if (idsEspecialidades.length > 0) {
            const especialidades = await prisma.especialidade.findMany({
                where: {
                    id: { in: idsEspecialidades },
                    ativo: true,
                },
                select: {
                    id: true,
                },
            })

            if (especialidades.length !== idsEspecialidades.length) {
                return NextResponse.json(
                    { erro: "Uma ou mais especialidades não existem ou estão inativas." },
                    { status: 400 }
                )
            }
        }

        // Verifica se todos os procedimentos existem e estão ativos
        if (idsProcedimentos.length > 0) {
            const procedimentos = await prisma.procedimento.findMany({
                where: {
                    id: { in: idsProcedimentos },
                    ativo: true,
                },
                select: {
                    id: true,
                },
            })

            if (procedimentos.length !== idsProcedimentos.length) {
                return NextResponse.json(
                    { erro: "Um ou mais procedimentos não existem ou estão inativos." },
                    { status: 400 }
                )
            }
        }

        // Cria o prestador e seus vínculos
        const prestador = await prisma.prestador.create({
            data: {
                nome: nome.trim(),
                tipo,
                cor,
                telefone,
                email,
                especialidades: {
                    create: idsEspecialidades.map((especialidadeId: number) => ({
                        especialidade: {
                            connect: { id: especialidadeId },
                        },
                    })),
                },

                procedimentos: {
                    create: idsProcedimentos.map((procedimentoId: number) => ({
                        procedimento: {
                            connect: { id: procedimentoId },
                        },
                    })),
                },
            },
            include: {
                especialidades: {
                    include: {
                        especialidade: true,
                    },
                },
                procedimentos: {
                    include: {
                        procedimento: {
                            include: {
                                membros: {
                                    orderBy: {
                                        id: "asc",
                                    },
                                },
                            },
                        },
                    },
                },
            },
        })

        return NextResponse.json(prestador, { status: 201 })
    } catch (erro) {
        console.error("Erro ao cadastrar prestador:", erro)

        const erroPrisma = erro as { code?: string }

        if (erroPrisma.code === "P2002") {
            return NextResponse.json(
                { erro: "Essa cor já está sendo utilizada por outro prestador." },
                { status: 409 }
            )
        }

        return NextResponse.json(
            { erro: "Erro ao cadastrar prestador." },
            { status: 500 }
        )
    }
}