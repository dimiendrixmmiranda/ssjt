"use client";

import { useEffect, useMemo, useState } from "react";
import {
    addMonths,
    subMonths,
    isValid,
} from "date-fns";

import { gerarDiasCalendario } from "@/utils/Calendario";

export default function useCalendario(dataSelecionada: Date | null) {
    const [dataAtual, setDataAtual] = useState<Date>(new Date());

    useEffect(() => {
        if (dataSelecionada && isValid(dataSelecionada)) {
            setDataAtual(dataSelecionada);
        } else {
            setDataAtual(new Date());
        }
    }, [dataSelecionada]);

    // Proteção adicional contra datas inválidas
    const dataAtualValida = isValid(dataAtual)
        ? dataAtual
        : new Date();

    const dias = useMemo(
        () => gerarDiasCalendario(dataAtualValida),
        [dataAtualValida]
    );

    function proximoMes() {
        setDataAtual((data) =>
            addMonths(isValid(data) ? data : new Date(), 1)
        );
    }

    function mesAnterior() {
        setDataAtual((data) =>
            subMonths(isValid(data) ? data : new Date(), 1)
        );
    }

    function irParaHoje() {
        setDataAtual(new Date());
    }

    function irParaData(data: Date) {
        if (isValid(data)) {
            setDataAtual(data);
        }
    }

    return {
        dataAtual: dataAtualValida,
        dias,
        proximoMes,
        mesAnterior,
        irParaHoje,
        irParaData,
    };
}