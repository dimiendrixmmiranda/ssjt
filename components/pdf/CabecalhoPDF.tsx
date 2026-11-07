
import {
    Image,
    Text,
    View,
    StyleSheet,
} from "@react-pdf/renderer"

const estilos = StyleSheet.create({
    cabecalho: {
        flexDirection: "row",
        alignItems: "center",
        paddingBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: "#07994C",
        marginBottom: 20,
    },

    logo: {
        width: 65,
        height: 65,
        objectFit: "contain",
        marginRight: 15,
    },

    informacoes: {
        flex: 1,
    },

    titulo: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#00522c",
    },

    subtitulo: {
        fontSize: 10,
        color: "#555555",
        marginTop: 4,
    },

    identificacao: {
        fontSize: 11,
        fontWeight: "bold",
        color: "#333333",
        marginTop: 8,
    },
})

export function CabecalhoPDF() {
    return (
        <View style={estilos.cabecalho}>
            <Image
                src="/logo/brasao-sistema-de-saude.png"
                style={estilos.logo}
            />

            <View style={estilos.informacoes}>
                <Text style={estilos.titulo}>
                    SISTEMA DE SAÚDE DE JOAQUIM TÁVORA
                </Text>

                <Text style={estilos.subtitulo}>
                    Prefeitura Municipal de Joaquim Távora - PR
                </Text>

                <Text style={estilos.identificacao}>
                    RELATÓRIO DE AGENDA MÉDICA
                </Text>
            </View>
        </View>
    )
}
