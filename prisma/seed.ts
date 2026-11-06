import { PrismaClient } from "../generated/prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { hash } from "bcryptjs";
import { config } from "dotenv";

config({ path: ".env.local" });

const adapter = new PrismaNeon({
    connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

async function main() {
    const nome = process.env.SSJT_ADMIN_NAME;
    const email = process.env.SSJT_ADMIN_EMAIL?.trim().toLowerCase();
    const senha = process.env.SSJT_ADMIN_PASSWORD;

    if (!nome || !email || !senha) {
        throw new Error("Informe nome, e-mail e senha do administrador.");
    }

    if (senha.length < 8) {
        throw new Error("A senha precisa ter pelo menos 12 caracteres.");
    }

    const existente = await prisma.usuario.findUnique({
        where: { email },
    });

    if (existente) {
        throw new Error("Já existe um usuário cadastrado com esse e-mail.");
    }

    await prisma.usuario.create({
        data: {
            nome,
            email,
            senhaHash: await hash(senha, 8),
            tipoDeConta: "SENIOR_ADMIN",
        },
    });

    console.log("Administrador Sênior criado com sucesso!");
}

main()
    .catch((error) => {
        console.error("Erro:", error.message);
        process.exitCode = 1;
    })
    .finally(async () => {
        await prisma.$disconnect();
    });