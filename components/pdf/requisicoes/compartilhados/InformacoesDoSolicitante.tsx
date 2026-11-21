import {
    StyleSheet,
    Text,
    View
} from "@react-pdf/renderer"

const styles = StyleSheet.create({
    container: {
        width: "100%",
        borderWidth: 1,
        borderColor: "#000000",
        borderStyle: "solid",
        padding: 8, 
        marginTop: 10
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
    linhaInformacoes: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 4,
        display: "flex",
        alignItems: "center"
    },
    campo: {
        flexDirection: "row",
        alignItems: "flex-end",
    },
    label: {
        fontSize: 9,
        fontWeight: "bold",
    },
    valor: {
        textTransform: "capitalize",
        fontSize: 9,
        marginLeft: 4,
    },
})

interface InformacoesDoSolicitanteProps {
    encaminhamento: any
}

export default function InformacoesDoSolicitante({
    encaminhamento
}: InformacoesDoSolicitanteProps) {
    console.log(encaminhamento)
    return (
        <View style={styles.container}>
            <Text style={styles.titulo}>
                Informações do Solicitante
            </Text>

            <View style={styles.linha} />

            {/* Primeira linha de informações */}
            <View style={styles.linhaInformacoes}>
                <View style={styles.campo}>
                    <Text style={styles.label}>Medico Solicitante:</Text>
                    <Text style={styles.valor}>
                        {encaminhamento?.medicoSolicitante?.nome || ""}
                    </Text>
                </View>
                <View style={styles.campo}>
                    <Text style={styles.label}>Especialidade:</Text>
                    <Text style={styles.valor}>
                        {encaminhamento?.especialidadeDoPrestador?.nome || ""}
                    </Text>
                </View>
                <View style={styles.campo}>
                    <Text style={styles.label}>CNS:</Text>
                    <Text style={styles.valor}>
                        {"1234567"}
                    </Text>
                </View>
                <View style={styles.campo}>
                    <Text style={styles.label}>Telefone:</Text>
                    <Text style={styles.valor}>
                        {encaminhamento?.unidadeDeOrigem?.telefone1 || ""}
                    </Text>
                </View>
            </View>

            {/* Primeira linha de informações */}
            <View style={styles.linhaInformacoes}>
                <View style={styles.campo}>
                    <Text style={styles.label}>Nome da Unidade:</Text>
                    <Text style={styles.valor}>
                        {encaminhamento?.unidadeDeOrigem?.nome || ""}
                    </Text>
                </View>
                <View style={styles.campo}>
                    <Text style={styles.label}>Endereço:</Text>
                    <Text style={styles.valor}>
                        {`${encaminhamento?.unidadeDeOrigem.rua}, ${encaminhamento?.unidadeDeOrigem.numero} - ${encaminhamento?.unidadeDeOrigem.bairro} - ${encaminhamento?.unidadeDeOrigem.complemento ? `(${encaminhamento?.unidadeDeOrigem.rua})` : ""}` || ""}
                    </Text>
                </View>
            </View>
        </View>
    )
}