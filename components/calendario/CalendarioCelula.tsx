import { DiaCalendario } from "@/interface/Calendario";
import { EventoCalendario } from "./Calendario";

interface Props {
	dia: DiaCalendario;
	eventos: EventoCalendario[];
	dataSelecionada: Date | null;
	onSelecionarData: (data: Date) => void;
}
export default function CalendarioCelula({ dia, eventos, dataSelecionada, onSelecionarData }: Props) {
	const isSelecionado =
		dataSelecionada &&
		dia.data.getDate() === dataSelecionada.getDate() &&
		dia.data.getMonth() === dataSelecionada.getMonth() &&
		dia.data.getFullYear() === dataSelecionada.getFullYear();

	return (
		<div
			onClick={() => onSelecionarData(dia.data)}
			className={`
				relative
				border
				h-16
				w-16
				p-1
				transition
				cursor-pointer
				${isSelecionado
							? "bg-blue-300 text-white text-shadow-[1px_1px_2px_black]"
							: "hover:bg-blue-200"
						}
				${!dia.isMesAtual && !isSelecionado
							? "bg-zinc-300 text-zinc-400"
							: ""
						}
			`}
		>
			<div
				className={`
					w-8
					h-8
					rounded-full
					flex
					items-center
					justify-center
					font-medium
					${dia.isHoje && "bg-blue-600 text-white"}
				`}
			>
				{dia.dia}
			</div>

			{/* Indicadores de eventos */}
			{eventos.length > 0 && (
				<div className="absolute top-1 right-[2px] grid grid-cols-3 gap-[2px] max-w-[30px]">
					{eventos.map((evento, index) => (
						<div
							key={index}
							className="w-2 h-2 rounded-full border border-zinc-400"
							style={{ backgroundColor: evento.cor }}
							title={evento.profissional}
						/>
					))}
				</div>
			)}
		</div>
	);
}