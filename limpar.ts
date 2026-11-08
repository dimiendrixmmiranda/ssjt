import { config } from "dotenv";
import { neon } from "@neondatabase/serverless";

config({ path: ".env.local" });

const sql = neon(process.env.DATABASE_URL!);

async function limparBanco() {
    await sql`DROP SCHEMA public CASCADE`;
    await sql`CREATE SCHEMA public`;

    console.log("Banco de dados limpo com sucesso!");
}

limparBanco();