import InputCheckbox from "@/components/assets/InputCheckbox"
import InputNome from "@/components/assets/inputNome"
import InputSelect from "@/components/assets/InputSelect"
import InputTextArea from "@/components/assets/InputTextArea"
import InputTexto from "@/components/assets/InputTexto"
import { useDialog } from "@/context/DialogContext"
import { useEspecialidades } from "@/hooks/useEspecialidades"
import { Paginator, PaginatorPageChangeEvent } from "primereact/paginator"
import { useEffect, useState } from "react"
import { AiOutlineSelect } from "react-icons/ai"
import { BiSolidEdit } from "react-icons/bi"
import { FaListCheck, FaMagnifyingGlass, FaMagnifyingGlassPlus } from "react-icons/fa6"
import { FiUserPlus } from "react-icons/fi"
import { GoCodescan } from "react-icons/go"
import { GrStatusInfo } from "react-icons/gr"
import { IoIosCheckbox } from "react-icons/io"
import { LiaAudioDescriptionSolid } from "react-icons/lia"
import { MdDriveFileRenameOutline, MdOutlineCancel } from "react-icons/md"
import { RiDeleteBin5Line } from "react-icons/ri"
import { TiUserDelete } from "react-icons/ti"
import { VscNewCollection } from "react-icons/vsc"

export default function Especialidade() {
    const [nome, setNome] = useState('')
    const [categoria, setCategoria] = useState('')
    const [codigo, setCodigo] = useState('')
    const [descricao, setDescricao] = useState('')
    const [ativo, setAtivo] = useState(true)

    const { especialidades, buscarEspecialidades } = useEspecialidades()
    const { abrirDialog } = useDialog()

    useEffect(() => {
        buscarEspecialidades()
    }, [])

    const [erro, setErro] = useState('')
    const [sucesso, setSucesso] = useState('')

    const [buscarNomeCodigo, setBuscarNomeCodigo] = useState('')
    const [filtroCategoria, setFiltroCategoria] = useState('')
    const [filtroStatus, setFiltroStatus] = useState('')

    const [first, setFirst] = useState(0)
    const [rows] = useState(5)


    const especialidadesPaginadas = especialidades.slice(
        first,
        first + rows
    )

    const cadastrarEspecialidade = async (especialidade: any) => {
        try {
            const response = await fetch("/api/especialidades", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(especialidade),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(
                    data.erro ||
                    data.error ||
                    "Erro ao cadastrar Especialidade."
                )
            }
            await buscarEspecialidades()
            abrirDialog({
                title: "Cadastro realizado",
                message: "O local foi cadastrado com sucesso.",
            })
            // limpar formulario
            setCategoria('')
            setNome('')
            setCodigo('')
            setDescricao('')
        } catch (error) {
            console.error("Erro ao cadastrar local:", error)
            abrirDialog({
                title: "Erro",
                message:
                    error instanceof Error
                        ? error.message
                        : "Erro ao cadastrar local.",
            })
        }
    }

    const handleSubmit = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault()
        try {

            if (!nome.trim()) {
                throw new Error("Informe o nome da Especialidade.")
            }

            if (!categoria) {
                throw new Error("Selecione a categoria da especialidade")
            }

            const especialidade = {
                nome: nome.trim(),
                categoria,
                codigo,
                descricao,
                ativo,
            }

            abrirDialog({
                title: "Confirmar cadastro",
                message: `Deseja realmente adicionar a especialidade "${especialidade.nome}"?`,
                confirmText: "Cadastrar",
                cancelText: "Cancelar",

                onConfirm: async () => {
                    await cadastrarEspecialidade(especialidade)
                }
            })

        } catch (error) {

            abrirDialog({
                title: "Atenção",
                message:
                    error instanceof Error
                        ? error.message
                        : "Erro ao validar o formulário."
            })
        }
    }

    const removerEspecialidade = (especialidadeId: string) => {
        const especialidadeSelecionada = especialidades.find(
            esp => esp.id === especialidadeId
        )

        console.log("ID:", especialidadeId)
        console.log("Especialidade:", especialidadeSelecionada)

        if (!especialidadeSelecionada) {
            abrirDialog({
                title: "Erro",
                message: "Especialidade não encontrada."
            })
            return
        }

        abrirDialog({
            title: "Excluir especialidade",
            message: `Deseja realmente excluir a especialidade "${especialidadeSelecionada.nome}"?`,
            confirmText: "Excluir",
            cancelText: "Cancelar",

            onConfirm: async () => {
                try {
                    const response = await fetch("/api/especialidades", {
                        method: "DELETE",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            id: especialidadeId,
                        }),
                    })

                    const data = await response.json()

                    if (!response.ok) {
                        throw new Error(
                            data.erro ||
                            "Erro ao excluir especialidade."
                        )
                    }

                    await buscarEspecialidades()

                    abrirDialog({
                        title: "Exclusão realizada",
                        message: `A especialidade "${especialidadeSelecionada.nome}" foi excluída com sucesso.`,
                    })

                } catch (error) {
                    console.error(
                        "Erro ao excluir especialidade:",
                        error
                    )

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

    // Falta implementar os filtros para buscar
    return (
        <div className="p-6 overflow-x-hidden max-h-[91.5vh]">
            <div className="mb-4">
                <h3 className="text-2xl font-bold">Especialidades e Procedimentos</h3>
                <span>Gerencie as especialidades medicas, exames, cirurgias e procedimentos utilizados no sistema.</span>
            </div>
            <div className="flex flex-col gap-6">
                <div className="shadow-[0px_0px_2px_1px_var(--verde-escuro)] rounded-lg p-4 flex flex-col gap-3">
                    <div className="flex items-center gap-2 text-xl font-bold text-verde">
                        <VscNewCollection />
                        <h2>Novo Cadastro</h2>
                    </div>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
                        <InputSelect icone={<AiOutlineSelect />} id="categoria" label="Selecione o categoria" nome="categoria" setValor={setCategoria} valor={categoria} opcoes={[{ valor: '', label: 'Selecione' }, { valor: 'CONSULTA', label: 'Consulta' }, { valor: 'PROCEDIMENTO', label: 'Exame' }, { valor: 'CIRURGIA', label: 'Cirurgia' }]} />
                        <InputTexto icone={<MdDriveFileRenameOutline />} id="nome" label="Nome" nome="nome" placeholder="Digite o nome da especialidade ou procedimento" setValor={setNome} valor={nome} />
                        <InputTexto icone={<GoCodescan />} id="codigo" label="Código" nome="codigo" placeholder="Ex: 156" setValor={setCodigo} valor={codigo} />
                        <InputTextArea altura="h-[150px]" icone={<LiaAudioDescriptionSolid />} id="descricao" label="Adicione uma descrição (Opcional)" nome="descricao" placeholder="..." setValor={setDescricao} valor={descricao} />
                        <InputCheckbox id="ativo" label="Ativo" nome="codigo" setValor={setAtivo} valor={ativo} descricao="Desmarque para inativar esse item e oculta-lo nos cadastros" />
                        <div className="flex items-center gap-2 ml-auto">
                            <button type="submit" className="border text-green-800 text-xl px-2 py-1 rounded-lg flex items-center gap-1">
                                <MdOutlineCancel />
                                <p>Cancelar</p>
                            </button>
                            <button type="submit" className="border border-green-800 bg-verde text-white text-xl px-2 py-1 rounded-lg flex items-center gap-1">
                                <FiUserPlus />
                                <p>Criar Especialidade</p>
                            </button>
                        </div>
                    </form>
                </div>
                <div className="shadow-[0px_0px_2px_1px_var(--verde-escuro)] rounded-lg p-4 flex flex-col gap-3">
                    <div className="flex items-center gap-2 text-xl font-bold text-verde">
                        <FaListCheck />
                        <h2>Cadastro Existentes</h2>
                    </div>
                    <div className="grid grid-cols-3 gap-4 2xl:grid-cols-4 2xl:gap-4">
                        <InputTexto estiloPersonalizado="col-span-3 2xl:col-span-1" icone={<MdDriveFileRenameOutline />} id="buscarNomeCodigo" label="Buscar por Nome ou código" nome="buscarNomeCodigo" placeholder="Buscar por nome ou código" setValor={setBuscarNomeCodigo} valor={buscarNomeCodigo} />
                        <InputSelect icone={<FaMagnifyingGlass />} id="filtroCategoria" label="Filtrar por categoria" nome="filtroCategoria" setValor={setFiltroCategoria} valor={filtroCategoria} opcoes={[{ label: 'Consulta', valor: 'CONSULTA' }, { label: 'Procedimento', valor: "PROCEDIMENTO" }, { label: 'Cirurgia', valor: 'CIRURGIA' }]} />
                        <InputSelect icone={<GrStatusInfo />} id="filtroStatus" label="Filtrar por status" nome="filtroStatus" setValor={setFiltroStatus} valor={filtroStatus} opcoes={[{ label: 'Ativo', valor: 'CONSULTA' }, { label: 'Inativo', valor: "PROCEDIMENTO" }]} />
                        <button className="flex items-center justify-center bg-verde text-white rounded-xl gap-2 text-lg font-bold mt-auto h-[40px]">
                            <FaMagnifyingGlassPlus />
                            <p>Buscar</p>
                        </button>
                    </div>
                    <div className="flex flex-col">
                        <div>
                            <ul className="grid grid-cols-[1fr_160px_100px_100px_150px] w-full font-bold border-b p-3">
                                <li>
                                    <p>Nome</p>
                                </li>
                                <li className="flex items-center justify-center text-center">
                                    <p>Categoria</p>
                                </li>
                                <li className="flex items-center justify-center text-center">
                                    <p>Código</p>
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
                                especialidadesPaginadas.length > 0 ? (
                                    <ul className="flex flex-col gap-2">
                                        {
                                            especialidadesPaginadas.map((esp, i) => {
                                                return (
                                                    <li key={i} className="grid grid-cols-[1fr_160px_100px_100px_150px] w-full border-b items-center p-3">
                                                        <div>
                                                            <p>{esp.nome}</p>
                                                        </div>
                                                        <div className="flex items-center justify-center text-center">
                                                            <p>{esp.categoria}</p>
                                                        </div>
                                                        <div className="flex items-center justify-center text-center">
                                                            <p>{esp.codigo}</p>
                                                        </div>
                                                        <div className="flex items-center justify-center text-center">
                                                            <p>{esp.ativo ? 'ATIVO' : 'INATIVO'}</p>
                                                        </div>
                                                        <div className="grid grid-cols-3">
                                                            <button className="flex justify-center items-center rounded-full border border-amber-500 text-amber-500 w-10 h-10 mx-auto duration-200 transition-all hover:bg-amber-500 hover:text-white"><BiSolidEdit /></button>
                                                            <button onClick={() => removerEspecialidade(esp.id)} className="flex justify-center items-center rounded-full border border-red-500 text-red-500 w-10 h-10 mx-auto duration-200 transition-all hover:bg-red-500 hover:text-white"><RiDeleteBin5Line /></button>
                                                            <button className="flex justify-center items-center rounded-full border border-purple-600 text-purple-600 w-10 h-10 mx-auto duration-200 transition-all hover:bg-purple-600 hover:text-white"><TiUserDelete /></button>
                                                        </div>
                                                    </li>
                                                )
                                            })
                                        }
                                    </ul>
                                ) : (
                                    <div>
                                        <h4>Sem especialidades cadastradas</h4>
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
        </div>
    )
}