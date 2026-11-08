
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { TipoDeCadastroPaciente } from "@/generated/prisma/enums";

// GET - Listar pacientes
export async function GET() {
    try {
        const sessao = await auth();

        if (!sessao?.user) {
            return NextResponse.json(
                { erro: "Não autorizado." },
                { status: 401 }
            );
        }

        const pacientes = await prisma.paciente.findMany({
            orderBy: {
                nomeDoPaciente: "asc",
            },
            include: {
                unidadeDeSaude: {
                    select: {
                        id: true,
                        nome: true,
                    },
                },
            },
        });

        return NextResponse.json(pacientes, { status: 200 });

    } catch (erro) {
        console.error("Erro ao buscar pacientes:", erro);

        return NextResponse.json(
            { erro: "Erro ao buscar pacientes." },
            { status: 500 }
        );
    }
}

// POST - Cadastrar paciente
export async function POST(request: NextRequest) {
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
            tipoDeCadastro = TipoDeCadastroPaciente.COMPLETO,
            nomeDoPaciente,
            nomeSocial,
            nomeDaMae,
            nomeDoPai,
            dataDeNascimento,
            sexo,
            estadoCivil,
            corERaca,
            unidadeDeSaudeId,
            codigoGSUS,
            codigoIDS,
            tipoSanguineo,
            fatorRH,
            nacionalidade,
            municipioDeNascimento,
            ufDeNascimento,
            CPF,
            cartaoDoSus,
            NIS,
            RG,
            orgaoEmissorDoRG,
            ufDoRG,
            dataDaEmissaoDoRG,
            cnsMae,
            orientacaoRegCpf,
            tituloDeEleitor,
            zonaEleitoral,
            secaoEleitoral,
            CTPSNumero,
            CTPSSerie,
            cTPSUf,
            CTPSDataEmissao,
            PISPASEP,
            frequentaEscola,
            escola,
            serieEscolar,
            grauEscolaridade,
            cursoProfissionalizante,
            paisDeOrigem,
            entradaNoBrasil,
            email,
            telefone,
            telefoneWhatsApp,
            nomeContatoEmergencia,
            parentescoContatoEmergencia,
            telefoneDeEmergencia,
            nomeDoResponsavel,
            CPFDoResponsavel,
            parentescoDoResponsavel,
            telefoneDoResponsavel,
            pais,
            UF,
            municipio,
            bairro,
            rua,
            numero,
            complemento,
            CEP,
            tipoLogradouro,
            pontoDeReferencia,
            latitude,
            longitude,
            zona,
            possuiDeficiencia,
            tipoDeDeficiencia,
            observacoes,
            ativo,
        } = dados;

        // Validação dos campos básicos
        if (
            !nomeDoPaciente?.trim() ||
            !dataDeNascimento ||
            !sexo ||
            !unidadeDeSaudeId
        ) {
            return NextResponse.json(
                { erro: "Preencha os campos obrigatórios." },
                { status: 400 }
            );
        }

        // Validação do tipo de cadastro
        if (
            !Object.values(TipoDeCadastroPaciente).includes(tipoDeCadastro)
        ) {
            return NextResponse.json(
                { erro: "Tipo de cadastro inválido." },
                { status: 400 }
            );
        }

        // Validações específicas do cadastro completo
        if (tipoDeCadastro === TipoDeCadastroPaciente.COMPLETO) {
            const camposObrigatorios = [
                nomeDaMae,
                nacionalidade,
                municipioDeNascimento,
                ufDeNascimento,
                pais,
                UF,
                municipio,
                bairro,
                tipoLogradouro,
                rua,
                CEP,
            ];

            if (
                camposObrigatorios.some(
                    (campo) => !campo || !String(campo).trim()
                )
            ) {
                return NextResponse.json(
                    {
                        erro: "Preencha todos os campos obrigatórios do cadastro completo.",
                    },
                    { status: 400 }
                );
            }

            if (!CPF?.trim() && !cartaoDoSus?.trim()) {
                return NextResponse.json(
                    {
                        erro: "Informe o CPF ou o Cartão Nacional de Saúde.",
                    },
                    { status: 400 }
                );
            }
        }

        // Conversão e validação de datas
        const converterData = (valor?: string | null) => {
            if (!valor) return null;

            const data = new Date(`${valor}T00:00:00.000Z`);

            if (Number.isNaN(data.getTime())) {
                throw new Error("Uma das datas informadas é inválida.");
            }

            return data;
        };

        // Conversão e validação de números
        const converterNumero = (valor: unknown) => {
            if (valor === "" || valor === null || valor === undefined) {
                return null;
            }

            const numero = Number(valor);

            if (!Number.isFinite(numero)) {
                throw new Error("Um dos valores numéricos informados é inválido.");
            }

            return numero;
        };

        // Validação do ID da unidade de saúde
        const idUnidade = Number(unidadeDeSaudeId);

        if (!Number.isInteger(idUnidade) || idUnidade <= 0) {
            return NextResponse.json(
                { erro: "Unidade de saúde inválida." },
                { status: 400 }
            );
        }

        // Verifica se a unidade de saúde existe
        const local = await prisma.local.findUnique({
            where: {
                id: idUnidade,
            },
        });

        if (!local) {
            return NextResponse.json(
                { erro: "Unidade de saúde não encontrada." },
                { status: 404 }
            );
        }

        // Criação do paciente
        const paciente = await prisma.paciente.create({
            data: {
                tipoDeCadastro,
                nomeDoPaciente: nomeDoPaciente.trim(),
                nomeSocial: nomeSocial || null,
                nomeDaMae: nomeDaMae || null,
                nomeDoPai: nomeDoPai || null,
                dataDeNascimento: converterData(dataDeNascimento)!,
                sexo,
                estadoCivil: estadoCivil || null,
                corERaca: corERaca || null,

                unidadeDeSaudeId: idUnidade,

                codigoGSUS: codigoGSUS || null,
                codigoIDS: codigoIDS || null,
                tipoSanguineo: tipoSanguineo || null,
                fatorRH: fatorRH || null,

                nacionalidade: nacionalidade || null,
                municipioDeNascimento: municipioDeNascimento || null,
                ufDeNascimento: ufDeNascimento || null,

                CPF: CPF || null,
                cartaoDoSus: cartaoDoSus || null,
                NIS: NIS || null,
                RG: RG || null,
                orgaoEmissorDoRG: orgaoEmissorDoRG || null,
                ufDoRG: ufDoRG || null,
                dataDaEmissaoDoRG: converterData(dataDaEmissaoDoRG),
                cnsMae: cnsMae || null,
                orientacaoRegCpf: orientacaoRegCpf || null,
                tituloDeEleitor: tituloDeEleitor || null,
                zonaEleitoral: zonaEleitoral || null,
                secaoEleitoral: secaoEleitoral || null,

                CTPSNumero: CTPSNumero || null,
                CTPSSerie: CTPSSerie || null,
                cTPSUf: cTPSUf || null,
                CTPSDataEmissao: converterData(CTPSDataEmissao),
                PISPASEP: PISPASEP || null,

                frequentaEscola: frequentaEscola || null,
                escola: escola || null,
                serieEscolar: serieEscolar || null,
                grauEscolaridade: grauEscolaridade || null,
                cursoProfissionalizante: cursoProfissionalizante || null,

                paisDeOrigem: paisDeOrigem || null,
                entradaNoBrasil: converterData(entradaNoBrasil),

                email: email || null,
                telefone: telefone || null,
                telefoneWhatsApp: telefoneWhatsApp || null,
                nomeContatoEmergencia: nomeContatoEmergencia || null,
                parentescoContatoEmergencia: parentescoContatoEmergencia || null,
                telefoneDeEmergencia: telefoneDeEmergencia || null,

                nomeDoResponsavel: nomeDoResponsavel || null,
                CPFDoResponsavel: CPFDoResponsavel || null,
                parentescoDoResponsavel: parentescoDoResponsavel || null,
                telefoneDoResponsavel: telefoneDoResponsavel || null,

                pais: pais || null,
                UF: UF || null,
                municipio: municipio || null,
                bairro: bairro || null,
                rua: rua || null,
                numero: numero || null,
                complemento: complemento || null,
                CEP: CEP || null,
                tipoLogradouro: tipoLogradouro || null,
                pontoDeReferencia: pontoDeReferencia || null,

                latitude: converterNumero(latitude),
                longitude: converterNumero(longitude),

                zona: zona || null,

                possuiDeficiencia: Boolean(possuiDeficiencia),
                tipoDeDeficiencia: possuiDeficiencia
                    ? tipoDeDeficiencia || []
                    : [],

                observacoes: observacoes || null,

                ativo: ativo ?? true,
            },
        })
        
        console.log("Dados recebidos:", {
            nomeDoPaciente,
            dataDeNascimento,
            sexo,
            unidadeDeSaudeId,
        });

        return NextResponse.json(
            {
                mensagem: "Paciente cadastrado com sucesso.",
                paciente,
            },
            { status: 201 }
        );

    } catch (erro) {
        console.error("Erro ao cadastrar paciente:", erro);

        if (erro instanceof Error && erro.message.includes("inválida")) {
            return NextResponse.json(
                { erro: erro.message },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { erro: "Erro interno ao cadastrar paciente." },
            { status: 500 }
        );
    }
}