
import {
    Document,
    Page,
    StyleSheet,
    Text,
    View,
    Image,
} from "@react-pdf/renderer"

interface PreparoDraJessikaProps {
    local: string
    quantidade: number
}

const ETIQUETAS_POR_FOLHA = 4
const COLUNAS = 1
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
        width: "75%",
        height: 180,
        borderWidth: 0.8,
        borderColor: "#222222",
        paddingTop: 10,
        paddingLeft: 14,
        paddingRight: 12,
        paddingBottom: 8,
        position: "relative",
    },

    etiquetaVazia: {
        width: "80%",
        height: 190,
    },

    titulo: {
        fontSize: 12,
        textDecoration: "underline",
        marginBottom: 11,
        fontWeight: "bold",
    },

    local: {
        fontSize: 15,
        fontWeight: "bold",
        fontStyle: "italic",
        textDecoration: "underline",
        marginBottom: 10,
        maxWidth: "82%",
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
        fontSize: 10,
        fontWeight: "bold",
        lineHeight: 1.1,
    },

    textoOrientacao: {
        fontSize: 14,
        lineHeight: 1.12,
        fontWeight: "bold",
        maxWidth: '80%'
    }
})

function Etiqueta({
    local,
}: {
    local: string
}) {
    const desativarHifenizacao = (palavra: string) => [palavra]
    return (
        <View style={styles.etiqueta} wrap={false}>
            <Text style={styles.titulo}>
                Psiquiatria - Dra Jéssika
            </Text>

            <Image
                src="/logo-psiquiatria.png"
                style={styles.logo}
            />

            <Text style={styles.local}>
                Local: {local.toUpperCase()}
            </Text>

            <View style={styles.orientacao}>
                <Image
                    src="/seta.png"
                    style={{
                        width: 12,
                        height: 12,
                        marginRight: 4,
                        marginTop: 2,
                    }}
                />
                <Text style={styles.textoOrientacao} hyphenationCallback={desativarHifenizacao}>
                    PACIENTE TRAZER ACOMPANHANTE NA PRIMEIRA CONSULTA.
                </Text>
            </View>

            <View style={styles.orientacao}>
                <Image
                    src="/seta.png"
                    style={{
                        width: 10,
                        height: 10,
                        marginRight: 4,
                        marginTop: 2,
                    }}
                />
                <Text style={styles.textoOrientacao} hyphenationCallback={desativarHifenizacao}>
                    SE O PACIENTE NÃO PRECISAR OU NÃO PUDER COMPARECER
                    POR FAVOR AVISAR
                </Text>
            </View>
        </View>
    )
}

export default function PreparoDraJessika({
    local,
    quantidade,
}: PreparoDraJessikaProps) {
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
