import { PrismaClient } from "@/app/generated/prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
    const senhaHash = await bcrypt.hash("123456", 10);

    const administrador = await prisma.usuario.upsert({
        where: {
            email: "admin@ssjt.com",
        },
        update: {},
        create: {
            nome: "Administrador",
            email: "admin@ssjt.com",
            senha: senhaHash,
            perfil: "ADMINISTRADOR",
            dataDeNascimento: new Date("1990-01-01"),
            ativo: true,
        },
    });

    console.log("Administrador criado:", administrador.email);
}

main()
    .catch((error) => {
        console.error(error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });