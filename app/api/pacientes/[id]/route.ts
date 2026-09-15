import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const body = await request.json();

        const paciente = await prisma.paciente.update({
            where: {
                id,
            },

            data: {
                nome: body.nome,
                nomeSocial: body.nomeSocial,
                declaroNaoPossuirNomeSocial:
                    body.declaroNaoPossuirNomeSocial,

                nomeDaMae: body.nomeDaMae,
                nomeDoPai: body.nomeDoPai,

                dataDeNascimento: new Date(
                    body.dataDeNascimento
                ),

                sexo: body.sexo,
                estadoCivil: body.estadoCivil,
                corRaca: body.corRaca,

                cpf: body.cpf,
                cartaoSus: body.cartaoSus,
                nis: body.nis,

                unidadeDeSaude: body.unidadeDeSaude,

                codigoGsus: body.codigoGsus,
                codigoIds: body.codigoIds,

                tipoSanguineo: body.tipoSanguineo,
                fatorRh: body.fatorRh,

                observacoes: body.observacoes,

                telefone1: body.telefone1,
                telefone2: body.telefone2,
                email: body.email,

                rg: body.rg,
                orgaoEmissor: body.orgaoEmissor,
                ufRg: body.ufRg,

                dataEmissaoRg: body.dataEmissaoRg
                    ? new Date(body.dataEmissaoRg)
                    : null,

                cpfRegular: body.cpfRegular,
                cpfCns: body.cpfCns,
                cnsMae: body.cnsMae,
                orientacaoRegCpf: body.orientacaoRegCpf,

                tituloEleitor: body.tituloEleitor,
                zonaEleitoral: body.zonaEleitoral,
                secaoEleitoral: body.secaoEleitoral,

                ctpsNumero: body.ctpsNumero,
                ctpsSerie: body.ctpsSerie,
                ctpsUf: body.ctpsUf,

                ctpsDataEmissao: body.ctpsDataEmissao
                    ? new Date(body.ctpsDataEmissao)
                    : null,

                pisPasep: body.pisPasep,

                frequentaEscola: body.frequentaEscola,
                escola: body.escola,
                serieEscolar: body.serieEscolar,
                grauEscolaridade: body.grauEscolaridade,
                cursoProfissionalizante:
                    body.cursoProfissionalizante,

                paisOrigem: body.paisOrigem,

                entradaBrasil: body.entradaBrasil
                    ? new Date(body.entradaBrasil)
                    : null,

                numeroPortaria: body.numeroPortaria,

                dataNaturalizacao: body.dataNaturalizacao
                    ? new Date(body.dataNaturalizacao)
                    : null,

                pais: body.pais,
                uf: body.uf,
                municipio: body.municipio,

                cep: body.cep,

                bairro: body.bairro,
                rua: body.rua,
                numero: body.numero,
                complemento: body.complemento,

                zona: body.zona
                    ? body.zona.toUpperCase()
                    : null,

                latitude: body.latitude,
                longitude: body.longitude,
            },
        });

        return NextResponse.json(paciente);

    } catch (error) {
        console.error(
            "Erro ao editar paciente:",
            error
        );

        return NextResponse.json(
            {
                erro: "Erro ao editar paciente.",
            },
            {
                status: 500,
            }
        );
    }
}