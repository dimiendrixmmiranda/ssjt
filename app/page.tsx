'use client'

import InputEmail from "@/components/assets/inputEmail"
import InputSenha from "@/components/assets/inputSenha"
import Image from "next/image"
import { FormEvent, useEffect, useState } from "react";
import { CiLock } from "react-icons/ci"
import { MdOutlineEmail } from "react-icons/md"
import { signIn, useSession } from "next-auth/react";
import { Vortex } from "@/components/ui/vortex";

export default function Home() {
	const [email, setEmail] = useState("");
	const [senha, setSenha] = useState("");
	const [erro, setErro] = useState("");

	const { data: session, status } = useSession();

	useEffect(() => {
		if (status !== "authenticated") {
			return;
		}

		if (session.user.role === "SUPER_ADMIN") {
			window.location.href = "/super-admin";
			return;
		}

		if (session.user.role === "ADMIN") {
			window.location.href = "/admin";
		}
	}, [session, status]);

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();


		setErro("");

		const resultado = await signIn("credentials", {
			email,
			senha,
			redirect: false,
		});

		if (resultado?.error) {
			setErro("E-mail ou senha inválidos.");
			return;
		}
	}

	return (
		<div className="w-screen h-screen overflow-hidden flex justify-center items-center font-arimo">
			<Vortex
				backgroundColor="#ffffff"
				particleColor="#156B3A"
				particleCount={1500}
				rangeY={400}
				baseSpeed={0.1}
				rangeSpeed={1}
				baseRadius={2}
				rangeRadius={1}
				className="absolute inset-0"
			/>
			<div className="w-full h-full absolute top-0 left-0 z-20">
				<div className="fixed top-1/2 -left-[200px] opacity-40 -translate-y-1/2">
					<div className="relative w-[500px] h-[800px]">
						<Image
							alt="Logo do SSJT"
							src="/logo/brasao.png"
							fill
							className="object-contain"
						/>
					</div>
				</div>

				<div className="fixed top-1/2 -right-[200px] opacity-40 -translate-y-1/2">
					<div className="relative w-[500px] h-[800px]">
						<Image
							alt="Logo do SSJT"
							src="/logo/brasao.png"
							fill
							className="object-contain"
						/>
					</div>
				</div>
				<div className="absolute top-[50%] left-[50%]" style={{transform: 'translate(-50%,-50%'}}>
					<form onSubmit={handleSubmit} className="w-[450px] p-4 rounded-xl bg-white shadow-[0px_0px_6px_0.5px_#999] opacity-100 z-20 flex flex-col gap-2 2xl:w-[600px] 2xl:px-8 2xl:-mt-8">
						<div className="relative w-full h-[240px] 2xl:h-[350px]">
							<Image alt="Logo do ssjt" src={'/logo/logo-sistema.png'} fill className="object-contain" />
						</div>
						<div className="flex flex-col justify-center items-center">
							<h3 className="text-2xl text-center font-semibold">Acesse sua conta</h3>
							<span>Informe seu email e sua senha para continuar.</span>
						</div>
						<div className="flex flex-col gap-2">
							<InputEmail id="email" label="Email" nome="email" valor={email} setValor={setEmail} icone={<MdOutlineEmail />} placeholder="seuemail@email.com" />
							<InputSenha id="senha" label="Senha" nome="senha" valor={senha} setValor={setSenha} icone={<CiLock />} placeholder="*********" />
						</div>
						<div className="flex flex-col gap-2 mt-3">
							<button className="bg-verde w-full py-2 text-white text-lg rounded-lg" type="submit">Entrar</button>
							<div className="flex items-center gap-3">
								<div className="w-full h-[1px] bg-zinc-500"></div>
								<p>ou</p>
								<div className="w-full h-[1px] bg-zinc-500"></div>
							</div>
							<button className="text-verde font-bold text-center flex justify-center items-center w-full">
								<p>Esqueci minha senha</p>
							</button>
						</div>
					</form>
				</div>

				<div className="w-full font-oswald fixed bottom-0 bg-verde-escuro text-white grid grid-cols-[auto_1fr_auto]">
					<div className="flex flex-col p-2">
						<h4 className="text-sm font-bold">Sistema de Saúde de Joaquim Távora - PR</h4>
						<span className="text-xs">Gestão de atendimentos e agendamentos</span>
					</div>
					<span className="text-sm flex justify-center items-center py-1">© 2026 Prefeitura Municipal de Joaquim Távora - PR — Todos os direitos reservados.</span>
					<div className="flex flex-col justify-end text-xs p-2">
						<span className="text-end">Versão 1.1.0</span>
						<p>Desenvolvido por Dimi E. M. Miranda</p>
					</div>
				</div>
			</div>
		</div>
	)
}
