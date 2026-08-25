import { Usuario } from "@/app/generated/prisma/client";
import { useCallback, useEffect, useState } from "react";

type UsuarioComLocal = {
    id: string;
    nome: string;
    email: string;
    role: Usuario["role"];
    ativo: boolean;
    createdAt: Date | string;

    localId: string | null;

    local: {
        id: string;
        nome: string;
        tipoDoLocal: string;
        status: string;
        cidade: string;
    } | null;
};

export function useUsuarios(usuarioAtualId?: string) {
    const [usuarios, setUsuarios] = useState<UsuarioComLocal[]>([]);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState("");

    const buscarUsuarios = useCallback(async () => {
        try {
            setLoading(true);
            setErro("");

            const url = usuarioAtualId
                ? `/api/usuarios?usuarioAtualId=${usuarioAtualId}`
                : "/api/usuarios";

            const response = await fetch(url);

            const data = await response.json();

            console.log("USUARIOS DA API:", data);

            if (!response.ok) {
                throw new Error(
                    data.erro || "Erro ao buscar usuários."
                );
            }

            setUsuarios(data);

        } catch (error) {
            console.error("Erro ao buscar usuários:", error);

            setErro(
                error instanceof Error
                    ? error.message
                    : "Erro ao buscar usuários."
            );

        } finally {
            setLoading(false);
        }
    }, [usuarioAtualId]);

    useEffect(() => {
        buscarUsuarios();
    }, [buscarUsuarios]);

    return {
        usuarios,
        loading,
        erro,
        buscarUsuarios,
    };
}