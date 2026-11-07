
import {
    View,
    Text,
    StyleSheet,
} from "@react-pdf/renderer"

export interface LinhaAgendaPDF {
    data: string
    profissional: string
    especialidade: string
    procedimento: string
    periodo: string
    sala: string
    observacoes: string
}

interface TabelaAgendaProps {
    agendamentos: LinhaAgendaPDF[]
}

const estilos = StyleSheet.create({
    tabela: {
        width: "100%",
        marginTop: 20,
    },
    linha: {
        flexDirection: "row",
        borderBottomWidth: 1,
        borderBottomColor: "#dddddd",
        alignItems: "center",
        minHeight: 30,
    },
    cabecalho: {
        backgroundColor: "#07994C",
        borderBottomWidth: 0,
    },
    celula: {
        padding: 7,
        fontSize: 8,
    },
    textoCabecalho: {
        color: "#ffffff",
        fontWeight: "bold",
    },
    data: {
        width: "10%",
    },
    profissional: {
        width: "20%",
    },
    especialidade: {
        width: "17%",
    },
    periodo: {
        width: "13%",
    },
    sala: {
        width: "10%",
    },
    observacoes: {
        width: "30%",
    },
    vazio: {
        padding: 15,
        fontSize: 9,
        textAlign: "center",
        color: "#666666",
    },
})

export function TabelaAgenda({
    agendamentos,
}: TabelaAgendaProps) {
    console.log(agendamentos)
    return (
        <View style={estilos.tabela}>
            <View style={[estilos.linha, estilos.cabecalho]}>
                <Text style={[estilos.celula, estilos.data, estilos.textoCabecalho]}>
                    Data
                </Text>

                <Text style={[estilos.celula, estilos.profissional, estilos.textoCabecalho]}>
                    Profissional
                </Text>

                <Text style={[estilos.celula, estilos.especialidade, estilos.textoCabecalho]}>
                    Especialidade/Procedimento
                </Text>

                <Text style={[estilos.celula, estilos.periodo, estilos.textoCabecalho]}>
                    Período
                </Text>

                <Text style={[estilos.celula, estilos.sala, estilos.textoCabecalho]}>
                    Sala
                </Text>

                <Text style={[estilos.celula, estilos.observacoes, estilos.textoCabecalho]}>
                    Observações
                </Text>
            </View>

            {agendamentos.length > 0 ? (
                agendamentos.map((agendamento, index) => (
                    <View
                        key={index}
                        style={estilos.linha}
                        wrap={false}
                    >
                        <Text style={[estilos.celula, estilos.data]}>
                            {agendamento.data}
                        </Text>

                        <Text style={[estilos.celula, estilos.profissional]}>
                            {agendamento.profissional}
                        </Text>

                        <Text style={[estilos.celula, estilos.especialidade]}>
                            {agendamento.especialidade ?? ''} {agendamento.procedimento ?? ''}
                        </Text>

                        <Text style={[estilos.celula, estilos.periodo]}>
                            {agendamento.periodo}
                        </Text>

                        <Text style={[estilos.celula, estilos.sala]}>
                            {agendamento.sala}
                        </Text>

                        <Text style={[estilos.celula, estilos.observacoes]}>
                            {agendamento.observacoes || "-"}
                        </Text>
                    </View>
                ))
            ) : (
                <Text style={estilos.vazio}>
                    Nenhum agendamento encontrado para o período selecionado.
                </Text>
            )}
        </View>
    )
}
