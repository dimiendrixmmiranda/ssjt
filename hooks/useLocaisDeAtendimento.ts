"use client";

import { Local } from "@/app/generated/prisma/client";
import { useEffect, useState } from "react";

export function useLocaisDeAtendimento() {
    const [locais, setLocais] = useState<Local[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const buscarLocais = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch("/api/localDeAtendimento");

            if (!response.ok) {
                throw new Error("Erro ao buscar locais");
            }

            const data: Local[] = await response.json();

            setLocais(data);

        } catch (error) {
            console.error("Erro ao buscar locais:", error);

            setError(
                "Não foi possível carregar os locais."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        buscarLocais();
    }, []);

    return {
        locais,
        loading,
        error,
        buscarLocais,
    };
}