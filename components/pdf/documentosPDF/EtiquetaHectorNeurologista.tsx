
import {
    Document,
    Page,
    StyleSheet,
    Text,
    View,
    Image,
} from "@react-pdf/renderer"

interface PreparoEtiquetaHectorNeurologistaProps {
    local: string
    data: string,
    hora: string,
    quantidade: number
}

const ETIQUETAS_POR_FOLHA = 4
const COLUNAS = 1
const LINHAS = 4

const styles = StyleSheet.create({
    page: {
        paddingTop: 4,
        paddingBottom: 4,
        paddingHorizontal: 0,
        backgroundColor: "#FFFFFF",
        fontFamily: "Helvetica",
    },

    linha: {
        flexDirection: "row",
        justifyContent: "center",
        height: 190,
        marginBottom: 0,
    },

    etiqueta: {
        width: "100%",
        height: 180,
        paddingTop: 14,
        paddingLeft: 14,
        paddingRight: 12,
        paddingBottom: 8,
        position: "relative",
        marginTop: 0,
    },

    etiquetaVazia: {
        width: "80%",
        height: 190,
    },

    titulo: {
        fontSize: 12,
        marginBottom: 11,
        fontWeight: "bold",
    },

    local: {
        fontSize: 12,
        fontWeight: "bold",
        marginBottom: 10,
        maxWidth: "82%",
        marginLeft: 40
    },

    logo: {
        position: "absolute",
        width: 50,
        height: 70,
        right: 8,
        top: 7,
        objectFit: "contain",
    },

    orientacao: {
        display: 'flex',
        gap: 2,
        flexDirection: "row",
        marginTop: 12,
    },

    marcador: {
        fontSize: 12,
        fontWeight: "bold",
        lineHeight: 1.1,
    },

    textoOrientacao: {
        fontSize: 12,
        lineHeight: 1.12,
        fontWeight: "bold",
        maxWidth: '80%'
    },

    containerTitulo: {
        display: "flex",
        flexDirection: 'row',
        alignItems: 'center',
        gap: 2,
        marginLeft: 60,
    },

    atencao: {
        fontSize: 12,
        marginBottom: 11,
        marginLeft: 90,
        display: 'flex',
        flexDirection: 'row',
        fontWeight: "bold",
    },

    texto: {
        fontSize: 12,
        marginBottom: 11,
        fontWeight: "bold",
    },

    containerTexto: {
        display: "flex",
        flexDirection: 'column',
        gap: 2,
        marginTop: 15
    },
    dataEHora: {
        fontSize: 12,
        marginBottom: 11,
        fontWeight: "bold",
        marginTop: 15,
        marginLeft: 40
    },
    containerLevarExames: {
        display: "flex",
        flexDirection: 'row',
        alignItems: 'center',
        gap: 2,
        marginTop: 10
    }
})

function Etiqueta({
    local,
    data,
    hora,
}: {
    local: string
    data: string
    hora: string
}) {
    const desativarHifenizacao = (palavra: string) => [palavra]
    return (
        <View style={styles.etiqueta} wrap={false}>
            <View style={styles.containerTitulo}>
                <Image
                    src="/check.png"
                    style={{
                        width: 10,
                        height: 10,
                        marginTop: -10,
                    }}
                />
                <Text style={styles.titulo}>
                    GASTROENTEROLOGISTA - DR ANTONELY
                </Text>
            </View>
            <Text style={styles.local}>
                Local: {local.toUpperCase()} - JOAQUIM TÁVORA - PR
            </Text>
            <Text style={styles.dataEHora}>
                DATA: {data} AS {hora}H
            </Text>
            <View style={styles.containerTexto}>
                <Text style={styles.atencao}>
                    ATENÇÃO!
                </Text>
                <Text style={styles.texto}>
                    SE NÃO PUDER COMPARECER NA CONSULTA, POR FAVOR AVISE COM ATECEDÊNCIA.
                </Text>
                <Text style={styles.texto}>
                    A CONSULTA QUE VOCÊ FALTA, FAZ FALTA PARA ALGUÉM!
                </Text>
                <Text style={styles.texto}>
                    PERMITIDO SOMENTE UM ACOMPANHANTE NA SALA DE CONSULTA!
                </Text>
                <View style={styles.containerLevarExames}>
                    <Image
                        src="/arrow.png"
                        style={{
                            width: 10,
                            height: 10,
                            marginTop: -10,
                        }}
                    />
                    <Text style={styles.texto}>
                        LEVAR EXAMES SE TIVER, E SE SOLICITADOS.
                    </Text>
                </View>
            </View>
        </View>
    )
}

export default function EtiquetaHectorNeurologista({
    local,
    data,
    hora,
    quantidade,
}: PreparoEtiquetaHectorNeurologistaProps) {
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
                            (_, linhaIndex) => (
                                <View
                                    key={linhaIndex}
                                    style={styles.linha}
                                >
                                    {Array.from({
                                        length: COLUNAS,
                                    }).map((_, colunaIndex) => {
                                        const indice =
                                            paginaIndex * ETIQUETAS_POR_FOLHA +
                                            linhaIndex * COLUNAS +
                                            colunaIndex

                                        if (indice >= total) {
                                            return (
                                                <View
                                                    key={colunaIndex}
                                                    style={styles.etiquetaVazia}
                                                />
                                            )
                                        }

                                        return (
                                            <Etiqueta
                                                key={colunaIndex}
                                                local={local || "SELECIONE"}
                                                data={data}
                                                hora={hora}
                                            />
                                        )
                                    })}
                                </View>
                            )
                        )}
                    </Page>
                )
            )}
        </Document>
    )
}
