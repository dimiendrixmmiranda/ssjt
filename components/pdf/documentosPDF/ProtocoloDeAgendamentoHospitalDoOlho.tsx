
import {
    Document,
    Page,
    StyleSheet,
    Text,
    View,
} from "@react-pdf/renderer"

interface ProtocoloHospitalDoOlhoProps {
    quantidade: number
    nomeDoPaciente: string
    dataDeNascimentoDoPaciente: string
    dataDeAgendamento: string
    horaDoAgendamento: string
    enderecoDoPaciente: string
    agenteComunitario: string
}

const ETIQUETAS_POR_FOLHA = 4
const LINHAS = 4

const styles = StyleSheet.create({
    page: {
        paddingTop: 12,
        paddingBottom: 12,
        paddingHorizontal: 20,
        backgroundColor: "#FFFFFF",
        fontFamily: "Helvetica",
    },

    linha: {
        flexDirection: "row",
        justifyContent: "center",
        height: 190,
        marginBottom: 8,
    },

    etiqueta: {
        width: "100%",
        height: 200,
        paddingVertical: 10,
        paddingHorizontal: 14,
        position: "relative",
    },

    etiquetaVazia: {
        width: "100%",
        height: 180,
    },

    titulo: {
        fontSize: 18,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 9,
        textDecoration: "underline",
    },

    local: {
        fontSize: 16,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 24,
        marginTop: 16
    },

    campo: {
        flexDirection: "row",
        marginBottom: 14,
        alignItems: "flex-start",
    },

    rotulo: {
        fontSize: 14,
        fontWeight: "bold",
    },

    valor: {
        fontSize: 14,
        flexGrow: 1,
    },

    agendamento: {
        fontSize: 14,
        fontWeight: "bold",
        textAlign: "center",
        marginTop: 16,
        marginBottom: 7,
    },

    aviso: {
        fontSize: 14,
        fontWeight: "bold",
        textAlign: "center",
        marginTop: 30,
        textDecoration: "underline",
    },

    rodape: {
        fontSize: 14,
        textAlign: "center",
        marginTop: 5,
    },
})

function Etiqueta({
    nomeDoPaciente,
    dataDeNascimentoDoPaciente,
    dataDeAgendamento,
    horaDoAgendamento,
    enderecoDoPaciente,
    agenteComunitario,
}: Omit<ProtocoloHospitalDoOlhoProps, "quantidade">) {

    const desativarHifenizacao = (palavra: string) => [palavra]

    return (
        <View style={styles.etiqueta} wrap={false}>

            <Text style={styles.titulo}>
                PROTOCOLO DE AGENDAMENTO
            </Text>

            <Text style={styles.local}>
                LOCAL: HOSPITAL DOS OLHOS DE JACAREZINHO – PR
            </Text>

            <View style={styles.campo}>
                <Text style={styles.rotulo}>PACIENTE: </Text>
                <Text
                    style={styles.valor}
                    hyphenationCallback={desativarHifenizacao}
                >
                    {nomeDoPaciente || "NÃO INFORMADO"}
                </Text>
            </View>

            <View style={styles.campo}>
                <Text style={styles.rotulo}>DN: </Text>
                <Text style={styles.valor}>
                    {dataDeNascimentoDoPaciente || "NÃO INFORMADA"}
                </Text>
            </View>

            <View style={styles.campo}>
                <Text style={styles.rotulo}>ENDEREÇO: </Text>
                <Text
                    style={styles.valor}
                    hyphenationCallback={desativarHifenizacao}
                >
                    {enderecoDoPaciente || "NÃO INFORMADO"}
                </Text>
            </View>

            <View style={styles.campo}>
                <Text style={styles.rotulo}>AGENTE COMUNITÁRIO: </Text>
                <Text
                    style={styles.valor}
                    hyphenationCallback={desativarHifenizacao}
                >
                    {agenteComunitario || "NÃO INFORMADO"}
                </Text>
            </View>

            <Text style={styles.agendamento}>
                MARCADO PARA {dataDeAgendamento || "DATA NÃO INFORMADA"}
                {" "}ÀS {horaDoAgendamento || "HORÁRIO NÃO INFORMADO"}
                {"\n"}
                VIA WHATSAPP
            </Text>

            <Text style={styles.aviso}>
                LEVAR DOCUMENTOS PESSOAIS!
            </Text>

        </View>
    )
}

export default function ProtocoloHospitalDoOlho({
    quantidade,
    nomeDoPaciente,
    dataDeNascimentoDoPaciente,
    dataDeAgendamento,
    horaDoAgendamento,
    enderecoDoPaciente,
    agenteComunitario,
}: ProtocoloHospitalDoOlhoProps) {

    const total = Math.max(0, Math.floor(quantidade))

    const quantidadeDeFolhas = Math.ceil(
        total / ETIQUETAS_POR_FOLHA
    )

    return (
        <Document>
            {Array.from({ length: quantidadeDeFolhas }).map(
                (_, paginaIndex) => (
                    <Page
                        key={paginaIndex}
                        size="A4"
                        orientation="portrait"
                        style={styles.page}
                    >
                        {Array.from({ length: LINHAS }).map(
                            (_, linhaIndex) => {

                                const indice =
                                    paginaIndex * ETIQUETAS_POR_FOLHA +
                                    linhaIndex

                                if (indice >= total) {
                                    return (
                                        <View
                                            key={linhaIndex}
                                            style={styles.etiquetaVazia}
                                        />
                                    )
                                }

                                return (
                                    <View
                                        key={linhaIndex}
                                        style={styles.linha}
                                    >
                                        <Etiqueta
                                            nomeDoPaciente={nomeDoPaciente}
                                            dataDeNascimentoDoPaciente={dataDeNascimentoDoPaciente}
                                            dataDeAgendamento={dataDeAgendamento}
                                            horaDoAgendamento={horaDoAgendamento}
                                            enderecoDoPaciente={enderecoDoPaciente}
                                            agenteComunitario={agenteComunitario}
                                        />
                                    </View>
                                )
                            }
                        )}
                    </Page>
                )
            )}
        </Document>
    )
}
