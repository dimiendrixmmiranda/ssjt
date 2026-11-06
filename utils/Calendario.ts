import {
    eachDayOfInterval,
    endOfMonth,
    endOfWeek,
    isSameMonth,
    isToday,
    startOfMonth,
    startOfWeek,
} from "date-fns";

import { DiaCalendario } from "@/interface/Calendario";

export function gerarDiasCalendario(data: Date): DiaCalendario[] {
    const inicio = startOfWeek(startOfMonth(data), {
        weekStartsOn: 1,
    });

    const fim = endOfWeek(endOfMonth(data), {
        weekStartsOn: 1,
    });

    return eachDayOfInterval({ start: inicio, end: fim }).map((dia) => ({
        data: dia,
        dia: dia.getDate(),
        isHoje: isToday(dia),
        isMesAtual: isSameMonth(dia, data),
    }));
}