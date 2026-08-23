import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
    try {
        const body = await req.json()
        console.log("BODY RECEBIDO:", body)
        
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
        if (!body.telefone1?.trim()) {
            return NextResponse.json(
                { erro: "Informe o telefone principal." },
                { status: 400 }
            )
        }

        const dataDeNascimento = new Date(body.dataDeNascimento)

        if (isNaN(dataDeNascimento.getTime())) {
            return NextResponse.json(
                { erro: "Data de nascimento inválida." },
                { status: 400 }
            )
        }

        const paciente = await prisma.paciente.create({
            data: {
                // ==========================================
                // INFORMAÇÕES PESSOAIS
                // ==========================================

                nome: body.nome.trim(),

                nomeSocial:
                    body.nomeSocial?.trim() || null,

                declaroNaoPossuirNomeSocial:
                    Boolean(body.declaroNaoPossuirNomeSocial),

                nomeDaMae:
                    body.nomeDaMae.trim(),

                nomeDoPai:
                    body.nomeDoPai?.trim() || null,

                dataDeNascimento,

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

                nis:
                    body.nis?.trim() || null,

                unidadeDeSaude:
                    body.unidadeDeSaude?.trim() || null,

                codigoGsus:
                    body.codigoGsus?.trim() || null,

                codigoIds:
                    body.codigoIds?.trim() || null,

                tipoSanguineo:
                    body.tipoSanguineo || null,

                fatorRh:
                    body.fatorRh || null,

                observacoes:
                    body.observacoes?.trim() || null,

                // ==========================================
                // CONTATO
                // ==========================================

                telefone1:
                    body.telefone1.trim(),

                telefone2:
                    body.telefone2?.trim() || null,

                email:
                    body.email?.trim() || null,

                // ==========================================
                // DOCUMENTOS
                // ==========================================

                rg:
                    body.rg?.trim() || null,

                orgaoEmissor:
                    body.orgaoEmissor || null,

                ufRg:
                    body.ufRg?.trim() || null,

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

                // ==========================================
                // TÍTULO DE ELEITOR
                // ==========================================

                tituloEleitor:
                    body.tituloEleitor?.trim() || null,

                zonaEleitoral:
                    body.zonaEleitoral?.trim() || null,

                secaoEleitoral:
                    body.secaoEleitoral?.trim() || null,

                // ==========================================
                // TRABALHISTA
                // ==========================================

                ctpsNumero:
                    body.ctpsNumero?.trim() || null,

                ctpsSerie:
                    body.ctpsSerie?.trim() || null,

                ctpsUf:
                    body.ctpsUf?.trim() || null,

                ctpsDataEmissao:
                    body.ctpsDataEmissao
                        ? new Date(body.ctpsDataEmissao)
                        : null,

                pisPasep:
                    body.pisPasep?.trim() || null,

                // ==========================================
                // EDUCAÇÃO
                // ==========================================

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

                // ==========================================
                // NATURALIZAÇÃO
                // ==========================================

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

                // ==========================================
                // ENDEREÇO
                // ==========================================

                pais:
                    body.pais || null,

                uf:
                    body.uf?.trim() || null,

                municipio:
                    body.municipio?.trim() || null,

                cep:
                    body.cep?.trim() || null,

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

                // ==========================================
                // GEOLOCALIZAÇÃO
                // ==========================================

                latitude:
                    body.latitude !== null &&
                    body.latitude !== undefined &&
                    body.latitude !== ""
                        ? Number(body.latitude)
                        : null,

                longitude:
                    body.longitude !== null &&
                    body.longitude !== undefined &&
                    body.longitude !== ""
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

    } catch (error: any) {

        console.error(
            "ERRO AO CADASTRAR PACIENTE:",
            error
        )

        // ==========================================
        // CPF DUPLICADO
        // ==========================================

        if (error?.code === "P2002") {
            return NextResponse.json(
                {
                    erro: "Já existe um paciente cadastrado com este CPF.",
                },
                { status: 409 }
            )
        }

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

        console.error(
            "ERRO REAL AO BUSCAR PACIENTES:",
            error
        )

        return NextResponse.json(
            {
                erro:
                    error instanceof Error
                        ? error.message
                        : "Erro desconhecido ao buscar pacientes.",
            },
            {
                status: 500,
            }
        )
    }
}