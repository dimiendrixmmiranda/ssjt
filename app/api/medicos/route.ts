import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const medicos = await prisma.medico.findMany({
      orderBy: {
        nome: "asc",
      },
    });

    return NextResponse.json(medicos);
  } catch (error) {
    console.error("Erro ao buscar médicos:", error);

    return NextResponse.json(
      { error: "Erro ao buscar médicos" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      nome,
      crm,
      especialidadeId,
      ativo,
      descricao,
    } = body;

    if (!nome || !crm || !especialidadeId) {
      return NextResponse.json(
        {
          error: "Nome, CRM e especialidade são obrigatórios",
        },
        { status: 400 }
      );
    }

    const medicoExistente = await prisma.medico.findUnique({
      where: {
        crm,
      },
    });

    if (medicoExistente) {
      return NextResponse.json(
        {
          error: "Já existe um médico cadastrado com esse CRM",
        },
        { status: 409 }
      );
    }

    const medico = await prisma.medico.create({
      data: {
        nome,
        crm,
        especialidadeId,
        ativo: ativo ?? true,
        descricao: descricao || null,
      },
    });

    return NextResponse.json(medico, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar médico:", error);

    return NextResponse.json(
      { error: "Erro ao cadastrar médico" },
      { status: 500 }
    );
  }
}