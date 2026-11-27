
import {
    Document,
    Page,
    StyleSheet,
    Text,
    View,
    Image,
} from "@react-pdf/renderer"

interface SolicitacaoDeRetornoProps {
    nomePaciente: string
    dataDeNascimento: string
    endereco: string
    telefone: string
    especialidade: string
    medico: string
    local: string
    opcaoDeRetorno: string
    dataEmissao: string
}

const styles = StyleSheet.create({
    page: {
        padding: 30,
        backgroundColor: "#FFFFFF",
        fontFamily: "Helvetica",
        position: "relative"
    },

    topo: {
        alignItems: "center",
        marginTop: 15,
        marginBottom: 20
    },

    logo: {
        width: 65,
        height: 65,
        objectFit: "contain",
    },

    titulo: {
        fontSize: 20,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 25,
    },

    campo: {
        flexDirection: "row",
        marginBottom: 8,
        paddingBottom: 7,
    },

    rotulo: {
        fontSize: 16,
        fontWeight: "bold",
        width: 175,
    },

    valor: {
        fontSize: 16,
        flex: 1,
        textTransform: 'capitalize'
    },

    observacao: {
        marginTop: 15,
        padding: 12,
        borderWidth: 0.7,
        borderColor: "#BBBBBB",
        minHeight: 75,
    },

    tituloObservacao: {
        fontSize: 10,
        fontWeight: "bold",
        marginBottom: 12,
    },

    dataEmissao: {
        fontSize: 10,
        textAlign: "right",
        marginBottom: 22,
    },
    imagem: {
        position: "absolute",
        top: 20,
        left: 20
    }
})

function Campo({
    nome,
    valor,
}: {
    nome: string
    valor: string
}) {
    return (
        <View style={styles.campo}>
            <Text style={styles.rotulo}>{nome}:</Text>
            <Text style={styles.valor}>{valor || "Não informado"}</Text>
        </View>
    )
}

function formatarData(data: string) {
    if (!data) return ""

    const partes = data.split("-")

    return partes.length === 3
        ? `${partes[2]}/${partes[1]}/${partes[0]}`
        : data
}

export default function SolicitacaoDeRetorno({
    nomePaciente,
    dataDeNascimento,
    endereco,
    telefone,
    especialidade,
    medico,
    local,
    opcaoDeRetorno,
    dataEmissao
}: SolicitacaoDeRetornoProps) {

    return (
        <Document>
            <Page size="A4" orientation="portrait" style={styles.page}>
                <View style={styles.imagem}>
                    <Image
                        src="/logo-prefeitura.png"
                        style={styles.logo}
                    />
                </View>
                <View style={styles.topo}>
                    <Text style={styles.titulo}>
                        SOLICITAÇÃO DE RETORNO
                    </Text>
                </View>

                <Campo
                    nome="Nome do paciente"
                    valor={nomePaciente}
                />

                <Campo
                    nome="Data de nascimento"
                    valor={formatarData(dataDeNascimento)}
                />

                <Campo
                    nome="Endereço"
                    valor={endereco}
                />

                <Campo
                    nome="Telefone"
                    valor={telefone}
                />

                <Campo
                    nome="Especialidade"
                    valor={especialidade}
                />

                <Campo
                    nome="Médico"
                    valor={medico}
                />

                <Campo
                    nome="Opção de retorno"
                    valor={opcaoDeRetorno.replaceAll('_', ' ').toLowerCase()}
                />

                <Text style={styles.dataEmissao}>
                    Data de emissão: {dataEmissao}
                </Text>

            </Page>
        </Document>
    )
}
