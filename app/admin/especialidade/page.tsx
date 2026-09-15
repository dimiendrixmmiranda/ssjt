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
import { useDialog } from "@/context/DialogContext"
import { Especialidade } from "@/app/generated/prisma/client"

export default function Page() {
    const { especialidades, buscarEspecialidades } = useEspecialidades()
    const { abrirDialog } = useDialog()

    const [editar, setEditar] = useState(false);
    const [especialidadeEditando, setEspecialidadeEditando] = useState<number | null>(null)

    const [nome, setNome] = useState('')
    const [codigo, setCodigo] = useState('')
    const [tipo, setTipo] = useState('')
    const [especialidadeAtual, setEspecialidadeAtual] = useState('')
    const [listaDeEspecialidadesFilhas, setListaDeEspecialidadesFilhas] = useState<string[]>([])

    const [first, setFirst] = useState(0)
    const [rows] = useState(5)
        
    const [filtrarEspecialidade, setFiltrarEspecialidade] = useState('')
    const [buscarPorCodigo, setBuscarPorCodigo] = useState('')

    const especialidadesFiltradas = especialidades.filter((especialidade) => {
        const nomeCorresponde =
            especialidade.nome
                .toLowerCase()
                .includes(filtrarEspecialidade.toLowerCase())

        const codigoCorresponde =
            especialidade.codigo
                .toLowerCase()
                .includes(buscarPorCodigo.toLowerCase())
        return (
            nomeCorresponde &&
            codigoCorresponde
        )
    })

    const especialidadesPaginadas = especialidades.slice(
        first,
        first + rows
    )

    const editarEspecialidade = (esp: typeof especialidades[number]) => {
        setEspecialidadeEditando(esp.id)

        setNome(esp.nome)
        setCodigo(esp.codigo)
        setTipo(esp.tipo.toLowerCase())

        setListaDeEspecialidadesFilhas(
            esp.filhas.map(filha => filha.nome)
        )

        setEditar(true)
    }

    const opcoesTipoEspecialidade = [
        {
            valor: '',
            label: 'Selecione'
        },
        {
            valor: 'normal',
            label: 'Normal'
        },
        {
            valor: 'tfd',
            label: 'TFD'
        },
    ]

    const adicionarOpcao = () => {
        const valor = especialidadeAtual.trim()
        if (!valor) {
            return
        }
        const jaExiste = listaDeEspecialidadesFilhas.some(
            especialidadeFilha =>
                especialidadeFilha.toLowerCase() === valor.toLowerCase()
        )
        // Dialog depois aqui
        if (jaExiste) {
            return
        }
        setListaDeEspecialidadesFilhas(prev => [
            ...prev,
            valor
        ])
        setEspecialidadeAtual('')
    }

    const onSubmitSalvarEspecialidade = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault()

        const dados = {
            nome,
            codigo,
            tipo: tipo.toUpperCase(),
            filhas: listaDeEspecialidadesFilhas,
        }

        const editando = especialidadeEditando !== null

        try {
            const resposta = await fetch(
                editando
                    ? `/api/especialidades/${especialidadeEditando}`
                    : "/api/especialidades",
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

            await buscarEspecialidades()

            abrirDialog({
                title: "Cadastro realizado",
                message: "O médico foi cadastrado com sucesso.",
            })
            setEditar(false)
            setEspecialidadeEditando(null)
            limparFormulario()

        } catch (error) {
            console.error("Erro ao salvar especialidade:", error)
        }
    }

    const removerEspecialidade = (especialidade: Especialidade) => {
        if (!especialidade) {
            abrirDialog({
                title: "Erro",
                message: "Especialidade não encontrada.",
            })

            return
        }

        abrirDialog({
            title: "Excluir Especialidade",
            message: `Deseja realmente excluir a especialidade "${especialidade.nome}"?`,
            confirmText: "Excluir",
            cancelText: "Cancelar",

            onConfirm: async () => {
                try {
                    const response = await fetch(
                        `/api/especialidades/${especialidade.id}`,
                        {
                            method: "DELETE",
                        }
                    )

                    const data = await response.json()

                    if (!response.ok) {
                        throw new Error(
                            data.erro ||
                            data.error ||
                            "Erro ao excluir especialidade."
                        )
                    }

                    await buscarEspecialidades()

                    abrirDialog({
                        title: "Exclusão realizada",
                        message: `A especialidade "${especialidade.nome}" foi excluída com sucesso.`,
                    })

                } catch (error) {
                    console.error("Erro ao excluir especialidade:", error)

                    abrirDialog({
                        title: "Erro",
                        message:
                            error instanceof Error
                                ? error.message
                                : "Erro ao excluir especialidade.",
                    })
                }
            },
        })
    }

    const limparFormulario = () => {
        setNome('')
        setCodigo('')
        setTipo('')
        setEspecialidadeAtual('')
        setListaDeEspecialidadesFilhas([])
    }

    const formulario = () => {
        return (
            <form className="flex flex-col gap-2" onSubmit={onSubmitSalvarEspecialidade}>
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

                <InputSelect icone={<FaMagnifyingGlass />} id="filtroCategoria" label="Filtrar por categoria" nome="filtroCategoria" setValor={setTipo} valor={tipo} opcoes={opcoesTipoEspecialidade} />

                {
                    tipo === 'tfd' && (
                        <div>
                            <div className="flex items-end gap-2">
                                <div className="flex-1">
                                    <InputTexto
                                        icone={<MdDriveFileRenameOutline />}
                                        id="adicionarEspecialidadeFilho"
                                        label="Adicionar Especialidade Filha"
                                        nome="adicionarEspecialidadeFilho"
                                        placeholder="Digite uma opção de especialidade filha"
                                        setValor={setEspecialidadeAtual}
                                        valor={especialidadeAtual}
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={adicionarOpcao}
                                    className="h-[40px] px-4 bg-verde text-white rounded-lg font-bold"
                                >
                                    Adicionar
                                </button>
                            </div>
                            {listaDeEspecialidadesFilhas.length > 0 && (
                                <div className="mt-4">
                                    <span className="font-bold">
                                        Especialidades filhas:
                                    </span>

                                    <div className="mt-2 flex flex-wrap gap-2">
                                        {listaDeEspecialidadesFilhas.map((especialidadeFilha, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg"
                                            >
                                                <span>{especialidadeFilha}</span>

                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setListaDeEspecialidadesFilhas(prev =>
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
                    )
                }
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
                    <h3 className="text-2xl font-bold">Especialidades</h3>
                    <span>Gerencie as especialidades medicas utilizados no sistema.</span>
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
                                id="buscarNomeEspecialidade"
                                label="Buscar Nome Especialidade"
                                nome="buscarNomeEspecialidade"
                                placeholder="Digite o nome do especialidade"
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
                                especialidadesFiltradas.length > 0 ? (
                                    <ul className="flex flex-col gap-2">
                                        {
                                            especialidadesFiltradas.map((esp, i) => {
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
                                                            <button className="flex justify-center items-center rounded-full border border-amber-500 text-amber-500 w-8 h-8 mx-auto duration-200 transition-all hover:bg-amber-500 hover:text-white" onClick={() => editarEspecialidade(esp)}><BiSolidEdit /></button>
                                                            <button className="flex justify-center items-center rounded-full border border-red-500 text-red-500 w-8 h-8 mx-auto duration-200 transition-all hover:bg-red-500 hover:text-white" onClick={() => removerEspecialidade(esp)}><RiDeleteBin5Line /></button>
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
                                totalRecords={especialidades.length}
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
