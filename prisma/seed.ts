import "dotenv/config";
import bcrypt from "bcrypt";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../app/generated/prisma/client";

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
    adapter,
});

async function main() {
    const email = "admin@ssjt.com";
    const senha = "123456";

    const usuarioExistente = await prisma.usuario.findUnique({
        where: {
            email,
        },
    });

    if (usuarioExistente) {
        console.log("SUPER_ADMIN já existe.");
        return;
    }

    const senhaHash = await bcrypt.hash(senha, 10);

    const usuario = await prisma.usuario.create({
        data: {
            nome: "Administrador",
            email,
            senha: senhaHash,
            role: "SUPER_ADMIN",
            ativo: true,
        },
    });

    console.log("SUPER_ADMIN criado com sucesso!");
    console.log(`ID: ${usuario.id}`);
    console.log(`E-mail: ${usuario.email}`);
}

main()
    .catch((error) => {
        console.error("Erro ao criar SUPER_ADMIN:", error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });