
import { NextResponse } from "next/server"
import { TipoDoPrestador } from "@/generated/prisma/enums"
import { prisma } from "@/lib/prisma"

type Contexto = {
    params: Promise<{ id: string }>
}

export async function PATCH(request: Request, { params }: Contexto) {
    try {
        const { id } = await params
        const prestadorId = Number(id)

        if (!Number.isInteger(prestadorId) || prestadorId <= 0) {
            return NextResponse.json(
                { erro: "ID do prestador inválido." },
                { status: 400 }
            )
        }

        const body = await request.json()

        const {
            nome,
            cor,
            telefone,
            email,
            especialidadesIds = [],
            procedimentosIds = [],
        } = body

        // Valida o nome
        if (typeof nome !== "string" || !nome.trim()) {
            return NextResponse.json(
                { erro: "Informe o nome do prestador." },
                { status: 400 }
            )
        }

        // Valida a cor
        if (typeof cor !== "string" || !/^#[0-9A-Fa-f]{6}$/.test(cor)) {
            return NextResponse.json(
                { erro: "Selecione uma cor válida." },
                { status: 400 }
            )
        }

        // Valida os arrays
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

        const idsEspecialidades = [...new Set(especialidadesIds)]
        const idsProcedimentos = [...new Set(procedimentosIds)]

        // Busca o prestador
        const prestadorExistente = await prisma.prestador.findUnique({
            where: { id: prestadorId },
        })

        if (!prestadorExistente) {
            return NextResponse.json(
                { erro: "Prestador não encontrado." },
                { status: 404 }
            )
        }

        // Valida os vínculos conforme o tipo do prestador
        if (prestadorExistente.tipo === TipoDoPrestador.MEDICO) {
            if (idsEspecialidades.length === 0) {
                return NextResponse.json(
                    { erro: "Selecione pelo menos uma especialidade." },
                    { status: 400 }
                )
            }

            if (idsProcedimentos.length > 0) {
                return NextResponse.json(
                    { erro: "Médicos não podem possuir procedimentos vinculados diretamente." },
                    { status: 400 }
                )
            }
        }

        if (
            prestadorExistente.tipo ===
            TipoDoPrestador.PRESTADOR_DE_SERVICOS_MEDICOS
        ) {
            if (idsProcedimentos.length === 0) {
                return NextResponse.json(
                    { erro: "Selecione pelo menos um procedimento." },
                    { status: 400 }
                )
            }

            if (idsEspecialidades.length > 0) {
                return NextResponse.json(
                    { erro: "Prestadores de serviços médicos não podem possuir especialidades." },
                    { status: 400 }
                )
            }
        }

        // Verifica as especialidades
        if (idsEspecialidades.length > 0) {
            const especialidades = await prisma.especialidade.findMany({
                where: {
                    id: { in: idsEspecialidades },
                    ativo: true,
                },
                select: { id: true },
            })

            if (especialidades.length !== idsEspecialidades.length) {
                return NextResponse.json(
                    { erro: "Uma ou mais especialidades não existem ou estão inativas." },
                    { status: 400 }
                )
            }
        }

        // Verifica os procedimentos
        if (idsProcedimentos.length > 0) {
            const procedimentos = await prisma.procedimento.findMany({
                where: {
                    id: { in: idsProcedimentos },
                    ativo: true,
                },
                select: { id: true },
            })

            if (procedimentos.length !== idsProcedimentos.length) {
                return NextResponse.json(
                    { erro: "Um ou mais procedimentos não existem ou estão inativos." },
                    { status: 400 }
                )
            }
        }

        // Atualiza o prestador e substitui os vínculos
        const prestador = await prisma.prestador.update({
            where: { id: prestadorId },
            data: {
                nome: nome.trim(),
                cor,
                telefone,
                email,

                especialidades: {
                    deleteMany: {},
                    create: idsEspecialidades.map((especialidadeId: number) => ({
                        especialidade: {
                            connect: { id: especialidadeId },
                        },
                    })),
                },

                procedimentos: {
                    deleteMany: {},
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
                                    orderBy: { id: "asc" },
                                },
                            },
                        },
                    },
                },
            },
        })

        return NextResponse.json(prestador)

    } catch (erro) {
        console.error("Erro ao editar prestador:", erro)

        const erroPrisma = erro as { code?: string }

        if (erroPrisma.code === "P2002") {
            return NextResponse.json(
                { erro: "Essa cor já está sendo utilizada por outro prestador." },
                { status: 409 }
            )
        }

        if (erroPrisma.code === "P2025") {
            return NextResponse.json(
                { erro: "Prestador não encontrado." },
                { status: 404 }
            )
        }

        return NextResponse.json(
            { erro: "Erro ao editar prestador." },
            { status: 500 }
        )
    }
}

export async function PUT(request: Request, { params }: Contexto) {
    try {
        const { id } = await params
        const prestadorId = Number(id)

        if (!Number.isInteger(prestadorId) || prestadorId <= 0) {
            return NextResponse.json(
                { erro: "ID do prestador inválido." },
                { status: 400 }
            )
        }

        const body = await request.json()
        const { ativo } = body

        if (typeof ativo !== "boolean") {
            return NextResponse.json(
                { erro: "Informe um status válido." },
                { status: 400 }
            )
        }

        const prestador = await prisma.prestador.update({
            where: { id: prestadorId },
            data: { ativo },
        })

        return NextResponse.json(prestador)

    } catch (erro) {
        console.error("Erro ao alterar status do prestador:", erro)

        const erroPrisma = erro as { code?: string }

        if (erroPrisma.code === "P2025") {
            return NextResponse.json(
                { erro: "Prestador não encontrado." },
                { status: 404 }
            )
        }

        return NextResponse.json(
            { erro: "Erro ao alterar status do prestador." },
            { status: 500 }
        )
    }
}
