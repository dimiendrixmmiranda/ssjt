
"use client"

import { Prisma } from "@/generated/prisma/browser";
import { useEffect, useState } from "react";

type AgendamentoComRelacoes = Prisma.AgendamentoDePrestadorGetPayload<{
    include: {
        prestador: {
            include: {
                especialidades: {
                    include: {
                        especialidade: true;
                    };
                };
                procedimentos: {
                    include: {
                        procedimento: true;
                    };
                };
            };
        };
        unidadeDeAtendimento: true;
    };
}>;

export function useAgendamentoDePrestadores() {
    const [agendamentoDePrestadores, setAgendamentoDePrestadores] =
        useState<AgendamentoComRelacoes[]>([]);

    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState("");

    async function buscarAgendamentoDePrestadores() {
        try {
            setCarregando(true);
            setErro("");

            const resposta = await fetch("/api/criar-agendamento-de-prestadores");

            if (!resposta.ok) {
                throw new Error("Não foi possível buscar os agendamentos.");
            }

            const dados: AgendamentoComRelacoes[] = await resposta.json();

            setAgendamentoDePrestadores(dados);
        } catch (erro) {
            setErro(
                erro instanceof Error
                    ? erro.message
                    : "Erro ao buscar agendamentos."
            );
        } finally {
            setCarregando(false);
        }
    }

    useEffect(() => {
        buscarAgendamentoDePrestadores();
    }, []);

    return {
        agendamentoDePrestadores,
        carregando,
        erro,
        buscarAgendamentoDePrestadores,
    };
}
