
import {
    Document,
    Page,
    StyleSheet,
    Text,
    View,
    Image
} from "@react-pdf/renderer"

import CabecalhoInstitucional from "../compartilhados/CabecalhoInstitucional"
import InformacoesPaciente from "../compartilhados/InformacoesDoPaciente"
import InformacoesDoSolicitante from "../compartilhados/InformacoesDoSolicitante"
import DadosClinicos from "../compartilhados/DadosClinicos"
import { LuSiren } from "react-icons/lu"

interface DocumentoRequisicaoProcedimentosProps {
    encaminhamento: any
    codigoDeBarras: string
}

const styles = StyleSheet.create({
    pagina: {
        padding: 25,
        fontFamily: "Helvetica",
        backgroundColor: "#FFFFFF",
    },

    conteudo: {
        marginTop: 15,
        padding: 8,
        borderWidth: 1,
        borderColor: "#000000",
        borderStyle: "solid",
    },

    textoTeste: {
        fontSize: 10,
        color: "#666666",
    },
    titulo: {
        fontSize: 11,
        fontWeight: "bold",
        marginBottom: 6,
        textAlign: "center",
        display: "flex",
        justifyContent: "center",
        alignItems: 'center'
    },
    linha: {
        borderBottomWidth: 1,
        borderBottomColor: "#000",
        marginBottom: 8,
    },
    container: {
        // borderWidth: 1,
        // borderColor: "#000000",
        // borderStyle: "solid",
    },
    linhaInformacoes: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 4,
    },
    campo: {
        flexDirection: "column",
        alignItems: "flex-start",
    },
    exame: {
        width: "45%",
    },
    label: {
        fontSize: 9,
        fontWeight: "bold",
    },
    valor: {
        textTransform: "capitalize",
        fontSize: 9,
        display: "flex",
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: "center",
        marginTop: 4
    },
    codigo: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: '20%'
    },
    assinaturaDoCliente: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        gap: 4,
        flex: '1'
    },
    medicoSolicitante: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        gap: 4,
        flex: '1'
    },
    containerAssinatura: {
        // marginTop: 30
    },
    avisoDocumentos: {
        marginTop: "auto",
        padding: 10,
        borderWidth: 1,
        borderColor: "#D6A400",
        borderStyle: "solid",
        borderRadius: 4,
        backgroundColor: "#FFF9E6",
        position: 'relative'
    },

    tituloAviso: {
        fontSize: 12,
        fontWeight: "bold",
        color: "#8A5700",
        textAlign: "center",
        borderBottomWidth: 1,
        borderBottomColor: "#D6A400",
        paddingBottom: 4
    },

    subtituloAviso: {
        fontSize: 9,
        fontWeight: "bold",
        color: "#7A4B00",
        marginBottom: 4,
        marginTop: 6,
    },

    listaDocumentos: {
        fontSize: 9,
        color: "#333333",
        marginLeft: 8,
        marginBottom: 2,
    },
    documentosLinha: {
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 20,
        marginTop: 6,
    },
    secaoDocumentos: {
        flex: 1,
        marginBottom: 4,
    },
})

export default function DocumentoRequisicaoProcedimentos({ encaminhamento, codigoDeBarras }: DocumentoRequisicaoProcedimentosProps) {
    return (
        <Document>
            <Page size="A4" orientation="portrait" style={styles.pagina}>
                <CabecalhoInstitucional
                    titulo="Requisição de Exames/Procedimentos - Municipais"
                />
                <div style={styles.container}>
                    <InformacoesPaciente encaminhamento={encaminhamento} />
                    <InformacoesDoSolicitante encaminhamento={encaminhamento} />
                    <DadosClinicos encaminhamento={encaminhamento} />
                </div>

                <View style={styles.conteudo}>
                    <Text style={styles.titulo}>
                        Exames/Procedimentos Solicitados
                    </Text>

                    <View style={styles.linha} />

                    {/* Zero linha de informações */}
                    <View style={styles.linhaInformacoes}>
                        <View style={[styles.campo, styles.exame]}>
                            <Text style={styles.label}>Exame/Procedimento:</Text>
                            <Text style={styles.valor}>
                                {encaminhamento.procedimento.nome}
                            </Text>
                        </View>
                        <View style={styles.campo}>
                            <Text style={styles.label}>Membro:</Text>
                            <Text style={styles.valor}>
                                {encaminhamento.membroProcedimento?.nome || "Não Informado"}
                            </Text>
                        </View>
                        <View style={styles.campo}>
                            <Text style={styles.label}>Lateralidade:</Text>
                            <Text style={styles.valor}>
                                {encaminhamento.lado?.toLowerCase() || "Não Informado"}
                            </Text>
                        </View>
                    </View>
                </View>

                <View style={styles.containerAssinatura}>
                    {/* Zero linha de informações */}
                    <View style={styles.linhaInformacoes}>
                        <View style={styles.codigo}>
                            <Image
                                src={codigoDeBarras}
                                style={{
                                    width: 80,
                                    height: 30,
                                }}
                            />
                            <Text style={styles.valor}>
                                {encaminhamento.id}
                            </Text>
                        </View>
                        <View style={styles.assinaturaDoCliente}>
                            <Text style={{ width: "80%", borderBottomWidth: 1, borderColor: '#000', borderBottomStyle: 'solid', paddingTop: 55 }} />
                            <Text style={{ justifyContent: "center", fontSize: 9, display: 'flex', justifySelf: 'center', alignItems: 'center' }}>
                                Assinatura do Cliente
                            </Text>
                        </View>
                        <View style={styles.medicoSolicitante}>
                            <Text style={{ width: "80%", borderBottomWidth: 1, borderColor: '#000', borderBottomStyle: 'solid', paddingTop: 55 }} />
                            <Text style={styles.valor}>
                                Solicitante:{encaminhamento?.medicoSolicitante?.nome}
                            </Text>
                            <Text style={styles.valor}>
                                CRM/PR 2525654
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Avisos caso necessario */}

                {/* Tomografia */}
                {encaminhamento?.procedimento?.codigo === "483" && (
                    <View style={styles.avisoDocumentos}>
                        <Text style={styles.tituloAviso}>
                            ATENÇÃO — DOCUMENTOS NECESSÁRIOS PARA ANEXAR AO PEDIDO DE TOMOGRAFIA
                        </Text>

                        <View style={styles.documentosLinha}>
                            <View style={styles.secaoDocumentos}>
                                <Text style={styles.subtituloAviso}>
                                    Documentos do paciente
                                </Text>

                                <Text style={styles.listaDocumentos}>• RG</Text>
                                <Text style={styles.listaDocumentos}>• CPF</Text>
                                <Text style={styles.listaDocumentos}>• Cartão do SUS</Text>
                                <Text style={styles.listaDocumentos}>
                                    • Comprovante de residência, quando solicitado
                                </Text>
                            </View>

                            <View style={styles.secaoDocumentos}>
                                <Text style={styles.subtituloAviso}>
                                    Em caso de paciente menor de idade
                                </Text>

                                <Text style={styles.listaDocumentos}>
                                    • RG do responsável
                                </Text>

                                <Text style={styles.listaDocumentos}>
                                    • CPF do responsável
                                </Text>
                            </View>
                        </View>
                    </View>
                )}
                {/* Ressonancia */}
                {encaminhamento?.procedimento?.codigo === "228" && (
                    <View style={styles.avisoDocumentos}>
                        <Text style={styles.tituloAviso}>
                            ATENÇÃO — DOCUMENTOS NECESSÁRIOS PARA ANEXAR AO PEDIDO DE RESSONÂNCIA
                        </Text>

                        <View style={styles.documentosLinha}>
                            <View style={styles.secaoDocumentos}>
                                <Text style={styles.subtituloAviso}>
                                    Documentos do paciente
                                </Text>

                                <Text style={styles.listaDocumentos}>• RG</Text>
                                <Text style={styles.listaDocumentos}>• CPF</Text>
                                <Text style={styles.listaDocumentos}>• Cartão do SUS</Text>
                                <Text style={styles.listaDocumentos}>
                                    • Comprovante de residência, quando solicitado
                                </Text>
                            </View>

                            <View style={styles.secaoDocumentos}>
                                <Text style={styles.subtituloAviso}>
                                    Em caso de paciente menor de idade
                                </Text>

                                <Text style={styles.listaDocumentos}>
                                    • RG do responsável
                                </Text>

                                <Text style={styles.listaDocumentos}>
                                    • CPF do responsável
                                </Text>
                            </View>
                        </View>
                    </View>
                )}
            </Page>
        </Document>
    )
}
