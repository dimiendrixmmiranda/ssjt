import InputCheckbox from "@/components/assets/InputCheckbox"
import InputNome from "@/components/assets/inputNome"
import InputSelect from "@/components/assets/InputSelect"
import InputTextArea from "@/components/assets/InputTextArea"
import InputTexto from "@/components/assets/InputTexto"
import { useEspecialidades } from "@/hooks/useEspecialidades"
import { useState } from "react"
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

    const { especialidades } = useEspecialidades()
    console.log(especialidades)
    const [erro, setErro] = useState('')
    const [sucesso, setSucesso] = useState('')

    const [buscarNomeCodigo, setBuscarNomeCodigo] = useState('')
    const [filtroCategoria, setFiltroCategoria] = useState('')
    const [filtroStatus, setFiltroStatus] = useState('')

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setErro("");
        setSucesso("");

        try {
            if (!nome || !categoria || !codigo) {
                setErro("Preencha todos os campos obrigatórios.");
                return;
            }

            const response = await fetch("/api/especialidades", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    nome,
                    categoria,
                    codigo,
                    descricao,
                    ativo,
                }),
            });

            console.log(response)

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.erro || data.error || "Erro ao criar usuário."
                );
            }

            setSucesso("Usuário criado com sucesso!");

            // Limpa o formulário
            setNome("");
            setCategoria("");
            setCodigo("");
            setDescricao("");
            setAtivo(true);
        } catch (error) {
            console.error("Erro ao criar usuário:", error);
            setErro(
                error instanceof Error
                    ? error.message
                    : "Erro inesperado ao criar usuário."
            );
        }
    }


    return (
        <div className="p-4">
            <div className="mb-4">
                <h3 className="text-2xl font-bold">Especialidades e Procedimentos</h3>
                <span>Gerencie as especialidades medicas, exames, cirurgias e procedimentos utilizados no sistema.</span>
            </div>
            <div className="shadow-[0px_0px_2px_1px_#999] rounded-lg p-4 flex flex-col gap-3">
                <div className="flex items-center gap-2 text-xl font-bold text-verde">
                    <VscNewCollection />
                    <h2>Novo Cadastro</h2>
                </div>
                <form onSubmit={handleSubmit}>
                    <InputSelect icone={<AiOutlineSelect />} id="categoria" label="Selecione o categoria" nome="categoria" setValor={setCategoria} valor={categoria} opcoes={[{ valor: 'CONSULTA', label: 'Consulta' }, { valor: 'PROCEDIMENTO', label: 'Exame' }, { valor: 'CIRURGIA', label: 'Cirurgia' }]} />
                    <InputTexto icone={<MdDriveFileRenameOutline />} id="nome" label="Nome" nome="nome" placeholder="Digite o nome da especialidade ou procedimento" setValor={setNome} valor={nome} />
                    <InputTexto icone={<GoCodescan />} id="codigo" label="Código" nome="codigo" placeholder="Ex: 156" setValor={setCodigo} valor={codigo} />
                    <InputTextArea altura="h-[200px]" icone={<LiaAudioDescriptionSolid />} id="descricao" label="Adicione uma descrição (Opcional)" nome="descricao" placeholder="..." setValor={setDescricao} valor={descricao} />
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
            <div className="shadow-[0px_0px_2px_1px_#999] rounded-lg p-4 flex flex-col gap-3">
                <div className="flex items-center gap-2 text-xl font-bold text-verde">
                    <FaListCheck />
                    <h2>Cadastro Existentes</h2>
                </div>
                <div className="grid grid-cols-3 gap-2 2xl:grid-cols-4 2xl:gap-4">
                    <InputTexto estiloPersonalizado="col-span-3 2xl:col-span-1" icone={<MdDriveFileRenameOutline />} id="buscarNomeCodigo" label="Buscar por Nome ou código" nome="buscarNomeCodigo" placeholder="Buscar por nome ou código" setValor={setBuscarNomeCodigo} valor={buscarNomeCodigo} />
                    <InputSelect icone={<FaMagnifyingGlass />} id="filtroCategoria" label="Filtrar por categoria" nome="filtroCategoria" setValor={setFiltroCategoria} valor={filtroCategoria} opcoes={[{ label: 'Consulta', valor: 'CONSULTA' }, { label: 'Procedimento', valor: "PROCEDIMENTO" }, { label: 'Cirurgia', valor: 'CIRURGIA' }]} />
                    <InputSelect icone={<GrStatusInfo />} id="filtroStatus" label="Filtrar por status" nome="filtroStatus" setValor={setFiltroStatus} valor={filtroStatus} opcoes={[{ label: 'Ativo', valor: 'CONSULTA' }, { label: 'Inativo', valor: "PROCEDIMENTO" }]} />
                    <button className="flex items-center justify-center bg-verde text-white rounded-xl gap-2 text-lg font-bold">
                        <FaMagnifyingGlassPlus />
                        <p>Buscar</p>
                    </button>
                </div>
                <div>
                    <div>
                        <ul className="grid grid-cols-[1fr_80px_90px_90px_150px] border border-zinc-700">
                            <li>
                                <p>Nome</p>
                            </li>
                            <li>
                                <p>Categoria</p>
                            </li>
                            <li>
                                <p>Código</p>
                            </li>
                            <li>
                                <p>Status</p>
                            </li>
                            <li>
                                <p>Ações</p>
                            </li>
                        </ul>
                    </div>
                    <div>
                        {
                            especialidades.length > 0 ? (
                                <ul className="flex flex-col gap-2">
                                    {
                                        especialidades.map((esp, i) => {
                                            console.log(esp)
                                            return (
                                                <li className="grid grid-cols-[1fr_80px_90px_90px_150px] border border-zinc-700">
                                                    <div>
                                                        <p>{esp.nome}</p>
                                                    </div>
                                                    <div>
                                                        <p>{esp.categoria}</p>
                                                    </div>
                                                    <div>
                                                        <p>{esp.codigo}</p>
                                                    </div>
                                                    <div>
                                                        <p>{esp.ativo ? 'ATIVO' : 'INATIVO'}</p>
                                                    </div>
                                                    <div className="grid grid-cols-3">
                                                        <button><BiSolidEdit /></button>
                                                        <button><RiDeleteBin5Line /></button>
                                                        <button><TiUserDelete /></button>
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
                </div>
            </div>
        </div>
    )
}