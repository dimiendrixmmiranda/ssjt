'use client'
import InputSelect from "@/components/assets/inputs/InputSelect";
import InputTexto from "@/components/assets/inputs/InputTexto";
import { useEspecialidades } from "@/hooks/useEspecialidades";
import { useMedicos } from "@/hooks/useMedicos";
import { gerarCodigoTresDigitos } from "@/lib/utils";
import { useState } from "react";
import { BiSolidEdit } from "react-icons/bi";
import { FaListCheck, FaMagnifyingGlass, FaUserDoctor } from "react-icons/fa6";
import { MdDriveFileRenameOutline, MdSave } from "react-icons/md";
import { PiBroomFill } from "react-icons/pi";
import { RiDeleteBin5Line } from "react-icons/ri";
import { TiUserDelete } from "react-icons/ti";
import { Paginator, PaginatorPageChangeEvent } from "primereact/paginator"
import { Dialog } from "primereact/dialog";
import { useDialog } from "@/context/DialogContext";
import { Medico } from "@/app/generated/prisma/client";

export default function Page() {
    const { especialidades } = useEspecialidades()
    const { medicos, buscarMedicos } = useMedicos()
    const { abrirDialog } = useDialog()

    const [nome, setNome] = useState('')
    const [codigo, setCodigo] = useState('')
    const [crm, setCrm] = useState('')
    const [especialidadeId, setEspecialidadeId] = useState('')

    const [editar, setEditar] = useState(false);
    const [medicoEditando, setMedicoEditando] = useState<number | null>(null)

    const [first, setFirst] = useState(0)
    const [rows] = useState(5)

    const [buscarMedico, setBuscarMedico] = useState('')
    const [buscarPorCodigo, setBuscarPorCodigo] = useState('')
    const [buscarPorEspecialidade, setBuscarPorEspecialidade] = useState('')

    const opcoesDeEspecialidades = [
        {
            valor: '',
            label: "Selecione"
        },
        ...especialidades.filter(esp => esp.tipo === 'NORMAL').map(esp => {
            return {
                valor: esp.id.toString(),
                label: esp.nome
            }
        })
    ]

    const limparFormulario = () => {
        setNome('')
        setCodigo('')
        setCrm('')
        setEspecialidadeId('')
    }

    const onSubmitSalvarMedico = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault()

        const dados = {
            nome,
            codigo,
            crm,
            especialidadeId: parseInt(especialidadeId),
        }

        const editando = medicoEditando !== null

        try {
            const resposta = await fetch(
                editando
                    ? `/api/medicos/${medicoEditando}`
                    : "/api/medicos",
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

            await buscarMedicos()

            abrirDialog({
                title: "Cadastro realizado",
                message: "O médico foi cadastrado com sucesso.",
            })

            setEditar(false)
            setMedicoEditando(null)
            limparFormulario()

        } catch (error) {
            console.error("Erro ao salvar especialidade:", error)
        }
    }

    const removerMedico = (medico: Medico) => {
        console.log(medico)
        if (!medico) {
            abrirDialog({
                title: "Erro",
                message: "Prestador não encontrado.",
            })

            return
        }

        abrirDialog({
            title: "Excluir Médico",
            message: `Deseja realmente excluir o médico "${medico.nome}"?`,
            confirmText: "Excluir",
            cancelText: "Cancelar",

            onConfirm: async () => {
                try {
                    const response = await fetch(
                        `/api/medicos/${medico.id}`,
                        {
                            method: "DELETE",
                        }
                    )

                    const data = await response.json()

                    if (!response.ok) {
                        throw new Error(
                            data.erro ||
                            data.error ||
                            "Erro ao excluir médico."
                        )
                    }

                    await buscarMedicos()

                    abrirDialog({
                        title: "Exclusão realizada",
                        message: `O médico "${medico.nome}" foi excluído com sucesso.`,
                    })

                } catch (error) {
                    console.error("Erro ao excluir médico:", error)

                    abrirDialog({
                        title: "Erro",
                        message:
                            error instanceof Error
                                ? error.message
                                : "Erro ao excluir médico.",
                    })
                }
            },
        })
    }

    const editarMedico = (esp: typeof medicos[number]) => {
        setMedicoEditando(esp.id)

        setNome(esp.nome)
        setCodigo(esp.codigo)
        setCrm(esp.crm)
        setEspecialidadeId(esp.especialidadeId.toString())
        // setTipo(esp.tipo.toLowerCase())

        setEditar(true)
    }

    const medicosFiltrados = medicos.filter((medico) => {
        const nomeCorresponde =
            medico.nome
                .toLowerCase()
                .includes(buscarMedico.toLowerCase())

        const codigoCorresponde =
            medico.codigo
                .toLowerCase()
                .includes(buscarPorCodigo.toLowerCase())

        const especialidadeCorresponde =
            buscarPorEspecialidade === '' ||
            medico.especialidadeId.toString() === buscarPorEspecialidade

        return (
            nomeCorresponde &&
            codigoCorresponde &&
            especialidadeCorresponde
        )
    })

    const medicosPaginados = medicosFiltrados.slice(
        first,
        first + rows
    )

    const formulario = () => {
        return (
            <form className="flex flex-col gap-2" onSubmit={onSubmitSalvarMedico}>
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
                <InputTexto icone={<MdDriveFileRenameOutline />} id="crm" label="CRM" nome="crm" placeholder="Informe o CRM do médico" setValor={setCrm} valor={crm} />
                <InputSelect icone={<FaMagnifyingGlass />} id="opcoesDeEspecialidades" label="Opções de Especialidades" nome="opcoesDeEspecialidades" setValor={setEspecialidadeId} valor={especialidadeId} opcoes={opcoesDeEspecialidades} />

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
                    <FaUserDoctor />
                </div>
                <div>
                    <h3 className="text-2xl font-bold">Médicos</h3>
                    <span>Gerencie os médicos do sistema.</span>
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
                        <InputTexto
                            icone={<MdDriveFileRenameOutline />}
                            id="buscarNomeMedico"
                            label="Buscar Nome Médico"
                            nome="buscarNomeMedico"
                            placeholder="Digite o nome do médico"
                            setValor={setBuscarMedico}
                            valor={buscarMedico}
                        />
                        <InputTexto
                            icone={<MdDriveFileRenameOutline />}
                            id="buscarPorCodigo"
                            label="Buscar por Código"
                            nome="buscarPorCodigo"
                            placeholder="Digite o código"
                            setValor={setBuscarPorCodigo}
                            valor={buscarPorCodigo}
                        />
                        <InputSelect
                            icone={<FaMagnifyingGlass />}
                            id="buscarPorEspecialidade"
                            label="Buscar por Especialidade"
                            nome="buscarPorEspecialidade"
                            setValor={setBuscarPorEspecialidade}
                            valor={buscarPorEspecialidade}
                            opcoes={opcoesDeEspecialidades}
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
                                    <p>CRM</p>
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
                                medicosPaginados.length > 0 ? (
                                    <ul className="flex flex-col gap-2">
                                        {
                                            medicosPaginados.map((med, i) => {
                                                return (
                                                    <li key={i} className="grid grid-cols-[1fr_160px_200px_100px_150px] w-full border-b items-center p-3">
                                                        <div>
                                                            <p>{med.nome}</p>
                                                        </div>
                                                        <div className="flex items-center justify-center text-center">
                                                            <p>{med.codigo}</p>
                                                        </div>
                                                        <div className="flex items-center justify-center text-center">
                                                            <p className="line-clamp-2">{med.crm}</p>
                                                        </div>
                                                        <div className="flex items-center justify-center text-center">
                                                            <p>{med.ativo ? 'ATIVO' : 'INATIVO'}</p>
                                                        </div>
                                                        <div className="grid grid-cols-3">
                                                            <button className="flex justify-center items-center rounded-full border border-amber-500 text-amber-500 w-8 h-8 mx-auto duration-200 transition-all hover:bg-amber-500 hover:text-white" onClick={() => editarMedico(med)}><BiSolidEdit /></button>
                                                            <button className="flex justify-center items-center rounded-full border border-red-500 text-red-500 w-8 h-8 mx-auto duration-200 transition-all hover:bg-red-500 hover:text-white" onClick={() => removerMedico(med)}><RiDeleteBin5Line /></button>
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
            </div>
            <Dialog header="Editar Médico" visible={editar} style={{ width: '50vw' }} onHide={() => setEditar(false)}>
                {formulario()}
            </Dialog>
        </div>
    )
}