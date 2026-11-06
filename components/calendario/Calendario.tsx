"use client";

import CalendarioSemana from "./CalendarioSemana";
import CalendarioGrid from "./CalendarioGrid";
import CalendarioCabecalho from "./CalendarioCabecalho";
import useCalendario from "@/hooks/useCalendario";

export interface EventoCalendario {
    data: string;
    cor: string;
    profissional: string;
}

interface CalendarioProps {
    eventos: EventoCalendario[];
    dataSelecionada: Date | null;
    onSelecionarData: (data: Date) => void;
}

export default function Calendario({
    eventos,
    dataSelecionada,
    onSelecionarData,
}: CalendarioProps) {

	const calendario = useCalendario(dataSelecionada)

	return (
		<div className="bg-white rounded-xl shadow-sm border overflow-hidden w-fit">
			<CalendarioCabecalho {...calendario} />
			<CalendarioSemana />
			<CalendarioGrid
				dias={calendario.dias}
				eventos={eventos}
				onSelecionarData={onSelecionarData}
				dataSelecionada={dataSelecionada}
			/>
		</div>
	);
}