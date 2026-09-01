'use client'
import DadosNaoEncontrados from "@/components/assets/dadosNaoEncontrados";
import InputCheckbox from "@/components/assets/InputCheckbox";
import InputSelect from "@/components/assets/InputSelect";
import InputTextArea from "@/components/assets/InputTextArea";
import InputTexto from "@/components/assets/InputTexto";
import { useDialog } from "@/context/DialogContext";
import { useEspecialidades } from "@/hooks/useEspecialidades";
import { usePrestadores } from "@/hooks/usePrestadores";
import { useEffect, useState } from "react";
import { AiOutlineSelect } from "react-icons/ai";
import { FaRegEdit, FaRegEye, FaRegTrashAlt } from "react-icons/fa";
import { FaListCheck, FaMagnifyingGlass, FaMagnifyingGlassPlus, FaUserDoctor } from "react-icons/fa6";
import { FiUserPlus } from "react-icons/fi";
import { GrStatusInfo } from "react-icons/gr";
import { MdDriveFileRenameOutline, MdOutlineCancel, MdOutlineMenu } from "react-icons/md";
import { VscNewCollection } from "react-icons/vsc";
import { Paginator, PaginatorPageChangeEvent } from "primereact/paginator"

export default function Medico() {
    const [nome, setNome] = useState('')
    const [crm, setCrm] = useState('')
    const [especialidade, setEspecialidade] = useState('')
    const [ativo, setAtivo] = useState(true)
    const [tipoPrestador, setTipoPrestador] = useState('')
    const [descricao, setDescricao] = useState('')
    const { especialidades } = useEspecialidades()

    const [buscarNomeCodigo, setBuscarNomeCodigo] = useState('')
    const [filtroCategoria, setFiltroCategoria] = useState('')
    const [filtroStatus, setFiltroStatus] = useState('')

    const especialidadesFiltradas = especialidades.filter(esp => esp.categoria === 'CONSULTA')
    const { abrirDialog } = useDialog()

    const { prestadores, buscarPrestadores } = usePrestadores()

    const [erro, setErro] = useState('')
    const [sucesso, setSucesso] = useState('')

    const [first, setFirst] = useState(0)
    const [rows] = useState(5)

    const prestadoresPaginados = prestadores.slice(
        first,
        first + rows
    )

    const buscarEspecialidade = (espId: string) => {
        return especialidades.find(esp => esp.id === espId)
    }

    const tiposDePrestador = [
        {
            valor: '',
            label: 'Selecione'
        },
        {
            valor: 'MEDICO',
            label: 'Médico'
        },
        {
            valor: 'LABORATORIO',
            label: 'Laboratório'
        }
    ]

    useEffect(() => {
        buscarPrestadores()
    }, [])

    const cadastraMedico = async (medico: any) => {
        try {
            const response = await fetch("/api/prestador", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(medico),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(
                    data.erro ||
                    data.error ||
                    "Erro ao cadastrar Medico."
                )
            }
            await buscarPrestadores()
            abrirDialog({
                title: "Cadastro realizado",
                message: "O medico foi cadastrado com sucesso.",
            })
            // limpando formulario
            setNome('')
            setCrm('')
            setTipoPrestador('')
            setEspecialidade('')
            setDescricao('')
        } catch (error) {
            console.error("Erro ao cadastrar medico:", error)
            abrirDialog({
                title: "Erro",
                message:
                    error instanceof Error
                        ? error.message
                        : "Erro ao cadastrar medico.",
            })
        }
    }

    const handleSubmit = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault()

        try {
            if (!nome.trim()) {
                throw new Error("Informe o nome do profissional.")
            }

            if (!crm.trim()) {
                throw new Error("Informe o CRM")
            }

            if (!tipoPrestador) {
                throw new Error("Selecione o tipo de prestador")
            }

            if (!especialidade) {
                throw new Error("Selecione uma especialidade")
            }

            const medico = {
                nome: nome.trim(),
                crm: crm.trim(),
                especialidadeId: especialidade,
                tipo: tipoPrestador,
                ativo,
                descricao: descricao.trim(),
            }

            abrirDialog({
                title: "Confirmar cadastro",
                message: `Deseja realmente adicionar o médico "${medico.nome}"?`,
                confirmText: "Cadastrar",
                cancelText: "Cancelar",

                onConfirm: async () => {
                    await cadastraMedico(medico)
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

    const removerPrestador = (prestadorId: string) => {
        const prestadorSelecionado = prestadores.find(
            (prestador) => prestador.id === prestadorId
        );

        if (!prestadorSelecionado) {
            abrirDialog({
                title: "Erro",
                message: "Prestador não encontrado.",
            });

            return;
        }

        abrirDialog({
            title: "Excluir prestador",
            message: `Deseja realmente excluir o prestador "${prestadorSelecionado.nome}"?`,
            confirmText: "Excluir",
            cancelText: "Cancelar",

            onConfirm: async () => {
                try {
                    const response = await fetch("/api/prestador", {
                        method: "DELETE",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            id: prestadorId,
                        }),
                    });

                    const data = await response.json();

                    if (!response.ok) {
                        throw new Error(
                            data.error ||
                            data.erro ||
                            "Erro ao excluir prestador."
                        );
                    }

                    await buscarPrestadores();

                    abrirDialog({
                        title: "Exclusão realizada",
                        message: `O prestador "${prestadorSelecionado.nome}" foi excluído com sucesso.`,
                    });

                } catch (error) {
                    console.error(
                        "Erro ao excluir prestador:",
                        error
                    );

                    abrirDialog({
                        title: "Erro",
                        message:
                            error instanceof Error
                                ? error.message
                                : "Erro ao excluir prestador.",
                    });
                }
            },
        });
    };

    return (
        <div className="p-6 overflow-x-hidden max-h-[91.5vh]">
            <div className="mb-4">
                <h3 className="text-2xl font-bold">Médicos</h3>
                <span>Gerencie e cadastre um novo profissional.</span>
            </div>
            <div className="flex flex-col gap-4">
                <div className="shadow-[0px_0px_2px_1px_var(--verde-escuro)] rounded-lg p-4 flex flex-col gap-3">
                    <div className="flex items-center gap-2 text-xl font-bold text-verde">
                        <VscNewCollection />
                        <h2>Novo Profissonal</h2>
                    </div>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <div className="grid grid-cols-3 gap-4">
                            <InputTexto icone={<MdDriveFileRenameOutline />} id="nome" label="Nome" nome="nome" placeholder="Digite o nome do Profissional" setValor={setNome} valor={nome} />
                            <InputTexto icone={<MdDriveFileRenameOutline />} id="crm" label="Crm" nome="crm" placeholder="Informe o CRM" setValor={setCrm} valor={crm} />
                            <InputSelect
                                icone={<AiOutlineSelect />}
                                id="tipoPrestador"
                                label="Tipo de prestador"
                                nome="tipoPrestador"
                                setValor={setTipoPrestador}
                                valor={tipoPrestador}
                                opcoes={tiposDePrestador}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4 gap-y-2">
                            <InputSelect
                                icone={<AiOutlineSelect />}
                                id="especialidade"
                                label="Selecione uma Especialidade"
                                nome="especialidade"
                                setValor={setEspecialidade}
                                valor={especialidade}
                                opcoes={
                                    [
                                        {
                                            valor: '',
                                            label: "Selecione"
                                        },
                                        ...especialidadesFiltradas.map((esp) => ({
                                            valor: esp.id,
                                            label: esp.nome,
                                        }))
                                    ]
                                }
                            />
                            <div className="row-span-2">
                                <InputTextArea
                                    id="descricao"
                                    label="Descrição do Local"
                                    nome="descricao"
                                    placeholder="Informe observações ou informações adicionais sobre o local..."
                                    setValor={setDescricao}
                                    valor={descricao}
                                    icone={<MdDriveFileRenameOutline />}
                                    altura="h-[120px]"
                                />
                            </div>
                            <InputCheckbox id="ativo" label="Ativo" nome="ativo" setValor={setAtivo} valor={ativo} descricao="Desmarque para inativar esse item e oculta-lo nos cadastros" />
                        </div>
                        <div className="flex items-center gap-2 ml-auto">
                            <button
                                type="button"
                                onClick={() => {
                                    setNome("");
                                    setCrm("");
                                    setEspecialidade("");
                                    setTipoPrestador("");
                                    setDescricao("");
                                    setAtivo(true);
                                    setErro("");
                                    setSucesso("");
                                }}
                                className="border text-green-800 text-xl px-2 py-1 rounded-lg flex items-center gap-1"
                            >
                                <MdOutlineCancel />
                                <p>Cancelar</p>
                            </button>
                            <button type="submit" className="border border-green-800 bg-verde text-white text-xl px-2 py-1 rounded-lg flex items-center gap-1">
                                <FiUserPlus />
                                <p>Adicionar Profissional</p>
                            </button>
                        </div>
                    </form>
                </div>
                <div className="shadow-[0px_0px_2px_1px_var(--verde-escuro)] rounded-lg p-4 flex flex-col gap-3">
                    <div className="flex items-center gap-2 text-xl font-bold text-verde">
                        <MdOutlineMenu />
                        <h2>Profissionais Cadastrados</h2>
                    </div>
                    <div className="grid grid-cols-3 gap-4 2xl:grid-cols-2 2xl:gap-4">
                        <InputTexto estiloPersonalizado="col-span-3 2xl:col-span-1" icone={<MdDriveFileRenameOutline />} id="buscarNomeCodigo" label="Buscar por Nome ou Código do Profissional" nome="buscarNomeCodigo" placeholder="Buscar por nome ou código" setValor={setBuscarNomeCodigo} valor={buscarNomeCodigo} />
                        <InputTexto estiloPersonalizado="col-span-3 2xl:col-span-1" icone={<MdDriveFileRenameOutline />} id="buscarNomeCodigo" label="Buscar por Especialidade" nome="buscarNomeCodigo" placeholder="Dermatologista" setValor={setBuscarNomeCodigo} valor={buscarNomeCodigo} />
                        <InputSelect icone={<FaMagnifyingGlass />} id="filtroCategoria" label="Filtrar por categoria" nome="filtroCategoria" setValor={setFiltroCategoria} valor={filtroCategoria} opcoes={[{ label: 'Selecione', valor: '' }, { label: 'Consulta', valor: 'CONSULTA' }, { label: 'Procedimento', valor: "PROCEDIMENTO" }, { label: 'Cirurgia', valor: 'CIRURGIA' }]} />
                        <InputSelect icone={<GrStatusInfo />} id="filtroStatus" label="Filtrar por status" nome="filtroStatus" setValor={setFiltroStatus} valor={filtroStatus} opcoes={[{ valor: '', label: "Selecione" }, { label: 'Ativo', valor: 'CONSULTA' }, { label: 'Inativo', valor: "PROCEDIMENTO" }]} />
                        <button className="flex items-center justify-center bg-verde text-white rounded-xl gap-2 text-lg font-bold mt-auto h-[40px] 2xl:col-span-2">
                            <FaMagnifyingGlassPlus />
                            <p>Buscar</p>
                        </button>
                    </div>
                    <div className="flex flex-col w-full">
                        {prestadores.length > 0 ? (
                            <div className="w-full">
                                <ul className="grid grid-cols-[1fr_100px_180px_100px_200px_150px] w-full font-bold border-b">
                                    <li className="p-3">Nome</li>
                                    <li className="p-3 text-center">CRM</li>
                                    <li className="p-3 text-center">Especialidade</li>
                                    <li className="p-3 text-center">Status</li>
                                    <li className="p-3 text-center">Descrição</li>
                                    <li className="p-3 text-center">Ações</li>
                                </ul>

                                {prestadoresPaginados.map((prestador) => {
                                    const especialidade = buscarEspecialidade(prestador.especialidadeId!)
                                    return (
                                        <ul
                                            key={prestador.id}
                                            className="grid grid-cols-[1fr_100px_180px_100px_200px_150px] w-full border-b items-center"
                                        >
                                            <li className="p-3">
                                                <div className="flex items-center gap-4">
                                                    <div className="rounded-full p-2 text-xl bg-verde text-white">
                                                        <FaUserDoctor />
                                                    </div>
                                                    <p>
                                                        {prestador.nome}
                                                    </p>
                                                </div>
                                            </li>
                                            <li className="p-3 text-center">
                                                {prestador.crm}
                                            </li>
                                            <li className="p-3 text-center">
                                                {especialidade?.nome}
                                            </li>
                                            <li className="p-3 text-center">
                                                {prestador.ativo ? "Ativo" : "Inativo"}
                                            </li>
                                            <li className="p-3 line-clamp-2 text-center">
                                                {prestador.descricao || "-"}
                                            </li>
                                            <li className="p-3 gap-2 text-center grid grid-cols-3">
                                                <button className="border border-verde text-verde rounded-lg w-10 h-10 flex justify-center items-center duration-200 transition-all hover:bg-verde hover:text-white">
                                                    <FaRegEye />
                                                </button>
                                                <button className="border border-amber-600 text-amber-600 rounded-lg w-10 h-10 flex justify-center items-center duration-200 transition-all hover:bg-amber-600 hover:text-white">
                                                    <FaRegEdit />
                                                </button>
                                                <button onClick={() => removerPrestador(prestador.id)} className="border border-red-500 text-red-500 rounded-lg w-10 h-10 flex justify-center items-center duration-200 transition-all hover:bg-red-500 hover:text-white">
                                                    <FaRegTrashAlt />
                                                </button>
                                            </li>
                                        </ul>
                                    )
                                })}
                            </div>
                        ) : (
                            <DadosNaoEncontrados />
                        )}
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
    )
}