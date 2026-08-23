import { Atendimento } from "@/app/generated/prisma/client";
import { useEffect, useState } from "react";

export function useAtendimentos() {
    const [atendimentos, setAtendimentos] = useState<Atendimento[]>([]);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState<string | null>(null);

    const buscarAtendimentos = async () => {
        try {
            setLoading(true);
            setErro(null);

            const response = await fetch("/api/atendimento");

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.erro || "Erro ao buscar atendimentos."
                );
            }

            setAtendimentos(data);
        } catch (error) {
            console.error(error);

            setErro(
                error instanceof Error
                    ? error.message
                    : "Erro ao buscar atendimentos."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        buscarAtendimentos();
    }, []);

    return {
        atendimentos,
        loading,
        erro,
        buscarAtendimentos,
    };
}