const diasSemana = [
	"Seg",
	"Ter",
	"Qua",
	"Qui",
	"Sex",
	"Sáb",
	"Dom",
];

export default function CalendarioSemana() {
	return (
		<div className="grid grid-cols-7 w-fit">
			{diasSemana.map((dia) => (
				<div
					key={dia}
					className={`py-3 text-center font-semibold text-white w-16 bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 border border-cinza ${dia == 'Sáb' ? 'bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700': ''} ${dia == 'Dom' ? 'bg-gradient-to-br from-red-500 via-red-600 to-red-700': ''}`}
				>
					{dia}
				</div>
			))}
		</div>
	);
}