
import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import {
    TipoDeEncaminhamento,
    CategoriaEspecialidade,
    TipoDeConsulta,
    LadoDoCorpo,
    TipoProcedimento,
    Lateralidade
} from "@/generated/prisma/enums"

export async function GET() {
    try {
        const sessao = await auth()

        if (!sessao?.user) {
            return NextResponse.json(
                { erro: "Não autorizado." },
                { status: 401 }
            )
        }

        const encaminhamentos = await prisma.encaminhamento.findMany({
            orderBy: {
                dataDeEntrada: "desc"
            },
            include: {
                paciente: true,
                unidadeDeOrigem: true,
                medicoSolicitante: true,
                especialidadeDoPrestador: true,
                especialidadeEncaminhada: true,
                procedimento: {
                    include: {
                        membros: true
                    }
                },
                membroProcedimento: true
            }
        })

        return NextResponse.json(encaminhamentos)

    } catch (erro) {
        console.error("Erro ao buscar encaminhamentos:", erro)

        return NextResponse.json(
            { erro: "Erro ao buscar encaminhamentos." },
            { status: 500 }
        )
    }
}

export async function POST(request: NextRequest) {
    try {
        const sessao = await auth()

        if (!sessao?.user) {
            return NextResponse.json(
                { erro: "Não autorizado." },
                { status: 401 }
            )
        }

        const dados = await request.json()

        const {
            tipo,
            pacienteId,
            unidadeDeOrigemId,
            dataDeEntrada,
            medicoSolicitanteId,
            especialidadeDoPrestadorId,
            categoria,
            tipoDeConsulta,
            especialidadeEncaminhadaId,
            tipoDeCirurgia,
            procedimentoId,
            membroProcedimentoId,
            lado,
            situacao,
            encaminhamentoRemarcado,
            condicaoDeRetorno,
            dataDoRetorno
        } = dados

        // Conversão dos IDs
        const pacienteIdNum = Number(pacienteId)
        const unidadeDeOrigemIdNum = Number(unidadeDeOrigemId)

        const medicoIdNum = medicoSolicitanteId
            ? Number(medicoSolicitanteId)
            : null

        const especialidadePrestadorIdNum = especialidadeDoPrestadorId
            ? Number(especialidadeDoPrestadorId)
            : null

        const especialidadeEncaminhadaIdNum = especialidadeEncaminhadaId
            ? Number(especialidadeEncaminhadaId)
            : null

        const procedimentoIdNum = procedimentoId
            ? Number(procedimentoId)
            : null

        const membroProcedimentoIdNum = membroProcedimentoId
            ? Number(membroProcedimentoId)
            : null

        // Validações básicas
        if (
            !Object.values(TipoDeEncaminhamento).includes(tipo) ||
            !Number.isInteger(pacienteIdNum) ||
            !Number.isInteger(unidadeDeOrigemIdNum) ||
            !dataDeEntrada ||
            !situacao
        ) {
            return NextResponse.json(
                { erro: "Preencha corretamente os campos obrigatórios." },
                { status: 400 }
            )
        }

        const dataEntrada = new Date(`${dataDeEntrada}T00:00:00.000Z`)

        if (Number.isNaN(dataEntrada.getTime())) {
            return NextResponse.json(
                { erro: "Data de entrada inválida." },
                { status: 400 }
            )
        }

        // Verificar paciente e unidade de origem
        const [paciente, unidade] = await Promise.all([
            prisma.paciente.findUnique({
                where: { id: pacienteIdNum }
            }),
            prisma.local.findUnique({
                where: { id: unidadeDeOrigemIdNum }
            })
        ])

        if (!paciente) {
            return NextResponse.json(
                { erro: "Paciente não encontrado." },
                { status: 404 }
            )
        }

        if (!unidade) {
            return NextResponse.json(
                { erro: "Unidade de origem não encontrada." },
                { status: 404 }
            )
        }

        // Verificar médico e especialidade vinculada a ele
        if (medicoIdNum) {
            const medico = await prisma.prestador.findUnique({
                where: { id: medicoIdNum }
            })

            if (!medico || medico.tipo !== "MEDICO") {
                return NextResponse.json(
                    { erro: "Médico solicitante inválido." },
                    { status: 400 }
                )
            }

            if (especialidadePrestadorIdNum) {
                const vinculo = await prisma.prestadorEspecialidade.findFirst({
                    where: {
                        prestadorId: medicoIdNum,
                        especialidadeId: especialidadePrestadorIdNum
                    }
                })

                if (!vinculo) {
                    return NextResponse.json(
                        { erro: "A especialidade informada não pertence ao médico selecionado." },
                        { status: 400 }
                    )
                }
            }
        } else if (especialidadePrestadorIdNum) {
            return NextResponse.json(
                { erro: "Informe o médico solicitante da especialidade." },
                { status: 400 }
            )
        }

        // Campos exclusivos de consulta
        let categoriaValida: CategoriaEspecialidade | null = null
        let tipoConsultaValido: TipoDeConsulta | null = null
        let especialidadeDestinoValida: number | null = null
        let cirurgiaValida: string | null = null
        let condicaoRetornoValida: string | null = null
        let dataRetornoValida: Date | null = null

        // Campos exclusivos de procedimento
        let procedimentoValido: number | null = null
        let membroValido: number | null = null
        let ladoValido: LadoDoCorpo | null = null

        if (tipo === TipoDeEncaminhamento.CONSULTA) {
            if (
                !Object.values(CategoriaEspecialidade).includes(categoria) ||
                (
                    categoria === CategoriaEspecialidade.NORMAL &&
                    !Object.values(TipoDeConsulta).includes(tipoDeConsulta)
                ) ||
                !especialidadeEncaminhadaIdNum
            ) {
                return NextResponse.json(
                    { erro: "Informe a categoria, o tipo de consulta e a especialidade de destino." },
                    { status: 400 }
                )
            }

            const especialidade = await prisma.especialidade.findUnique({
                where: { id: especialidadeEncaminhadaIdNum }
            })

            if (!especialidade) {
                return NextResponse.json(
                    { erro: "Especialidade de destino não encontrada." },
                    { status: 404 }
                )
            }

            categoriaValida = categoria

            tipoConsultaValido =
                categoria === CategoriaEspecialidade.NORMAL
                    ? tipoDeConsulta
                    : null

            especialidadeDestinoValida = especialidadeEncaminhadaIdNum

            if (tipoDeCirurgia) {
                cirurgiaValida = String(tipoDeCirurgia).trim() || null
            }

            if (condicaoDeRetorno) {
                condicaoRetornoValida = String(condicaoDeRetorno).trim() || null
            }

            if (dataDoRetorno) {
                dataRetornoValida = new Date(`${dataDoRetorno}T00:00:00.000Z`)

                if (Number.isNaN(dataRetornoValida.getTime())) {
                    return NextResponse.json(
                        { erro: "Data de retorno inválida." },
                        { status: 400 }
                    )
                }
            }

        } else if (tipo === TipoDeEncaminhamento.PROCEDIMENTO) {
            if (!procedimentoIdNum) {
                return NextResponse.json(
                    { erro: "Selecione um procedimento." },
                    { status: 400 }
                )
            }

            const procedimento = await prisma.procedimento.findUnique({
                where: { id: procedimentoIdNum }
            })

            if (!procedimento) {
                return NextResponse.json(
                    { erro: "Procedimento não encontrado." },
                    { status: 404 }
                )
            }

            if (procedimento.tipo === TipoProcedimento.COM_MEMBROS) {
                if (!membroProcedimentoIdNum) {
                    return NextResponse.json(
                        { erro: "Selecione o membro do procedimento." },
                        { status: 400 }
                    )
                }

                const membro = await prisma.membroProcedimento.findFirst({
                    where: {
                        id: membroProcedimentoIdNum,
                        procedimentoId: procedimentoIdNum
                    }
                })

                if (!membro) {
                    return NextResponse.json(
                        { erro: "Membro não pertence ao procedimento selecionado." },
                        { status: 400 }
                    )
                }

                membroValido = membro.id

                if (membro.lateralidade === Lateralidade.COM_LADO) {
                    if (!Object.values(LadoDoCorpo).includes(lado)) {
                        return NextResponse.json(
                            { erro: "Selecione o lado do corpo." },
                            { status: 400 }
                        )
                    }

                    ladoValido = lado
                } else if (lado) {
                    return NextResponse.json(
                        { erro: "Este membro não permite informar lateralidade." },
                        { status: 400 }
                    )
                }

            } else if (membroProcedimentoIdNum || lado) {
                return NextResponse.json(
                    { erro: "Este procedimento não permite selecionar membro ou lado." },
                    { status: 400 }
                )
            }

            procedimentoValido = procedimentoIdNum
        }

        // Criar encaminhamento
        const encaminhamento = await prisma.encaminhamento.create({
            data: {
                tipo,
                pacienteId: pacienteIdNum,
                unidadeDeOrigemId: unidadeDeOrigemIdNum,
                dataDeEntrada: dataEntrada,

                medicoSolicitanteId: medicoIdNum,
                especialidadeDoPrestadorId: especialidadePrestadorIdNum,

                categoria: categoriaValida,
                tipoDeConsulta: tipoConsultaValido,
                especialidadeEncaminhadaId: especialidadeDestinoValida,
                tipoDeCirurgia: cirurgiaValida,

                procedimentoId: procedimentoValido,
                membroProcedimentoId: membroValido,
                lado: ladoValido,

                situacao: String(situacao).trim(),
                encaminhamentoRemarcado: Boolean(encaminhamentoRemarcado),

                condicaoDeRetorno: condicaoRetornoValida,
                dataDoRetorno: dataRetornoValida
            },
            include: {
                paciente: true,
                unidadeDeOrigem: true,
                medicoSolicitante: true,
                especialidadeDoPrestador: true,
                especialidadeEncaminhada: true,
                procedimento: true,
                membroProcedimento: true
            }
        })

        return NextResponse.json(encaminhamento, { status: 201 })

    } catch (erro) {
        console.error("Erro ao criar encaminhamento:", erro)

        return NextResponse.json(
            { erro: "Erro ao criar encaminhamento." },
            { status: 500 }
        )
    }
}
