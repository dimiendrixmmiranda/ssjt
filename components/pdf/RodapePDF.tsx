
import { Text, View, StyleSheet } from "@react-pdf/renderer"

interface RodapePDFProps {
    dataGeracao: string
}

const estilos = StyleSheet.create({
    rodape: {
        position: "absolute",
        bottom: 20,
        left: 30,
        right: 30,
        borderTopWidth: 1,
        borderTopColor: "#D1D5DB",
        paddingTop: 8,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    texto: {
        fontSize: 8,
        color: "#6B7280",
    },
    pagina: {
        fontSize: 8,
        color: "#6B7280",
        textAlign: "right",
    },
})

export function RodapePDF({ dataGeracao }: RodapePDFProps) {
    return (
        <View style={estilos.rodape} fixed>
            <Text style={estilos.texto}>
                Sistema de Saúde de Joaquim Távora (SSJT)
            </Text>

            <Text style={estilos.texto}>
                Gerado em: {dataGeracao}
            </Text>

            <Text
                style={estilos.pagina}
                render={({ pageNumber, totalPages }) =>
                    `Página ${pageNumber} de ${totalPages}`
                }
            />
        </View>
    )
}
