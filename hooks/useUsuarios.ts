import { useCallback, useEffect, useState } from "react";
export interface Usuario {
    id: string;
    nome: string;
    email: string;
    role: "SUPER_ADMIN" | "ADMIN" | "ESTAGIARIO";
    ativo: boolean;
    createdAt: string;
}

export function useUsuarios(usuarioAtualId?: string) {
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
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