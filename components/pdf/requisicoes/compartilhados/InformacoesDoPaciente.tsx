import {
    StyleSheet,
    Text,
    View
} from "@react-pdf/renderer"

const styles = StyleSheet.create({
    container: {
        width: "100%",
        padding: 8,
        borderWidth: 1,
        borderColor: "#000000",
        borderStyle: "solid",
        display: 'flex',
        flexDirection: 'column',
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

interface InformacoesPacienteProps {
    encaminhamento: any
}

export default function InformacoesPaciente({
    encaminhamento
}: InformacoesPacienteProps) {
    return (
        <View style={styles.container}>
            <Text style={styles.titulo}>
                Informações do Paciente
            </Text>

            <View style={styles.linha} />

            {/* Zero linha de informações */}
            <View style={styles.linhaInformacoes}>
                <View style={styles.campo}>
                    <Text style={styles.label}>Data de Entrada:</Text>
                    <Text style={styles.valor}>
                        {encaminhamento?.paciente?.dataDeNascimento
                            ? new Date(encaminhamento?.dataDeEntrada).toISOString().slice(0, 10).split("-").reverse().join("/")
                            : ""}
                    </Text>
                </View>
                <View style={styles.campo}>
                    <Text style={styles.label}>Data de Cadastro:</Text>
                    <Text style={styles.valor}>
                        {encaminhamento?.paciente?.dataDeNascimento
                            ? new Date(encaminhamento?.paciente.criadoEm).toISOString().slice(0, 10).split("-").reverse().join("/")
                            : ""}
                    </Text>
                </View>
                <View style={styles.campo}>
                    <Text style={styles.label}>Naturalidade:</Text>
                    <Text style={styles.valor}>
                        {encaminhamento?.paciente.municipioDeNascimento || ""}
                    </Text>
                </View>
            </View>
            
            {/* Primeira linha de informações */}
            <View style={styles.linhaInformacoes}>
                <View style={styles.campo}>
                    <Text style={styles.label}>Unidade de atendimento do paciente:</Text>
                    <Text style={styles.valor}>
                        {encaminhamento?.unidadeDeOrigem.nome || ""}
                    </Text>
                </View>
                <View style={styles.campo}>
                    <Text style={styles.label}>Prontuário IDS:</Text>
                    <Text style={styles.valor}>
                        {encaminhamento?.paciente.codigoIDS || ""}
                    </Text>
                </View>
            </View>

            {/* Segunda linha de informações */}
            <View style={styles.linhaInformacoes}>
                <View style={styles.campo}>
                    <Text style={styles.label}>Nome:</Text>
                    <Text style={styles.valor}>
                        {encaminhamento?.paciente.nomeDoPaciente || ""}
                    </Text>
                </View>
                <View style={styles.campo}>
                    <Text style={styles.label}>Sexo:</Text>
                    <Text style={styles.valor}>
                        {encaminhamento?.paciente.sexo.toLowerCase() || ""}
                    </Text>
                </View>
                <View style={styles.campo}>
                    <Text style={styles.label}>Data de Nascimento:</Text>
                    <Text style={styles.valor}>
                        {encaminhamento?.paciente?.dataDeNascimento
                            ? new Date(encaminhamento.paciente.dataDeNascimento).toISOString().slice(0, 10).split("-").reverse().join("/")
                            : ""}
                    </Text>
                </View>
            </View>

            {/* Terceira linha de informações */}
            <View style={styles.linhaInformacoes}>
                <View style={styles.campo}>
                    <Text style={styles.label}>RG:</Text>
                    <Text style={styles.valor}>
                        {encaminhamento?.paciente.RG || ""}
                    </Text>
                </View>
                <View style={styles.campo}>
                    <Text style={styles.label}>CPF:</Text>
                    <Text style={styles.valor}>
                        {encaminhamento?.paciente.CPF || ""}
                    </Text>
                </View>
                <View style={styles.campo}>
                    <Text style={styles.label}>Cartão do SUS:</Text>
                    <Text style={styles.valor}>
                        {encaminhamento?.paciente?.cartaoDoSus}
                    </Text>
                </View>
            </View>
            {/* Quarta linha de informações */}
            <View style={styles.linhaInformacoes}>
                <View style={styles.campo}>
                    <Text style={styles.label}>Idade:</Text>
                    <Text style={styles.valor}>
                        {encaminhamento?.paciente.RG || ""}
                    </Text>
                </View>
                <View style={styles.campo}>
                    <Text style={styles.label}>Peso:</Text>
                    <Text style={styles.valor}>
                        {encaminhamento?.paciente.CPF || ""}
                    </Text>
                </View>
                <View style={styles.campo}>
                    <Text style={styles.label}>Altura:</Text>
                    <Text style={styles.valor}>
                        {encaminhamento?.paciente.CPF || ""}
                    </Text>
                </View>
                <View style={styles.campo}>
                    <Text style={styles.label}>Cor:</Text>
                    <Text style={styles.valor}>
                        {encaminhamento?.paciente.corERaca || ""}
                    </Text>
                </View>
            </View>
            {/* Quinta linha de informações */}
            <View style={styles.linhaInformacoes}>
                <View style={styles.campo}>
                    <Text style={styles.label}>Idade:</Text>
                    <Text style={styles.valor}>
                        {`${encaminhamento?.paciente.rua}, Nº:${encaminhamento?.paciente.numero} - ${encaminhamento?.paciente.bairro} - Joaquim Távora, ${encaminhamento.paciente.CEP}` || ""}
                    </Text>
                </View>
                <View style={styles.campo}>
                    <Text style={styles.label}>Emissão:</Text>
                    <Text style={styles.valor}>
                        {new Date().toLocaleDateString("pt-br")}
                    </Text>
                </View>
            </View>
            {/* Sexta linha de informações */}
            <View style={styles.linhaInformacoes}>
                <View style={styles.campo}>
                    <Text style={styles.label}>Nome da Mãe:</Text>
                    <Text style={styles.valor}>
                        {encaminhamento?.paciente.nomeDaMae || ""}
                    </Text>
                </View>
                <View style={styles.campo}>
                    <Text style={styles.label}>Nome do Pai:</Text>
                    <Text style={styles.valor}>
                        {encaminhamento?.paciente.nomeDoPai?.split(" ")[0] || "Não informado"}
                    </Text>
                </View>
                <View style={styles.campo}>
                    <Text style={styles.label}>Agente Comunitário:</Text>
                    <Text style={styles.valor}>
                        {encaminhamento?.paciente.nomeDoPai.split(" ")[0] || ""}
                    </Text>
                </View>
            </View>
        </View>
    )
}