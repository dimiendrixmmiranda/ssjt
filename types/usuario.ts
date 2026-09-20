import { Prisma } from "@/app/generated/prisma/client";

export type UsuarioLogado = Prisma.UsuarioGetPayload<{
    select: {
        id: true;
        nome: true;
        email: true;
        perfil: true;
        imagem: true;
        dataDeNascimento: true;
        unidadeDeOrigem: true,
        unidadeDeOrigemId: true,
        ativo: true;
        createdAt: true;
        updatedAt: true;
    };
}>;