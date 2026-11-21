
import {
    Image,
    StyleSheet,
    Text,
    View,
    Font
} from "@react-pdf/renderer"

Font.registerHyphenationCallback((word) => [word])

const styles = StyleSheet.create({
    container: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#000",
        position: "relative",
    },

    brasao: {
        position: "absolute",
        left: 0,
        top: 0,
        width: 65,
        height: 65,
        objectFit: "contain",
    },

    informacoes: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 70,
    },

    estado: {
        fontSize: 10,
        fontWeight: "bold",
        textTransform: "uppercase",
    },

    municipio: {
        fontSize: 12,
        fontWeight: "bold",
        marginTop: 2,
        textTransform: "uppercase",
    },

    secretaria: {
        fontSize: 9,
        marginTop: 2,
    },

    titulo: {
        fontSize: 13,
        fontWeight: "bold",
        marginTop: 9,
        textAlign: "center",
    },

    aviso: {
        position: "absolute",
        right: 0,
        top: 0,
        width: 95,
        height: 65,
        border: "solid 1px black",
        padding: 5,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 2,
        borderColor: "#000000",
        borderStyle: "solid",
    },
})

interface CabecalhoInstitucionalProps {
    titulo: string
}

export default function CabecalhoInstitucional({
    titulo
}: CabecalhoInstitucionalProps) {
    return (
        <View style={styles.container}>
            <Image
                src="/logo-prefeitura.png"
                style={styles.brasao}
            />

            <View style={styles.informacoes}>
                <Text style={styles.estado}>
                    Estado do Paraná
                </Text>

                <Text style={styles.municipio}>
                    Município de Joaquim Távora
                </Text>

                <Text style={styles.secretaria}>
                    Secretaria Municipal de Saúde
                </Text>

                <Text style={styles.titulo}>
                    {titulo}
                </Text>
            </View>
            <View style={styles.aviso}>
                <Text style={{ fontSize: 12, textAlign: "center", fontWeight: "bold" }}>
                    ATENÇÃO!
                </Text>
                <Text style={{ fontSize: 8, textAlign: "center", marginTop: 3 }}>
                    Apresente esta requisição na recepção para realizar o agendamento!
                </Text>
            </View>
        </View>
    )
}
