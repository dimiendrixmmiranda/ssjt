"use client";

import {
    Procedimento,
    ProcedimentoFilho,
} from "@/app/generated/prisma/client";
import { useEffect, useState } from "react";

type ProcedimentoComFilhas = Procedimento & {
    filhas: ProcedimentoFilho[];
};

export function useProcedimentos() {
    const [procedimentos, setProcedimentos] = useState<ProcedimentoComFilhas[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const buscarProcedimentos = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch("/api/procedimento");

            if (!response.ok) {
                throw new Error("Erro ao buscar procedimentos");
            }

            const data: ProcedimentoComFilhas[] = await response.json();

            setProcedimentos(data);
        } catch (error) {
            console.error("Erro ao buscar procedimentos:", error);
            setError("Não foi possível carregar os procedimentos.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        buscarProcedimentos();
    }, []);

    return {
        procedimentos,
        loading,
        error,
        buscarProcedimentos,
    };
}