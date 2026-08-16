'use client'
import InputCheckbox from "@/components/assets/InputCheckbox";
import InputSelect from "@/components/assets/InputSelect";
import InputTexto from "@/components/assets/InputTexto";
import { useEspecialidades } from "@/hooks/useEspecialidades";
import { useState } from "react";
import { AiOutlineSelect } from "react-icons/ai";
import { FiUserPlus } from "react-icons/fi";
import { MdDriveFileRenameOutline, MdOutlineCancel } from "react-icons/md";
import { VscNewCollection } from "react-icons/vsc";

export default function Medico() {
    const [nome, setNome] = useState('')
    const [crm, setCrm] = useState('')
    const [especialidade, setEspecialidade] = useState('')
    const [ativo, setAtivo] = useState(true)
    const [descricao, setDescricao] = useState('')
    const { especialidades } = useEspecialidades()

    const especialidadesFiltradas = especialidades.filter(esp => esp.categoria === 'CONSULTA')

    const [erro, setErro] = useState('')
    const [sucesso, setSucesso] = useState('')


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setErro("");
        setSucesso("");

        if (!nome || !crm || !especialidade) {
            setErro("Preencha todos os campos obrigatórios.");
            return;
        }

        const dadosDoFormulario = {
            nome,
            crm,
            especialidadeId: especialidade,
            ativo,
            descricao,
        };

        console.log("Dados enviados:", dadosDoFormulario);

        try {
            const response = await fetch("/api/medicos", {
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

            setSucesso("Médico cadastrado com sucesso!");

            // Limpa o formulário
            setNome("");
            setCrm("");
            setEspecialidade("");
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

    return (
        <div className="p-4">
            <div className="mb-4">
                <h3 className="text-2xl font-bold">Médicos</h3>
                <span>Gerencie e cadastre um novo profissional.</span>
            </div>
            <div className="shadow-[0px_0px_2px_1px_#999] rounded-lg p-4 flex flex-col gap-3">
                <div className="flex items-center gap-2 text-xl font-bold text-verde">
                    <VscNewCollection />
                    <h2>Novo Profissonal</h2>
                </div>
                <form onSubmit={handleSubmit}>
                    <InputTexto icone={<MdDriveFileRenameOutline />} id="nome" label="Nome" nome="nome" placeholder="Digite o nome do Profissional" setValor={setNome} valor={nome} />
                    <InputTexto icone={<MdDriveFileRenameOutline />} id="crm" label="Crm" nome="crm" placeholder="Informe o CRM" setValor={setCrm} valor={crm} />
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
                    <InputCheckbox id="ativo" label="Ativo" nome="ativo" setValor={setAtivo} valor={ativo} descricao="Desmarque para inativar esse item e oculta-lo nos cadastros" />
                    <div className="flex items-center gap-2 ml-auto">
                        <button type="submit" className="border text-green-800 text-xl px-2 py-1 rounded-lg flex items-center gap-1">
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
        </div>
    )
}