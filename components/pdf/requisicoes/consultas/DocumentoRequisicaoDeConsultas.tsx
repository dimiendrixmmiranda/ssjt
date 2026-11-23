
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

interface DocumentoRequisicaoConsultasProps {
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
        width: '100%',
        marginTop: "auto"
    },
    campo: {
        flexDirection: "row",
        alignItems: "center",
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
    },
    codigo: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: '20%',
        marginLeft: 'auto',
        marginTop: 12
    },
    profissionalResponsavelPelaReferencia: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        flex: '1'
    },
    responsavelContraReferencia: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        gap: 4,
        flex: '1'
    },
    containerAssinatura: {
        marginTop: 12,
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
    containerContrareferencia: {
        borderWidth: 1,
        borderColor: "#000000",
        borderStyle: "solid",
    },
    containerContrareferenciaLabel: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: 12,
        textAlign: 'center',
        fontWeight: 'bold',
        paddingBottom: 4,
        borderBottomWidth: 1,
        borderColor: "#000000",
        borderStyle: "solid",
    },
    linhaContrareferencia: {
        borderBottomWidth: 1,
        borderBottomColor: "#000",
        marginTop: 14,
    },
})

export default function DocumentoRequisicaoConsultas({ encaminhamento, codigoDeBarras }: DocumentoRequisicaoConsultasProps) {
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
                    {/* Zero linha de informações */}
                    <View style={styles.linhaInformacoes}>
                        <View style={styles.campo}>
                            <Text style={styles.label}>Especialidade Indicada:</Text>
                            <Text style={styles.valor}>
                                {encaminhamento.especialidadeEncaminhada?.nome}
                            </Text>
                        </View>
                        <View style={styles.campo}>
                            {/* Consulta ou retorno */}
                            <Text style={styles.label}>Tipo:</Text>
                            <Text style={styles.valor}>
                                {encaminhamento?.tipoDeConsulta || "Não Informado"}
                            </Text>
                        </View>
                    </View>
                    <View style={styles.linhaInformacoes}>
                        <View style={styles.campo}>
                            <Text style={styles.label}>Subspecialidade:</Text>
                            <Text style={styles.valor}>
                                {encaminhamento?.categoria || "Não Informado"}
                            </Text>
                        </View>
                        <View style={styles.campo}>
                            {/* Consulta ou retorno */}
                            <Text style={styles.label}>Situação:</Text>
                            <Text style={styles.valor}>
                                {encaminhamento?.situacao}
                            </Text>
                        </View>
                    </View>
                </View>

                <View style={styles.containerAssinatura}>
                    <View style={styles.containerContrareferencia}>
                        <Text style={styles.containerContrareferenciaLabel}>Informacoes de Contrarreferencia:</Text>
                        <View style={styles.linhaContrareferencia} />
                        <View style={styles.linhaContrareferencia} />
                        <View style={styles.linhaContrareferencia} />
                        <View style={styles.linhaContrareferencia} />
                        <View style={styles.linhaContrareferencia} />
                        <View style={styles.linhaContrareferencia} />
                        <View style={styles.linhaContrareferencia} />
                        <View style={styles.linhaContrareferencia} />
                    </View>
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
                </View>
                <View style={styles.linhaInformacoes}>
                    <View style={styles.profissionalResponsavelPelaReferencia}>
                        <Text style={{ width: "90%", borderBottomWidth: 1, borderColor: '#000', borderBottomStyle: 'solid', paddingTop: 55, marginBottom: 4 }} />
                        <Text style={{ justifyContent: "center", fontSize: 9, display: 'flex', justifySelf: 'center', alignItems: 'center' }}>
                            Profissional responsavel pela referência
                        </Text>
                        <Text style={{ justifyContent: "center", fontSize: 9, display: 'flex', justifySelf: 'center', alignItems: 'center' }}>
                            {encaminhamento?.medicoSolicitante?.nome}
                        </Text>
                        <Text style={{ justifyContent: "center", fontSize: 9, display: 'flex', justifySelf: 'center', alignItems: 'center' }}>
                            {"CRM/PR 123456"}
                        </Text>
                    </View>
                    <View style={styles.responsavelContraReferencia}>
                        <Text style={{ width: "90%", borderBottomWidth: 1, borderColor: '#000', borderBottomStyle: 'solid', paddingTop: 55, marginBottom: 4 }} />
                        <Text style={{ justifyContent: "center", fontSize: 9, display: 'flex', justifySelf: 'center', alignItems: 'center', textAlign: 'center' }}>
                            Profissional responsavel pela contra referência - Inscrição no Conselho Regional
                        </Text>
                    </View>
                </View>
            </Page>
        </Document>
    )
}
