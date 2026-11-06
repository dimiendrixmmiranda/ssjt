import CalendarioCelula from "./CalendarioCelula";
import { EventoCalendario } from "./Calendario";
import { DiaCalendario } from "@/interface/Calendario";

interface Props {
	dias: DiaCalendario[];
	eventos: EventoCalendario[];
	dataSelecionada: Date | null;
	onSelecionarData: (data: Date) => void;
}

export default function CalendarioGrid({ dias, eventos, dataSelecionada, onSelecionarData }: Props) {
	return (
		<div className="grid grid-cols-7 w-fit">
			{dias.map((dia) => {
				const eventosDoDia = eventos.filter((evento) => {
					const dataDia = [
						dia.data.getFullYear(),
						String(dia.data.getMonth() + 1).padStart(2, "0"),
						String(dia.data.getDate()).padStart(2, "0"),
					].join("-");

					return evento.data === dataDia;
				})

				return (
					<CalendarioCelula
						key={dia.data.toISOString()}
						dia={dia}
						eventos={eventosDoDia}
						onSelecionarData={onSelecionarData}
						dataSelecionada={dataSelecionada}
					/>
				);
			})}
		</div>
	);
}