'use client'

import InputSelect from "@/components/assets/inputs/InputSelect"
import InputTexto from "@/components/assets/inputs/InputTexto"
import { useEspecialidades } from "@/hooks/useEspecialidades"
import { gerarCodigoTresDigitos } from "@/lib/utils"
import { useState } from "react"
import { Dialog } from 'primereact/dialog';
import { FaListCheck, FaMagnifyingGlass } from "react-icons/fa6"
import { MdDriveFileRenameOutline, MdOutlineMedicalServices, MdSave } from "react-icons/md"
import { PiBroomFill } from "react-icons/pi"
import { Paginator, PaginatorPageChangeEvent } from "primereact/paginator"
import { RiDeleteBin5Line } from "react-icons/ri"
import { TiUserDelete } from "react-icons/ti";
import { BiSolidEdit } from "react-icons/bi";
import { useProcedimentos } from "@/hooks/useProcedimentos"
import { ProcedimentoFilho } from "@/app/generated/prisma/client"
import { useDialog } from "@/context/DialogContext"

export default function Page() {
    const { procedimentos, buscarProcedimentos } = useProcedimentos()
    const { abrirDialog } = useDialog()

    const [editar, setEditar] = useState(false);
    const [procedimentoEditando, setProcedimentoEditando] = useState<number | null>(null)

    const [nome, setNome] = useState('')
    const [codigo, setCodigo] = useState('')
    const [procedimentoFilho, setProcedimentoFilho] = useState('')
    const [listaDeProcedimentosFilhos, setListaDeProcedimentosFilhos] =
        useState<ProcedimentoFilho[]>([])

    const [first, setFirst] = useState(0)
    const [rows] = useState(5)

    const [filtrarEspecialidade, setFiltrarEspecialidade] = useState('')
    const [buscarPorCodigo, setBuscarPorCodigo] = useState('')

    const procedimentosFiltrados = procedimentos.filter((procedimento) => {
        const nomeCorresponde =
            procedimento.nome
                .toLowerCase()
                .includes(filtrarEspecialidade.toLowerCase())

        const codigoCorresponde =
            procedimento.codigo
                .toLowerCase()
                .includes(buscarPorCodigo.toLowerCase())
        return (
            nomeCorresponde &&
            codigoCorresponde
        )
    })

    const procedimentosPaginados = procedimentosFiltrados.slice(
        first,
        first + rows
    )

    const editarProcedimento = (pro: typeof procedimentos[number]) => {
        setProcedimentoEditando(pro.id)

        setNome(pro.nome)
        setCodigo(pro.codigo)
        setListaDeProcedimentosFilhos(pro.filhas)

        setEditar(true)
    }


    const onSubmitSalvarProcedimento = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault()

        const dados = {
            nome,
            codigo,
            filhas: listaDeProcedimentosFilhos,
        }

        const editando = procedimentoEditando !== null

        try {
            const resposta = await fetch(
                editando
                    ? `/api/procedimento/${procedimentoEditando}`
                    : "/api/procedimento",
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

            await buscarProcedimentos()

            abrirDialog({
                title: "Cadastro realizado",
                message: "O procedimento foi cadastrado com sucesso.",
            })

            setEditar(false)
            setProcedimentoEditando(null)
            limparFormulario()

        } catch (error) {
            console.error("Erro ao salvar procedimento:", error)
        }
    }

    const excluirProcedimento = async (id: number) => {
        try {
            const resposta = await fetch(
                `/api/procedimento/${id}`,
                {
                    method: "DELETE",
                }
            )
            const resultado = await resposta.json()
            if (!resposta.ok) {
                console.error(resultado.erro)
                return
            }
            console.log(resultado.mensagem)
            await buscarProcedimentos()
        } catch (error) {
            console.error("Erro ao excluir especialidade:", error)
        }
    }

    const limparFormulario = () => {
        setNome('')
        setCodigo('')
        setProcedimentoFilho('')
        setListaDeProcedimentosFilhos([])
    }

    const adicionarOpcao = () => {
        const valor = procedimentoFilho.trim()

        if (!valor) {
            return
        }

        const jaExiste = listaDeProcedimentosFilhos.some(
            filho =>
                filho.nome?.toLowerCase() === valor.toLowerCase()
        )

        if (jaExiste) {
            return
        }

        setListaDeProcedimentosFilhos(prev => [
            ...prev,
            {
                id: 0,
                nome: valor,
                procedimentoId: procedimentoEditando ?? 0,
                createdAt: new Date(),
                updatedAt: new Date(),
            }
        ])

        setProcedimentoFilho('')
    }

    const formulario = () => {
        return (
            <form className="flex flex-col gap-2" onSubmit={onSubmitSalvarProcedimento}>
                <InputTexto icone={<MdDriveFileRenameOutline />} id="nome" label="Nome" nome="nome" placeholder="Digite o nome da especialidade ou procedimento" setValor={setNome} valor={nome} />

                <div className="flex items-center gap-2">
                    <InputTexto icone={<MdDriveFileRenameOutline />} id="codigo" label="Código" nome="codigo" placeholder="Digite o codigo da especialidade ou procedimento" setValor={setCodigo} valor={codigo} />
                    <button
                        className="whitespace-nowrap flex justify-center items-center mt-auto bg-verde px-3 h-[40px] rounded-lg font-bold text-white text-shadow-[1px_1px_2px_black]"
                        type="button"
                        onClick={(e) => {
                            e.preventDefault()
                            setCodigo(gerarCodigoTresDigitos())
                        }}
                    >
                        Gerar Código
                    </button>
                </div>

                <div>
                    <div className="flex items-end gap-2">
                        <div className="flex-1">
                            <InputTexto icone={<MdDriveFileRenameOutline />} id="procedimentoFilho" label="Procedimento Filho" nome="procedimentoFilho" placeholder="Digite o nome do Procedimento filho" setValor={setProcedimentoFilho} valor={procedimentoFilho} />
                        </div>
                        <button
                            type="button"
                            onClick={adicionarOpcao}
                            className="h-[40px] px-4 bg-verde text-white rounded-lg font-bold"
                        >
                            Adicionar
                        </button>
                    </div>
                    {listaDeProcedimentosFilhos.length > 0 && (
                        <div className="mt-4">
                            <span className="font-bold">
                                Especialidades filhas:
                            </span>

                            <div className="mt-2 flex flex-wrap gap-2">
                                {listaDeProcedimentosFilhos.map((procedimentoFilho, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg"
                                    >
                                        <span>{procedimentoFilho.nome}</span>

                                        <button
                                            type="button"
                                            onClick={() => {
                                                setListaDeProcedimentosFilhos(prev =>
                                                    prev.filter((_, i) => i !== index)
                                                )
                                            }}
                                            className="text-red-500 font-bold"
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>


                <div className="grid grid-cols-2 gap-2 w-fit ml-auto mt-2">
                    <button
                        onClick={(e) => {
                            e.preventDefault()
                            limparFormulario()
                        }}
                        className="bg-red-500 text-white font-bold text-lg px-4 py-2 rounded-lg flex items-center gap-2 text-shadow-[1px_1px_2px_black]"
                    >
                        <div>
                            <PiBroomFill />
                        </div>
                        <p>Limpar</p>
                    </button>
                    <button type="submit" className="bg-verde text-white font-bold text-lg px-4 py-2 rounded-lg flex items-center gap-2 text-shadow-[1px_1px_2px_black]">
                        <div>
                            <MdSave />
                        </div>
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
                    <MdOutlineMedicalServices />
                </div>
                <div>
                    <h3 className="text-2xl font-bold">Procedimentos</h3>
                    <span>Gerencie os procedimentos medicos utilizados no sistema.</span>
                </div>
            </div>
            <div className="flex flex-col gap-6">
                <div className="shadow-[0px_0px_2px_1px_var(--verde-escuro)] rounded-lg p-4 flex flex-col gap-3">
                    {formulario()}
                </div>
                <div className="shadow-[0px_0px_2px_1px_var(--verde-escuro)] rounded-lg p-4 flex flex-col gap-3">
                    <div className="flex items-center gap-2 text-xl font-bold text-verde">
                        <FaListCheck />
                        <h2>Cadastro Existentes</h2>
                    </div>
                    {/* filtros */}
                    <div className="grid grid-cols-3 gap-4">
                        <div className="col-span-2">
                            <InputTexto
                                icone={<MdDriveFileRenameOutline />}
                                id="buscarNomeProcedimento"
                                label="Buscar Nome Procedimento"
                                nome="buscarNomeProcedimento"
                                placeholder="Digite o nome do procedimento"
                                setValor={setFiltrarEspecialidade}
                                valor={filtrarEspecialidade}
                            />
                        </div>
                        <InputTexto
                            icone={<MdDriveFileRenameOutline />}
                            id="buscarPorCodigo"
                            label="Buscar por Código"
                            nome="buscarPorCodigo"
                            placeholder="Digite o código"
                            setValor={setBuscarPorCodigo}
                            valor={buscarPorCodigo}
                        />
                    </div>

                    {/* Tabela */}
                    <div className="flex flex-col">
                        <div>
                            <ul className="grid grid-cols-[1fr_160px_200px_100px_150px] w-full font-bold border-b p-3">
                                <li>
                                    <p>Nome</p>
                                </li>

                                <li className="flex items-center justify-center text-center">
                                    <p>Código</p>
                                </li>
                                <li className="flex items-center justify-center text-center">
                                    <p>Procedimentos Filhos</p>
                                </li>
                                <li className="flex items-center justify-center text-center">
                                    <p>Status</p>
                                </li>
                                <li className="flex items-center justify-center text-center">
                                    <p>Ações</p>
                                </li>
                            </ul>
                        </div>
                        <div>
                            {
                                procedimentosPaginados.length > 0 ? (
                                    <ul className="flex flex-col gap-2">
                                        {
                                            procedimentosPaginados.map((esp, i) => {
                                                // nao esta vindo os procedimentos filhos 
                                                console.log(esp)
                                                return (
                                                    <li key={i} className="grid grid-cols-[1fr_160px_200px_100px_150px] w-full border-b items-center p-3">
                                                        <div>
                                                            <p>{esp.nome}</p>
                                                        </div>
                                                        <div className="flex items-center justify-center text-center">
                                                            <p>{esp.codigo}</p>
                                                        </div>
                                                        <div className="flex items-center justify-center text-center">
                                                            <p className="line-clamp-2">{esp.filhas.length <= 0 ? "Sem Procedimentos Filhos" : esp.filhas.map((filha => filha.nome + ', '))}</p>
                                                        </div>
                                                        <div className="flex items-center justify-center text-center">
                                                            <p>{esp.ativo ? 'ATIVO' : 'INATIVO'}</p>
                                                        </div>
                                                        <div className="grid grid-cols-3">
                                                            <button className="flex justify-center items-center rounded-full border border-amber-500 text-amber-500 w-8 h-8 mx-auto duration-200 transition-all hover:bg-amber-500 hover:text-white" onClick={() => editarProcedimento(esp)}><BiSolidEdit /></button>
                                                            <button className="flex justify-center items-center rounded-full border border-red-500 text-red-500 w-8 h-8 mx-auto duration-200 transition-all hover:bg-red-500 hover:text-white" onClick={() => excluirProcedimento(esp.id)}><RiDeleteBin5Line /></button>
                                                            <button className="flex justify-center items-center rounded-full border border-purple-600 text-purple-600 w-8 h-8 mx-auto duration-200 transition-all hover:bg-purple-600 hover:text-white"><TiUserDelete /></button>
                                                        </div>
                                                    </li>
                                                )
                                            })
                                        }
                                    </ul>
                                ) : (
                                    <div className="flex justify-center items-center text-2xl mt-6 mb-4">
                                        <h4 className="font-bold">Sem especialidades cadastradas</h4>
                                    </div>
                                )
                            }
                        </div>
                        <div className="grid grid-cols-[300px_1fr] mt-1 -mb-2">
                            <p className="my-auto">Mostrando 1 a 5 de 5 registros</p>
                            <Paginator
                                first={first}
                                rows={rows}
                                totalRecords={procedimentosPaginados.length}
                                onPageChange={(event: PaginatorPageChangeEvent) => {
                                    setFirst(event.first)
                                }}
                                className="my-auto"
                            />
                        </div>
                    </div>
                </div>
            </div >
            <Dialog header="Editar Especialidade" visible={editar} style={{ width: '50vw' }} onHide={() => setEditar(false)}>
                {formulario()}
            </Dialog>
        </div >
    )
}
