'use client'

import InputEmail from "@/components/assets/inputs/InputEmail";
import InputSelect from "@/components/assets/inputs/InputSelect";
import InputTexto from "@/components/assets/inputs/InputTexto";
import { useLocaisDeAtendimento } from "@/hooks/useLocaisDeAtendimento";
import { useUsuarios } from "@/hooks/useUsuarios";
import { useState } from "react";
import { FaUserFriends } from "react-icons/fa";
import { FaListCheck, FaMagnifyingGlass } from "react-icons/fa6";
import { MdDriveFileRenameOutline, MdSave } from "react-icons/md";
import { PiBroomFill } from "react-icons/pi";
import { Paginator, PaginatorPageChangeEvent } from "primereact/paginator"
import { TiUserDelete } from "react-icons/ti";
import { RiDeleteBin5Line } from "react-icons/ri";
import { BiSolidEdit } from "react-icons/bi";
import InputData from "@/components/assets/inputs/InputData";
import { HiOutlineCalendarDateRange } from "react-icons/hi2";
import { Dialog } from "primereact/dialog";
import { useDialog } from "@/context/DialogContext";
import { Perfil, Usuario } from "@/app/generated/prisma/client";

export default function Page() {
    const { locais } = useLocaisDeAtendimento()
    const { usuarios, buscarUsuarios } = useUsuarios()
    const { abrirDialog } = useDialog()

    console.log(usuarios)

    const [nome, setNome] = useState('')
    const [email, setEmail] = useState('')
    const [unidadeDeOrigem, setUnidadeDeOrigem] = useState('')
    const [tipoDeConta, setTipoDeConta] = useState('')
    const [dataDeNascimento, setDataDeNascimento] = useState('')
    const [senha, setSenha] = useState('')
    const [confirmarSenha, setConfirmarSenha] = useState('')

    const [editar, setEditar] = useState(false)
    const [usuarioEditando, setUsuarioEditando] = useState<number | null>(null)

    const [first, setFirst] = useState(0)
    const [rows] = useState(5)
    const usuariosPaginados = usuarios.slice(
        first,
        first + rows
    )

    const opcoesDeLocais = [
        {
            valor: '',
            label: 'Selecione'
        },
        ...locais.map(local => ({
            valor: local.id.toString(),
            label: local.nome
        }))
    ]

    const opcoesDeTipoDeConta = [
        {
            valor: '',
            label: 'Selecione'
        },
        ...Object.values(Perfil).map(perfil => ({
            valor: perfil,
            label: perfil
                .toLowerCase()
                .replace('_', ' ')
                .replace(/\b\w/g, letra => letra.toUpperCase())
        }))
    ]

    const limparFormulario = () => {
        setNome('')
        setEmail('')
        setUnidadeDeOrigem('')
        setTipoDeConta('')
        setSenha('')
        setConfirmarSenha('')

        setUsuarioEditando(null)
        setEditar(false)
    }

    const onSubmitSalvarUsuario = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault()

        if (senha !== confirmarSenha) {
            console.error("As senhas não conferem.")
            return
        }

        const dados = {
            nome,
            email,
            unidadeDeOrigemId: unidadeDeOrigem
                ? Number(unidadeDeOrigem)
                : null,
            dataDeNascimento,
            perfil: tipoDeConta,
            senha,
        }

        const editando = usuarioEditando !== null

        try {
            const resposta = await fetch(
                editando
                    ? `/api/usuario/${usuarioEditando}`
                    : "/api/usuario",
                {
                    method: editando ? "PUT" : "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(dados),
                }
            )

            const resultado = await resposta.json()

            if (!resposta.ok) {
                console.error(resultado.erro)
                return
            }

            abrirDialog({
                title: "Cadastro realizado",
                message: "O procedimento foi cadastrado com sucesso.",
            })
            console.log(resultado)
            await buscarUsuarios()
            limparFormulario()

        } catch (error) {
            console.error("Erro ao salvar usuário:", error)
        }
    }

    const removerUsuario = (usuario: Usuario) => {
        if (!usuario) {
            abrirDialog({
                title: "Erro",
                message: "Usuário não encontrado.",
            })

            return
        }

        abrirDialog({
            title: "Excluir Usuário",
            message: `Deseja realmente excluir o usuário "${usuario.nome}"?`,
            confirmText: "Excluir",
            cancelText: "Cancelar",

            onConfirm: async () => {
                try {
                    const response = await fetch(
                        `/api/usuario/${usuario.id}`,
                        {
                            method: "DELETE",
                        }
                    )

                    const data = await response.json()

                    if (!response.ok) {
                        throw new Error(
                            data.erro ||
                            data.error ||
                            "Erro ao excluir usuário."
                        )
                    }

                    await buscarUsuarios()

                    abrirDialog({
                        title: "Exclusão realizada",
                        message: `O usuário "${usuario.nome}" foi excluído com sucesso.`,
                    })

                } catch (error) {
                    console.error("Erro ao excluir usuário:", error)

                    abrirDialog({
                        title: "Erro",
                        message:
                            error instanceof Error
                                ? error.message
                                : "Erro ao excluir usuário.",
                    })
                }
            },
        })
    }

    const editarUsuario = (usuario: typeof usuarios[number]) => {
        setUsuarioEditando(usuario.id)

        setNome(usuario.nome)
        setEmail(usuario.email)
        setTipoDeConta(usuario.perfil)

        setUnidadeDeOrigem(
            usuario.unidadeDeOrigemId
                ? usuario.unidadeDeOrigemId.toString()
                : ''
        )

        setDataDeNascimento(
            usuario.dataDeNascimento
                ? String(usuario.dataDeNascimento).slice(0, 10)
                : ''
        )

        setEditar(true)
    }

    const formulario = () => {
        return (
            <form
                className="flex flex-col gap-4"
                onSubmit={onSubmitSalvarUsuario}
            >
                <div className="grid grid-cols-3 gap-4">
                    <InputTexto
                        icone={<MdDriveFileRenameOutline />}
                        id="nome"
                        label="Nome"
                        nome="nome"
                        placeholder="Digite o nome do usuário"
                        setValor={setNome}
                        valor={nome}
                    />

                    <InputEmail
                        icone={<MdDriveFileRenameOutline />}
                        id="email"
                        label="E-mail"
                        nome="email"
                        placeholder="Digite o e-mail do usuário"
                        setValor={setEmail}
                        valor={email}
                    />

                    <InputData
                        icone={<HiOutlineCalendarDateRange />}
                        id="dataDeNascimento"
                        label="Data de Nascimento"
                        nome="dataDeNascimento"
                        placeholder="Data de Nascimento"
                        setValor={setDataDeNascimento}
                        valor={dataDeNascimento}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <InputSelect
                        icone={<FaMagnifyingGlass />}
                        id="unidadeDeOrigem"
                        label="Unidade de Origem"
                        nome="unidadeDeOrigem"
                        setValor={setUnidadeDeOrigem}
                        valor={unidadeDeOrigem}
                        opcoes={opcoesDeLocais}
                    />

                    <InputSelect
                        icone={<FaMagnifyingGlass />}
                        id="tipoDeConta"
                        label="Tipo de Conta"
                        nome="tipoDeConta"
                        setValor={setTipoDeConta}
                        valor={tipoDeConta}
                        opcoes={opcoesDeTipoDeConta}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <InputTexto
                        icone={<MdDriveFileRenameOutline />}
                        id="senha"
                        label="Senha"
                        nome="senha"
                        placeholder="Digite a senha"
                        setValor={setSenha}
                        valor={senha}
                    />

                    <InputTexto
                        icone={<MdDriveFileRenameOutline />}
                        id="confirmarSenha"
                        label="Confirmar Senha"
                        nome="confirmarSenha"
                        placeholder="Digite novamente a senha"
                        setValor={setConfirmarSenha}
                        valor={confirmarSenha}
                    />
                </div>

                <div className="grid grid-cols-2 gap-2 w-fit ml-auto mt-2">
                    <button
                        type="button"
                        onClick={limparFormulario}
                        className="bg-red-500 text-white font-bold text-lg px-4 py-2 rounded-lg flex items-center gap-2 text-shadow-[1px_1px_2px_black]"
                    >
                        <PiBroomFill />
                        <p>Limpar</p>
                    </button>

                    <button
                        type="submit"
                        className="bg-verde text-white font-bold text-lg px-4 py-2 rounded-lg flex items-center gap-2 text-shadow-[1px_1px_2px_black]"
                    >
                        <MdSave />
                        <p>Salvar</p>
                    </button>
                </div>
            </form>
        )
    }

    return (
        <div className="p-6">
            <div className="mb-4 flex items-center gap-2">
                <div className="text-5xl">
                    <FaUserFriends />
                </div>

                <div>
                    <h3 className="text-2xl font-bold">
                        Usuários
                    </h3>

                    <span>
                        Gerencie os usuários cadastrados no sistema.
                    </span>
                </div>
            </div>

            <div className="flex flex-col gap-6">
                <div className="shadow-[0px_0px_2px_1px_var(--verde-escuro)] rounded-lg p-4 flex flex-col gap-3">
                    {formulario()}
                </div>
                <div className="shadow-[0px_0px_2px_1px_var(--verde-escuro)] rounded-lg p-4 flex flex-col gap-3 overflow-hidden">
                    <div className="flex items-center gap-2 text-xl font-bold text-verde">
                        <FaListCheck />
                        <h2>Cadastro Existentes</h2>
                    </div>
                    {/* filtros */}
                    {/* <div className="grid grid-cols-3 gap-4 2xl:grid-cols-4 2xl:gap-4">
                                                        <InputTexto estiloPersonalizado="col-span-3 2xl:col-span-1" icone={<MdDriveFileRenameOutline />} id="buscarNomeCodigo" label="Buscar por Nome ou código" nome="buscarNomeCodigo" placeholder="Buscar por nome ou código" setValor={setBuscarNomeCodigo} valor={buscarNomeCodigo} />
                                                        <InputSelect icone={<FaMagnifyingGlass />} id="filtroCategoria" label="Filtrar por categoria" nome="filtroCategoria" setValor={setFiltroCategoria} valor={filtroCategoria} opcoes={[{ label: 'Consulta', valor: 'CONSULTA' }, { label: 'Procedimento', valor: "PROCEDIMENTO" }, { label: 'Cirurgia', valor: 'CIRURGIA' }]} />
                                                        <InputSelect icone={<GrStatusInfo />} id="filtroStatus" label="Filtrar por status" nome="filtroStatus" setValor={setFiltroStatus} valor={filtroStatus} opcoes={[{ label: 'Ativo', valor: 'CONSULTA' }, { label: 'Inativo', valor: "PROCEDIMENTO" }]} />
                                                        <button className="flex items-center justify-center bg-verde text-white rounded-xl gap-2 text-lg font-bold mt-auto h-[40px]">
                                                            <FaMagnifyingGlassPlus />
                                                            <p>Buscar</p>
                                                        </button>
                                                    </div> */}

                    {/* Tabela */}
                    <div className="flex flex-col overflow-hidden">
                        <div className="overflow-x-scroll">
                            <div className="min-w-[1400px]">
                                <div>
                                    <ul className="grid grid-cols-[250px_250px_150px_130px_180px_250px_150px] 4xl:grid-cols-[1fr_250px_150px_130px_180px_250px_150px] w-full font-bold border-b p-3">
                                        <li>
                                            <p>Nome</p>
                                        </li>
                                        <li className="flex items-center justify-center text-center">
                                            <p>Email</p>
                                        </li>
                                        <li className="flex items-center justify-center text-center">
                                            <p>Perfil</p>
                                        </li>
                                        <li className="flex items-center justify-center text-center">
                                            <p className="line-clamp-1">Data de Nascimento</p>
                                        </li>
                                        <li className="flex items-center justify-center text-center">
                                            <p>Ativo</p>
                                        </li>
                                        <li className="flex items-center justify-center text-center">
                                            <p>Unidade de Origem</p>
                                        </li>
                                        <li className="flex items-center justify-center text-center">
                                            <p>Ações</p>
                                        </li>
                                    </ul>
                                </div>
                                <div>
                                    {
                                        usuariosPaginados.length > 0 ? (
                                            <ul className="flex flex-col gap-2">
                                                {
                                                    usuariosPaginados.map((usuario, i) => {
                                                        return (
                                                            <li key={i} className="grid grid-cols-[250px_250px_150px_130px_180px_250px_150px] 4xl:grid-cols-[1fr_250px_150px_130px_180px_250px_150px] w-full border-b items-center p-3">
                                                                <div>
                                                                    <p>{usuario.nome}</p>
                                                                </div>
                                                                <div className="flex items-center justify-center text-center">
                                                                    <p>{usuario.email}</p>
                                                                </div>
                                                                <div className="flex items-center justify-center text-center">
                                                                    <p className="line-clamp-2">{usuario.perfil}</p>
                                                                </div>
                                                                <div className="flex items-center justify-center text-center">
                                                                    <p className="line-clamp-2">
                                                                        {usuario.dataDeNascimento
                                                                            ? new Date(usuario.dataDeNascimento).toLocaleDateString("pt-BR")
                                                                            : "Não informado"}
                                                                    </p>
                                                                </div>
                                                                <div className="flex items-center justify-center text-center">
                                                                    <p>{usuario.ativo ? 'ATIVO' : 'INATIVO'}</p>
                                                                </div>
                                                                <div className="flex items-center justify-center text-center">
                                                                    <p className="line-clamp-2">
                                                                        {usuario.unidadeDeOrigem?.nome}
                                                                    </p>
                                                                </div>
                                                                <div className="grid grid-cols-3">
                                                                    <button className="flex justify-center items-center rounded-full border border-amber-500 text-amber-500 w-8 h-8 mx-auto duration-200 transition-all hover:bg-amber-500 hover:text-white" onClick={() => editarUsuario(usuario)}><BiSolidEdit /></button>
                                                                    <button className="flex justify-center items-center rounded-full border border-red-500 text-red-500 w-8 h-8 mx-auto duration-200 transition-all hover:bg-red-500 hover:text-white" onClick={() => removerUsuario(usuario)}><RiDeleteBin5Line /></button>
                                                                    <button className="flex justify-center items-center rounded-full border border-purple-600 text-purple-600 w-8 h-8 mx-auto duration-200 transition-all hover:bg-purple-600 hover:text-white"><TiUserDelete /></button>
                                                                </div>
                                                            </li>
                                                        )
                                                    })
                                                }
                                            </ul>
                                        ) : (
                                            <div>
                                                <h4>Sem usuarioicos cadastradas</h4>
                                            </div>
                                        )
                                    }
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-[300px_1fr] mt-1 -mb-2">
                            <p className="my-auto">Mostrando 1 a 5 de 5 registros</p>
                            <Paginator
                                first={first}
                                rows={rows}
                                totalRecords={usuarios.length}
                                onPageChange={(event: PaginatorPageChangeEvent) => {
                                    setFirst(event.first)
                                }}
                                className="my-auto"
                            />
                        </div>
                    </div>
                </div>
            </div>
            <Dialog header="Editar Especialidade" visible={editar} style={{ width: '50vw' }} onHide={() => setEditar(false)}>
                {formulario()}
            </Dialog>
        </div>
    )
}