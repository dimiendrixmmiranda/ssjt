import { useCallback, useEffect, useState } from "react";
import { Prestador } from "@/app/generated/prisma/client";

export function usePrestadores() {
    const [prestadores, setPrestadores] = useState<Prestador[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const buscarPrestadores = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch("/api/prestador");

            if (!response.ok) {
                throw new Error("Erro ao buscar prestadores");
            }

            const data: Prestador[] = await response.json();

            setPrestadores(data);
        } catch (error) {
            console.error("Erro ao buscar prestadores:", error);
            setError("Erro ao buscar prestadores");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        buscarPrestadores();
    }, [buscarPrestadores]);

    return {
        prestadores,
        loading,
        error,
        buscarPrestadores,
    };
}