import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
    try {
        const body = await req.json()

        console.log("BODY RECEBIDO:", body)

        // =========================
        // VALIDAÇÕES
        // =========================

        if (!body.nome?.trim()) {
            return NextResponse.json(
                { erro: "Informe o nome do paciente." },
                { status: 400 }
            )
        }

        if (!body.nomeDaMae?.trim()) {
            return NextResponse.json(
                { erro: "Informe o nome da mãe." },
                { status: 400 }
            )
        }

        if (!body.dataDeNascimento) {
            return NextResponse.json(
                { erro: "Informe a data de nascimento." },
                { status: 400 }
            )
        }

        if (!body.cpf?.trim()) {
            return NextResponse.json(
                { erro: "Informe o CPF." },
                { status: 400 }
            )
        }

        // =========================
        // CRIA PACIENTE
        // =========================

        const paciente = await prisma.paciente.create({
            data: {
                // =====================================
                // INFORMAÇÕES PESSOAIS
                // =====================================

                nome: body.nome.trim(),

                nomeSocial:
                    body.nomeSocial?.trim() || null,

                declaroNaoPossuirNomeSocial:
                    Boolean(body.declaroNaoPossuirNomeSocial),

                nomeDaMae:
                    body.nomeDaMae.trim(),

                nomeDoPai:
                    body.nomeDoPai?.trim() || null,

                dataDeNascimento:
                    new Date(body.dataDeNascimento),

                sexo:
                    body.sexo || null,

                estadoCivil:
                    body.estadoCivil || null,

                corRaca:
                    body.corRaca || null,

                cpf:
                    body.cpf.trim(),

                cartaoSus:
                    body.cartaoSus?.trim() || null,

                codigoGsus:
                    body.codigoGsus?.trim() || null,

                codigoIds:
                    body.codigoIds?.trim() || null,

                nis:
                    body.nis?.trim() || null,

                unidadeDeSaude:
                    body.unidadeDeSaude?.trim() || null,

                tipoSanguineo:
                    body.tipoSanguineo || null,

                fatorRh:
                    body.fatorRh || null,

                situacaoFamiliar:
                    body.situacaoFamiliar || null,

                povoTradicional:
                    body.povoTradicional || null,

                religiao:
                    body.religiao || null,

                observacoes:
                    body.observacoes?.trim() || null,

                // =====================================
                // DOCUMENTOS
                // =====================================

                rg:
                    body.rg?.trim() || null,

                orgaoEmissor:
                    body.orgaoEmissor || null,

                ufRg:
                    body.ufRg || null,

                dataEmissaoRg:
                    body.dataEmissaoRg
                        ? new Date(body.dataEmissaoRg)
                        : null,

                cpfRegular:
                    body.cpfRegular || null,

                cpfCns:
                    body.cpfCns?.trim() || null,

                cnsMae:
                    body.cnsMae?.trim() || null,

                orientacaoRegCpf:
                    body.orientacaoRegCpf || null,

                // =====================================
                // TÍTULO DE ELEITOR
                // =====================================

                tituloEleitor:
                    body.tituloEleitor?.trim() || null,

                zonaEleitoral:
                    body.zonaEleitoral?.trim() || null,

                secaoEleitoral:
                    body.secaoEleitoral?.trim() || null,

                // =====================================
                // TRABALHISTA
                // =====================================

                ctpsNumero:
                    body.ctpsNumero?.trim() || null,

                ctpsSerie:
                    body.ctpsSerie?.trim() || null,

                ctpsUf:
                    body.ctpsUf || null,

                ctpsDataEmissao:
                    body.ctpsDataEmissao
                        ? new Date(body.ctpsDataEmissao)
                        : null,

                pisPasep:
                    body.pisPasep?.trim() || null,

                // =====================================
                // EDUCAÇÃO
                // =====================================

                frequentaEscola:
                    body.frequentaEscola || null,

                escola:
                    body.escola?.trim() || null,

                serieEscolar:
                    body.serieEscolar?.trim() || null,

                grauEscolaridade:
                    body.grauEscolaridade || null,

                cursoProfissionalizante:
                    body.cursoProfissionalizante?.trim() || null,

                // =====================================
                // NATURALIZAÇÃO
                // =====================================

                paisOrigem:
                    body.paisOrigem?.trim() || null,

                entradaBrasil:
                    body.entradaBrasil
                        ? new Date(body.entradaBrasil)
                        : null,

                numeroPortaria:
                    body.numeroPortaria?.trim() || null,

                dataNaturalizacao:
                    body.dataNaturalizacao
                        ? new Date(body.dataNaturalizacao)
                        : null,

                // =====================================
                // LOCALIDADE
                // =====================================

                pais:
                    body.pais || null,

                uf:
                    body.uf || null,

                municipio:
                    body.municipio?.trim() || null,

                bairro:
                    body.bairro?.trim() || null,

                rua:
                    body.rua?.trim() || null,

                numero:
                    body.numero?.trim() || null,

                complemento:
                    body.complemento?.trim() || null,

                zona:
                    body.zona || null,

                // =====================================
                // GEOLOCALIZAÇÃO
                // =====================================

                latitude:
                    body.latitude !== null &&
                    body.latitude !== undefined
                        ? Number(body.latitude)
                        : null,

                longitude:
                    body.longitude !== null &&
                    body.longitude !== undefined
                        ? Number(body.longitude)
                        : null,
            },
        })

        console.log(
            "PACIENTE CRIADO:",
            paciente.id
        )

        return NextResponse.json(
            {
                mensagem: "Paciente cadastrado com sucesso.",
                paciente,
            },
            { status: 201 }
        )

    } catch (error) {

        console.error(
            "ERRO AO CADASTRAR PACIENTE:",
            error
        )

        return NextResponse.json(
            {
                erro:
                    error instanceof Error
                        ? error.message
                        : "Erro interno ao cadastrar paciente.",
            },
            { status: 500 }
        )
    }
}

export async function GET() {
    try {
        const pacientes = await prisma.paciente.findMany({
            orderBy: {
                nome: "asc",
            },
        })
        return NextResponse.json(pacientes)
    } catch (error) {
        console.error("ERRO AO BUSCAR PACIENTES:", error)
        return NextResponse.json(
            {
                erro: "Erro ao buscar pacientes.",
            },
            {
                status: 500,
            }
        )
    }
}