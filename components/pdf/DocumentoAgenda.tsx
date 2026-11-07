
import {
    Document,
    Page,
    Text,
    View,
    StyleSheet,
} from "@react-pdf/renderer"

import { CabecalhoPDF } from "./CabecalhoPDF"

const estilos = StyleSheet.create({
    pagina: {
        padding: 30,
        fontSize: 10,
        fontFamily: "Helvetica",
    },

    secao: {
        marginTop: 10,
        padding: 10,
        backgroundColor: "#f0f0f0",
    },

    texto: {
        fontSize: 10,
    },
})

import { TabelaAgenda, LinhaAgendaPDF } from "./TabelaAgenda"
import { RodapePDF } from "./RodapePDF"

interface DocumentoAgendaProps {
    nomeUnidade: string
    dataDeInicio: Date
    dataDeFim: Date
    agendamentos: LinhaAgendaPDF[]
}
export function DocumentoAgenda({
    nomeUnidade,
    dataDeInicio,
    dataDeFim,
    agendamentos,
}: DocumentoAgendaProps) {
    const dataGeracao = new Date().toLocaleString("pt-BR")
    return (
        <Document>
            <Page
                size="A4"
                orientation="landscape"
                style={estilos.pagina}
            >
                <CabecalhoPDF />

                <View style={estilos.secao}>
                    <Text style={estilos.texto}>
                        Unidade de Atendimento: {nomeUnidade}
                    </Text>

                    <Text style={estilos.texto}>
                        Período: {dataDeInicio.toLocaleDateString("pt-BR")} até{" "}
                        {dataDeFim.toLocaleDateString("pt-BR")}
                    </Text>
                </View>

                <TabelaAgenda agendamentos={agendamentos} />

                <RodapePDF dataGeracao={dataGeracao} />
            </Page>
        </Document>
    )
}
