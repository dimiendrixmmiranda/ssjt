"use client";

import {
    Especialidade,
    Medico,
} from "@/app/generated/prisma/client";
import { useEffect, useState } from "react";

type MedicoComEspecialidade = Medico & {
    especialidade: Especialidade;
};

export function useMedicos() {
    const [medicos, setMedicos] = useState<MedicoComEspecialidade[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const buscarMedicos = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch("/api/medicos");

            if (!response.ok) {
                throw new Error("Erro ao buscar médicos");
            }

            const data: MedicoComEspecialidade[] = await response.json();

            setMedicos(data);
        } catch (error) {
            console.error("Erro ao buscar médicos:", error);
            setError("Não foi possível carregar os médicos.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        buscarMedicos();
    }, []);

    return {
        medicos,
        loading,
        error,
        buscarMedicos,
    };
}