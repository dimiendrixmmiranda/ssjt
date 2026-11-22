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
        flexDirection: "column",
        justifyContent: "space-between",
        marginBottom: 8,
        display: 'flex',
        gap: '8'
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
    },
})

interface DadosClinicosProps {
    encaminhamento: any
}

export default function DadosClinicos({
    encaminhamento
}: DadosClinicosProps) {
    return (
        <View style={styles.container}>
            <Text style={styles.titulo}>
                Dados Clínicos
            </Text>

            <View style={styles.linha} />

            {/* Zero linha de informações */}
            <View style={styles.linhaInformacoes}>
                <View style={styles.campo}>
                    <Text style={styles.label}>CID:</Text>
                    <Text style={styles.valor}>
                        {
                            "m255 - Dor Articular"
                        }
                    </Text>
                </View>
                <View style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2'
                }}>
                    <Text style={styles.label}>Investigação/Diagnostico:</Text>
                    <Text style={styles.valor}>
                        {
                            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ornare nunc neque, non commodo lorem finibus eu. Pellentesque finibus sem sit amet quam dignissim, sed pulvinar nibh laoreet. Phasellus tortor urna, posuere vitae finibus ut, commodo a magna. Nunc sed elit massa. Integer tincidunt congue elit et malesuada. Suspendisse dictum pharetra quam, nec cursus sem congue nec."
                        }
                    </Text>
                </View>
            </View>
        </View>
    )
}