import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
	try {
		const prestadores = await prisma.prestador.findMany({
			orderBy: {
				nome: "asc",
			},
		});

		return NextResponse.json(prestadores);
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
			tipo,
			descricao,
		} = body;

		if (!nome || !crm || !especialidadeId || !tipo) {
			return NextResponse.json(
				{
					error: "Nome, CRM, especialidade e tipo de prestador são obrigatórios",
				},
				{ status: 400 }
			);
		}
		
		const prestadorExistente = await prisma.prestador.findUnique({
			where: {
				crm,
			},
		});

		if (prestadorExistente) {
			return NextResponse.json(
				{
					error: "Já existe um médico cadastrado com esse CRM",
				},
				{ status: 409 }
			);
		}

		const medico = await prisma.prestador.create({
			data: {
				nome,
				crm,
				tipo,
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