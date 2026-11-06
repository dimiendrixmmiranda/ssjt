export interface EventoCalendario {
    id: string;
    titulo: string;
    tipo: "medico" | "laboratorio";
}

export interface DiaCalendario {
    data: Date;
    dia: number;
    isHoje: boolean;
    isMesAtual: boolean;
}