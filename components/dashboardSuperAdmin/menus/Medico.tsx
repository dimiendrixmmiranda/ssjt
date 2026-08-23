'use client'
import InputCheckbox from "@/components/assets/InputCheckbox";
import InputSelect from "@/components/assets/InputSelect";
import InputTextArea from "@/components/assets/InputTextArea";
import InputTexto from "@/components/assets/InputTexto";
import { useEspecialidades } from "@/hooks/useEspecialidades";
import { usePrestadores } from "@/hooks/usePrestadores";
import { useState } from "react";
import { AiOutlineSelect } from "react-icons/ai";
import { FaRegEdit, FaRegEye, FaRegTrashAlt } from "react-icons/fa";
import { FaListCheck, FaUserDoctor } from "react-icons/fa6";
import { FiUserPlus } from "react-icons/fi";
import { MdDriveFileRenameOutline, MdOutlineCancel, MdOutlineMenu } from "react-icons/md";
import { VscNewCollection } from "react-icons/vsc";

export default function Medico() {
    const [nome, setNome] = useState('')
    const [crm, setCrm] = useState('')
    const [especialidade, setEspecialidade] = useState('')
    const [ativo, setAtivo] = useState(true)
    const [tipoPrestador, setTipoPrestador] = useState('')
    const [descricao, setDescricao] = useState('')
    const { especialidades } = useEspecialidades()

    const especialidadesFiltradas = especialidades.filter(esp => esp.categoria === 'CONSULTA')

    const { prestadores } = usePrestadores()

    const [erro, setErro] = useState('')
    const [sucesso, setSucesso] = useState('')

    const buscarEspecialidade = (espId: string) => {
        return especialidades.find(esp => esp.id === espId)
    }

    const tiposDePrestador = [
        {
            valor: 'MEDICO',
            label: 'Médico'
        },
        {
            valor: 'LABORATORIO',
            label: 'Laboratório'
        }
    ]

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setErro("");
        setSucesso("");

        if (!nome || !crm || !especialidade || !tipoPrestador) {
            setErro("Preencha todos os campos obrigatórios.");
            return;
        }

        const dadosDoFormulario = {
            nome,
            crm,
            especialidadeId: especialidade,
            tipo: tipoPrestador,
            ativo,
            descricao,
        };

        console.log("Dados enviados:", dadosDoFormulario);

        try {
            const response = await fetch("/api/prestador", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(dadosDoFormulario),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.error || data.erro || "Erro ao cadastrar médico."
                );
            }

            setSucesso("Profissional cadastrado com sucesso!");

            setNome("");
            setCrm("");
            setEspecialidade("");
            setTipoPrestador("");
            setDescricao("");
            setAtivo(true);

        } catch (error) {
            console.error("Erro ao cadastrar médico:", error);

            setErro(
                error instanceof Error
                    ? error.message
                    : "Erro inesperado ao cadastrar médico."
            );
        }
    };

    console.log(prestadores)

    return (
        <div className="p-4">
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
                                opcoes={especialidadesFiltradas.map((esp) => ({
                                    valor: esp.id,
                                    label: esp.nome,
                                }))}
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
                    <div className="flex flex-col w-full">
                        {prestadores.length > 0 ? (
                            <div className="w-full">
                                <ul className="grid grid-cols-[1fr_100px_150px_100px_200px_150px] w-full font-bold border-b">
                                    <li className="p-3">Nome</li>
                                    <li className="p-3 text-center">CRM</li>
                                    <li className="p-3 text-center">Especialidade</li>
                                    <li className="p-3 text-center">Status</li>
                                    <li className="p-3 text-center">Descrição</li>
                                    <li className="p-3 text-center">Ações</li>
                                </ul>

                                {prestadores.map((prestador) => {
                                    const especialidade = buscarEspecialidade(prestador.especialidadeId!)
                                    return (
                                        <ul
                                            key={prestador.id}
                                            className="grid grid-cols-[1fr_100px_150px_100px_200px_150px] w-full border-b items-center"
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
                                                <button className="border border-verde text-verde rounded-lg w-10 h-10 flex justify-center items-center">
                                                    <FaRegEye />
                                                </button>
                                                <button className="border border-amber-600 text-amber-600 rounded-lg w-10 h-10 flex justify-center items-center">
                                                    <FaRegEdit />
                                                </button>
                                                <button className="border border-red-500 text-red-500 rounded-lg w-10 h-10 flex justify-center items-center">
                                                    <FaRegTrashAlt />
                                                </button>
                                            </li>
                                        </ul>
                                    )
                                })}
                            </div>
                        ) : (
                            <div>
                                <h3>Nenhum Profissional Cadastrado</h3>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div >
    )
}