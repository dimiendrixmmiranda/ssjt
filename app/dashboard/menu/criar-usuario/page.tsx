'use client'

import { TiUserAdd } from "react-icons/ti";
import Template from "../Template";
import InputTexto from "@/components/inputs/InputTexto";
import InputSelect from "@/components/inputs/InputSelect";
import { FormEvent, useState } from "react";
import { AiOutlineClear, AiOutlineUsergroupAdd } from "react-icons/ai";
import InputEmail from "@/components/inputs/InputEmail";
import { MdOutlineEmail, MdOutlineLocationCity } from "react-icons/md";
import InputData from "@/components/inputs/InputData";
import { BsCalendarDate } from "react-icons/bs";
import InputSenha from "@/components/inputs/InputSenha";
import { GiPadlock } from "react-icons/gi";
import { useLocais } from "@/hooks/useListaDeLocais";
import { opcoesDeLocais, opcoesDeTipoDeConta } from "@/constants/dados";
import { HiSaveAs } from "react-icons/hi";
import DialogPersonalizado from "@/components/dialog/DialogPersonalizado";
import { useUsuarios } from "@/hooks/useListaDeUsuarios";
import { FaList, FaRegTrashAlt } from "react-icons/fa";
import { Local, Usuario } from "@/generated/prisma/browser";
import { FiEdit } from "react-icons/fi";
import { Dialog } from "primereact/dialog";

export default function Page() {
    const { locais } = useLocais()
    const { usuarios, buscarUsuarios } = useUsuarios()

    console.log(usuarios)

    const [nomeDoUsuario, setNomeDoUsuario] = useState('')
    const [emailDoUsuario, setEmailDoUsuario] = useState('')
    const [dataDeNascimento, setDataDeNascimento] = useState('')
    const [senha, setSenha] = useState('')
    const [confirmarSenha, setConfirmarSenha] = useState('')
    const opcoesDeLocaisDeOrigem = opcoesDeLocais(locais)
    const [unidadeDeOrigem, setUnidadeDeOrigem] = useState<number | null>(null)
    const [tipoDeConta, setTipoDeConta] = useState('')

    const [carregando, setCarregando] = useState(false);

    // dialog
    const [dialogConfirmacao, setDialogConfirmacao] = useState(false);
    const [dialogResultado, setDialogResultado] = useState(false);
    const [tituloResultado, setTituloResultado] = useState("");
    const [mensagemResultado, setMensagemResultado] = useState("");

    const [usuarioAtual, setUsuarioAtual] = useState<Usuario | null>(null)

    // Inativar/reativar local 
    const [dialogAlterarStatus, setDialogAlterarStatus] = useState(false)
    const [usuarioParaAlterarStatus, setUsuarioParaAlterarStatus] = useState<Usuario | null>(null)

    const [dialogAtualizarUsuario, setDialogAtualizarUsuario] = useState(false)

    // filtros
    const [filtroPorNome, setFiltroPorNome] = useState('')
    const [filtroPorEmail, setFiltroPorEmail] = useState('')


    function limparFormulario() {
        setNomeDoUsuario("")
        setEmailDoUsuario("")
        setDataDeNascimento("")
        setSenha("")
        setConfirmarSenha("")
        setUnidadeDeOrigem(null)
        setTipoDeConta("")

    }

    function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setDialogConfirmacao(true);
    }

    function cancelarCadastro() {
        setDialogConfirmacao(false);

        setTituloResultado("Cadastro cancelado");
        setMensagemResultado("A operação foi cancelada. Nenhum local foi cadastrado.");

        setDialogResultado(true);
    }

    function abrirConfirmacaoStatus(usuario: Usuario) {
        setUsuarioParaAlterarStatus(usuario);
        setDialogAlterarStatus(true);
    }

    async function cadastrarUsuario() {
        if (
            !nomeDoUsuario.trim() ||
            !emailDoUsuario.trim() ||
            !tipoDeConta ||
            !senha ||
            !confirmarSenha
        ) {
            setTituloResultado("Campos obrigatórios");
            setMensagemResultado("Preencha todos os campos obrigatórios.");
            setDialogResultado(true);
            return;
        }

        if (senha !== confirmarSenha) {
            setTituloResultado("Senhas diferentes");
            setMensagemResultado("As senhas não coincidem.");
            setDialogResultado(true);
            return;
        }

        try {
            const resposta = await fetch("/api/criar-usuario", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    nome: nomeDoUsuario,
                    email: emailDoUsuario,
                    dataDeNascimento,
                    senha,
                    tipoDeConta,
                    unidadeDeOrigem,
                }),
            });

            const resultado = await resposta.json();

            if (!resposta.ok) {
                setTituloResultado("Erro ao cadastrar");
                setMensagemResultado(resultado.erro);
                setDialogResultado(true);
                return;
            }

            await buscarUsuarios()

            setTituloResultado("Cadastro realizado!");
            setMensagemResultado("O usuário foi cadastrado com sucesso.");
            setDialogResultado(true);

            limparFormulario();

        } catch (erro) {
            console.error("Erro ao cadastrar usuário:", erro);

            setTituloResultado("Erro");
            setMensagemResultado("Não foi possível cadastrar o usuário.");
            setDialogResultado(true);
        }
    }

    async function atualizarUsuario(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()

        if (!usuarioAtual) return

        if (
            !nomeDoUsuario.trim() ||
            !emailDoUsuario.trim() ||
            !tipoDeConta ||
            !senha ||
            !confirmarSenha
        ) {
            setTituloResultado("Campos obrigatórios")
            setMensagemResultado("Preencha todos os campos, inclusive a senha e a confirmação.")
            setDialogResultado(true)
            return
        }

        if (senha !== confirmarSenha) {
            setTituloResultado("Senhas diferentes")
            setMensagemResultado("As senhas não coincidem.")
            setDialogResultado(true)
            return
        }

        try {
            setCarregando(true)

            const resposta = await fetch(`/api/criar-usuario/${usuarioAtual.id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    nome: nomeDoUsuario,
                    email: emailDoUsuario,
                    dataDeNascimento,
                    senha,
                    confirmarSenha,
                    tipoDeConta,
                    unidadeDeOrigem,
                }),
            })

            const resultado = await resposta.json()

            if (!resposta.ok) {
                setTituloResultado("Erro ao atualizar")
                setMensagemResultado(resultado.erro || "Não foi possível atualizar o usuário.")
                setDialogResultado(true)
                return
            }

            setTituloResultado("Usuário atualizado!")
            setMensagemResultado("Os dados do usuário foram atualizados com sucesso.")
            setDialogResultado(true)

            setDialogAtualizarUsuario(false)
            setUsuarioAtual(null)
            limparFormulario()

            // Atualiza a listagem.
            await buscarUsuarios()

        } catch (erro) {
            console.error("Erro ao atualizar usuário:", erro)

            setTituloResultado("Erro")
            setMensagemResultado("Não foi possível atualizar o usuário.")
            setDialogResultado(true)

        } finally {
            setCarregando(false)
        }
    }

    async function alterarStatusUsuario() {
        if (!usuarioParaAlterarStatus) return

        try {
            setCarregando(true)

            const novoStatus = !usuarioParaAlterarStatus.ativo

            const resposta = await fetch(
                `/api/criar-usuario/${usuarioParaAlterarStatus.id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        ativo: novoStatus,
                    }),
                }
            )

            const dados = await resposta.json()

            if (!resposta.ok) {
                throw new Error(
                    dados.erro || "Não foi possível alterar o status."
                )
            }

            await buscarUsuarios()

            setTituloResultado("Status atualizado!")
            setMensagemResultado(
                `O usuário foi ${dados.ativo ? "ativado" : "inativado"} com sucesso.`
            )

        } catch (erro) {
            console.error("Erro ao alterar status:", erro)

            setTituloResultado("Erro ao atualizar status")
            setMensagemResultado(
                erro instanceof Error
                    ? erro.message
                    : "Ocorreu um erro inesperado."
            )

        } finally {
            setCarregando(false)
            setDialogAlterarStatus(false)
            setUsuarioParaAlterarStatus(null)
            setDialogResultado(true)
        }
    }

    return (
        <Template>
            <div className="text-verde-escuro flex flex-col gap-4 max-h-[100vh] overflow-y-scroll p-4">
                <div className="text-verde-escuro flex flex-col gap-4">
                    <div className="flex items-center gap-2">
                        <div className="font-bold text-5xl">
                            <TiUserAdd />
                        </div>
                        <div>
                            <h3 className="font-bold text-2xl">Criar Usuário</h3>
                            <p>Gerencie os usuários que tem acesso ao sistema.</p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-6 text-verde-escuro">
                    <form className="p-4 border-2 border-verde-escuro rounded-lg flex flex-col gap-4" onSubmit={handleSubmit}>
                        <div className="grid grid-cols-2 gap-4">
                            <InputTexto icone={<AiOutlineUsergroupAdd />} id="nomeDoUsuario" label="Nome do Usuário" nome="nomeDoUsuario" placeholder="Digite o nome do usuário..." setValor={setNomeDoUsuario} valor={nomeDoUsuario} />
                            <InputEmail icone={<MdOutlineEmail />} id="emailDoUsuario" label="Email do Usuário" nome="emailDoUsuario" placeholder="Digite o email do usuário..." setValor={setEmailDoUsuario} valor={emailDoUsuario} />
                            <InputData icone={<BsCalendarDate />} id="dataDeNascimento" label="Data de Nascimento" nome="dataDeNascimento" placeholder="Data de Nascimento" setValor={setDataDeNascimento} valor={dataDeNascimento} />
                            <InputSelect icone={<MdOutlineLocationCity />} id="unidadeDeOrigem" label="Selecione a unidade de origem" nome="unidadeDeOrigem" setValor={setUnidadeDeOrigem} valor={unidadeDeOrigem} opcoes={opcoesDeLocaisDeOrigem} />
                            <div className="grid grid-cols-2 gap-4">
                                <InputSenha icone={<GiPadlock />} id="senha" label="Informe uma senha" nome="senha" placeholder="Senha..." setValor={setSenha} valor={senha} />
                                <InputSenha icone={<GiPadlock />} id="confirmarSenha" label="Confirme sua senha" nome="confirmarSenha" placeholder="Confirmar Senha..." setValor={setConfirmarSenha} valor={confirmarSenha} />
                            </div>
                            <InputSelect icone={<MdOutlineLocationCity />} id="tipodDeConta" label="Selecione o tipo de conta" nome="tipoDeConta" setValor={setTipoDeConta} valor={tipoDeConta} opcoes={opcoesDeTipoDeConta} />

                        </div>

                        <div className="flex items-center gap-3 ml-auto">
                            <button
                                type="button"
                                onClick={() => {
                                    limparFormulario()
                                }}
                                className="flex items-center gap-2 font-bold rounded-lg border border-red-600 text-red-600 p-2 px-4 transition-all duration-300 cursor-pointer hover:text-white hover:bg-red-600"

                            >
                                <AiOutlineClear className="text-2xl" />
                                <p>Limpar</p>
                            </button>
                            <button
                                type="submit"
                                // disabled={carregando}
                                className="flex items-center gap-2 font-bold rounded-lg border border-verde p-2 px-4 transition-all duration-300 cursor-pointer hover:text-white hover:bg-verde"
                            >
                                <HiSaveAs className="text-2xl" />
                                <p>Salvar</p>
                            </button>
                        </div>
                    </form>

                    <div className="p-4 border-2 border-verde-escuro rounded-lg flex flex-col gap-4 min-w-0">
                        <div className="flex items-center gap-2 font-bold text-xl">
                            <FaList />
                            <h2>Usuários já cadastrados</h2>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col">
                                <label htmlFor="filtroPorNome">Buscar por nome do local:</label>
                                <input type="search" name="filtroPorNome" id="filtroPorNome" value={filtroPorNome} onChange={(e) => setFiltroPorNome(e.target.value)} className="shadow-[0px_0px_2px_1px_var(--verde-escuro)] p-2 rounded-lg text-lg transition-all duration-200 focus:outline-verde h-[35px]" />
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="filtroPorEmail">Buscar por Email:</label>
                                <input type="search" name="filtroPorEmail" id="filtroPorEmail" value={filtroPorEmail} onChange={(e) => setFiltroPorEmail(e.target.value)} className="shadow-[0px_0px_2px_1px_var(--verde-escuro)] p-2 rounded-lg text-lg transition-all duration-200 focus:outline-verde h-[35px]" />
                            </div>
                        </div>
                        <div className="w-full min-w-0 max-w-full overflow-x-auto">
                            <table className="w-[1500px] table-fixed border-collapse text-left">
                                <thead>
                                    <tr className="border-b-2 border-verde-escuro">
                                        <th className="w-[180px] p-2">Nome</th>
                                        <th className="w-[160px] p-2">Email</th>
                                        <th className="w-[100px] p-2">Data de Nascimento</th>
                                        <th className="w-[170px] p-2">Unidade de Origem</th>
                                        <th className="w-[100px] p-2">Tipo de Conta</th>
                                        <th className="w-[70px] p-2">Ações</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {usuarios.length > 0 ? (
                                        usuarios.map((usuario) => {
                                            const localDeOrigemDoUsuario = locais.find(local => local.id === usuario.localId)

                                            return (
                                                <tr key={usuario.id} className="border-b border-gray-300">
                                                    <td className="p-2 break-words">{usuario.nome}</td>
                                                    <td className="p-2 break-words">{usuario.email}</td>
                                                    <td className="p-2 break-words">{new Date(usuario.dataDeNascimento!).toDateString()}</td>
                                                    <td className="p-2 break-words">{localDeOrigemDoUsuario?.nome}</td>
                                                    <td className="p-2 break-words">{usuario.tipoDeConta}</td>
                                                    <td className="p-2 break-words grid grid-cols-2 gap-3 gap-y-1 mt-1">
                                                        <button
                                                            className="rounded-lg border h-6 w-11 mt-1 border-amber-600 flex justify-center items-center text-amber-600 cursor-pointer duration-300 transition-all hover:bg-amber-600 hover:text-white"
                                                            onClick={() => {
                                                                setUsuarioAtual(usuario)
                                                                setDialogAtualizarUsuario(true)

                                                                setNomeDoUsuario(usuario.nome)
                                                                setEmailDoUsuario(usuario.email)
                                                                setDataDeNascimento(
                                                                    usuario.dataDeNascimento
                                                                        ? new Date(usuario.dataDeNascimento).toISOString().slice(0, 10)
                                                                        : ""
                                                                )
                                                                setSenha("")
                                                                setConfirmarSenha("")
                                                                setTipoDeConta(usuario.tipoDeConta)
                                                            }}
                                                        >
                                                            <FiEdit />
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => abrirConfirmacaoStatus(usuario)}
                                                            className={`relative mt-1 inline-flex h-6 w-11 items-center rounded-full transition-colors ${usuario.ativo ? "bg-green-600" : "bg-gray-300"
                                                                }`}
                                                            aria-label={usuario.ativo ? "Inativar usuário" : "Reativar usuário"}
                                                        >
                                                            <span
                                                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${usuario.ativo ? "translate-x-6" : "translate-x-1"
                                                                    }`}
                                                            />
                                                        </button>
                                                        <button className="rounded-lg border h-6 w-11 mt-1 border-red-600 flex justify-center items-center text-red-600 cursor-pointer duration-300 transition-all hover:bg-amber-600 hover:text-white">
                                                            <FaRegTrashAlt />
                                                        </button>
                                                        <button className="rounded-lg border h-6 w-11 mt-1 border-red-600 flex justify-center items-center text-red-600 cursor-pointer duration-300 transition-all hover:bg-amber-600 hover:text-white">
                                                            <FaRegTrashAlt />
                                                        </button>
                                                    </td>
                                                </tr>
                                            )
                                        })
                                    ) : (
                                        <tr>
                                            <td colSpan={8} className="p-4 text-center">
                                                Sem locais cadastrados
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* Dialog Salvar usuario */}
            <DialogPersonalizado
                visivel={dialogConfirmacao}
                titulo="Confirmar cadastro"
                mensagem={`Deseja realmente cadastrar esse usuario "${nomeDoUsuario}"?`}
                textoConfirmar="Confirmar"
                textoCancelar="Cancelar"
                mostrarCancelar={true}
                aoConfirmar={cadastrarUsuario}
                aoCancelar={cancelarCadastro}
            />
            <DialogPersonalizado
                visivel={dialogResultado}
                titulo={tituloResultado}
                mensagem={mensagemResultado}
                textoConfirmar="Entendi"
                aoConfirmar={() => setDialogResultado(false)}
                aoCancelar={() => setDialogResultado(false)}
            />

            {/* Dialog atualizar um local */}
            <Dialog
                header="Atualizar Informações do Usuário"
                visible={dialogAtualizarUsuario}
                onHide={() => {
                    setDialogAtualizarUsuario(false)
                    setUsuarioAtual(null)
                    limparFormulario()
                }}
                className="w-full max-w-[90%] lg:max-w-[900px]"
            >
                <form className="p-4 border-2 border-verde-escuro rounded-lg flex flex-col gap-4" onSubmit={atualizarUsuario}>
                    <div className="grid grid-cols-2 gap-4">
                        <InputTexto icone={<AiOutlineUsergroupAdd />} id="nomeDoUsuario" label="Nome do Usuário" nome="nomeDoUsuario" placeholder="Digite o nome do usuário..." setValor={setNomeDoUsuario} valor={nomeDoUsuario} />
                        <InputEmail icone={<MdOutlineEmail />} id="emailDoUsuario" label="Email do Usuário" nome="emailDoUsuario" placeholder="Digite o email do usuário..." setValor={setEmailDoUsuario} valor={emailDoUsuario} />
                        <InputData icone={<BsCalendarDate />} id="dataDeNascimento" label="Data de Nascimento" nome="dataDeNascimento" placeholder="Data de Nascimento" setValor={setDataDeNascimento} valor={dataDeNascimento} />
                        <InputSelect icone={<MdOutlineLocationCity />} id="unidadeDeOrigem" label="Selecione a unidade de origem" nome="unidadeDeOrigem" setValor={setUnidadeDeOrigem} valor={unidadeDeOrigem} opcoes={opcoesDeLocaisDeOrigem} />
                        <div className="grid grid-cols-2 gap-4">
                            <InputSenha icone={<GiPadlock />} id="senha" label="Informe uma senha" nome="senha" placeholder="Senha..." setValor={setSenha} valor={senha} />
                            <InputSenha icone={<GiPadlock />} id="confirmarSenha" label="Confirme sua senha" nome="confirmarSenha" placeholder="Confirmar Senha..." setValor={setConfirmarSenha} valor={confirmarSenha} />
                        </div>
                        <InputSelect icone={<MdOutlineLocationCity />} id="tipodDeConta" label="Selecione o tipo de conta" nome="tipoDeConta" setValor={setTipoDeConta} valor={tipoDeConta} opcoes={opcoesDeTipoDeConta} />

                    </div>

                    <div className="flex items-center gap-3 ml-auto">
                        <button
                            type="button"
                            onClick={() => limparFormulario()}
                            className="flex items-center gap-2 font-bold rounded-lg border border-red-600 text-red-600 p-2 px-4 transition-all duration-300 cursor-pointer hover:text-white hover:bg-red-600"

                        >
                            <AiOutlineClear className="text-2xl" />
                            <p>Limpar</p>
                        </button>
                        <button
                            type="submit"
                            disabled={carregando}
                            className="flex items-center gap-2 font-bold rounded-lg border border-verde p-2 px-4 transition-all duration-300 cursor-pointer hover:text-white hover:bg-verde"
                        >
                            <HiSaveAs className="text-2xl" />
                            <p>Atualizar</p>
                        </button>
                    </div>
                </form>
            </Dialog>

            <DialogPersonalizado
                visivel={dialogAlterarStatus}
                titulo="Confirmar alteração de status"
                mensagem={
                    usuarioParaAlterarStatus
                        ? `Deseja realmente ${usuarioParaAlterarStatus.ativo ? "inativar" : "reativar"} o usuário "${usuarioParaAlterarStatus.nome}"?`
                        : ""
                }
                textoConfirmar="Confirmar"
                textoCancelar="Cancelar"
                mostrarCancelar={true}
                aoConfirmar={alterarStatusUsuario}
                aoCancelar={() => {
                    setDialogAlterarStatus(false)
                    setUsuarioParaAlterarStatus(null)
                }}
            />

        </Template>
    )
}