"use client";

import InputEmail from "@/components/assets/inputEmail";
import InputSenha from "@/components/assets/inputSenha";
import Image from "next/image";
import { FormEvent, useEffect, useState } from "react";
import { CiLock } from "react-icons/ci";
import { MdOutlineEmail } from "react-icons/md";
import { signIn, useSession } from "next-auth/react";
import { Vortex } from "@/components/ui/vortex";
import { IoShieldCheckmark } from "react-icons/io5";

export default function Home() {
	const [email, setEmail] = useState("");
	const [senha, setSenha] = useState("");
	const [erro, setErro] = useState("");

	const { data: session, status } = useSession();

	useEffect(() => {
		if (status !== "authenticated") return;

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
		}
	}

	return (
		<div className="w-screen h-screen overflow-hidden flex flex-col font-arimo">
			<header className="w-full p-2 flex items-center border-b-4 border-verde-escuro z-30">
				<div className="relative w-[50px] h-[60px]">
					<Image
						alt="Logo do SSJT"
						src="/logo/brasao.png"
						fill
						className="object-contain"
					/>
				</div>
				<div className="relative w-[200px] h-[60px]">
					<Image
						alt="Sistema de Saúde"
						src="/logo/sistema-de-saude.png"
						fill
						className="object-contain"
					/>
				</div>
				<div className="w-[2px] h-[60px] bg-verde-escuro mx-6" />
				<div className="max-w-[350px] leading-5">
					<span>
						Sistema oficial para gestão de atendimentos e
						agendamentos de{" "}
						<b className="text-verde">
							saúde municipal
						</b>
					</span>
				</div>
				<div className="flex justify-center items-center gap-2 max-w-[230px] ml-auto text-verde-escuro">
					<IoShieldCheckmark className="text-6xl" />

					<p className="leading-5">
						Acesso exclusivo para funcionários autorizados
					</p>
				</div>
			</header>
			
			<main className="relative flex-1 overflow-hidden">
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
				<div className="fixed top-1/2 -left-[200px] opacity-40 -translate-y-1/2">
					<div className="relative w-[500px] h-[650px]">
						<Image
							alt=""
							src="/logo/brasao.png"
							fill
							className="object-contain"
						/>
					</div>
				</div>
				<div className="fixed top-1/2 -right-[200px] opacity-40 -translate-y-1/2">
					<div className="relative w-[500px] h-[650px]">
						<Image
							alt=""
							src="/logo/brasao.png"
							fill
							className="object-contain"
						/>
					</div>
				</div>
				<div className="absolute inset-0 flex justify-center items-center z-[999] 2xl:mt-6">
					<form
						onSubmit={handleSubmit}
						className="
                            w-[450px]
                            p-4
                            rounded-xl
                            bg-white
                            shadow-[0px_0px_6px_0.5px_var(--verde-escuro)]
                            flex flex-col gap-2
                            2xl:w-[500px]
                            2xl:px-8
                            2xl:-mt-8
                        "
					>
						<div className="relative w-full h-[240px]">
							<Image
								alt="Logo do SSJT"
								src="/logo/logo-sistema.png"
								fill
								className="object-contain"
							/>
						</div>
						<div className="flex flex-col justify-center items-center">
							<h3 className="text-2xl text-center font-semibold">
								Acesse sua conta
							</h3>
							<span>
								Informe seu email e sua senha para continuar.
							</span>
						</div>
						<div className="flex flex-col gap-2">
							<InputEmail
								id="email"
								label="Email"
								nome="email"
								valor={email}
								setValor={setEmail}
								icone={<MdOutlineEmail />}
								placeholder="seuemail@email.com"
							/>
							<InputSenha
								id="senha"
								label="Senha"
								nome="senha"
								valor={senha}
								setValor={setSenha}
								icone={<CiLock />}
								placeholder="*********"
							/>
						</div>
						{erro && (
							<span className="text-red-500 text-sm">
								{erro}
							</span>
						)}
						<div className="flex flex-col gap-2 mt-3">
							<button
								className="bg-verde w-full py-2 text-white text-lg rounded-lg"
								type="submit"
							>
								Entrar
							</button>
							<div className="flex items-center gap-3">
								<div className="w-full h-[1px] bg-zinc-500" />
								<p>ou</p>
								<div className="w-full h-[1px] bg-zinc-500" />
							</div>
							<button
								type="button"
								className="text-verde font-bold text-center flex justify-center items-center w-full"
							>
								Esqueci minha senha
							</button>
						</div>
					</form>
				</div>
			</main>

			<footer className="w-full font-oswald bg-verde-escuro text-white grid grid-cols-[auto_1fr_auto] p-1 px-2 border-t-4 border-verde-escuro">
				<div className="flex items-center justify-center">
					<div className="relative w-8 h-10">
						<Image alt="logo do sistema" src={'/logo/brasao.png'} fill className="object-contain" />
					</div>
					<div className="flex flex-col p-2">
						<h4 className="text-sm font-bold">
							Sistema de Saúde de Joaquim Távora - PR
						</h4>
						<span className="text-xs">
							Gestão de atendimentos e agendamentos
						</span>
					</div>
				</div>
				<span className="text-sm flex justify-center items-center py-1 max-w-[280px] mx-auto text-center">
					© 2026 Prefeitura Municipal de Joaquim Távora - PR
					Todos os direitos reservados.
				</span>
				<div className="flex flex-col justify-end text-xs p-2">
					<span className="text-end">
						Versão 1.1.0
					</span>
					<p>
						Desenvolvido por Dimi E. M. Miranda
					</p>
				</div>
			</footer>
		</div>
	);
}