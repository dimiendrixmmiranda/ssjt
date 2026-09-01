import InputEmail from "@/components/assets/inputEmail";
import InputNome from "@/components/assets/inputNome";
import InputSelect from "@/components/assets/InputSelect";
import InputSenha from "@/components/assets/inputSenha";
import { useLocais } from "@/hooks/useLocais";
import { useUsuarios } from "@/hooks/useUsuarios";
import { FormEvent, useState } from "react";
import { AiOutlineSelect } from "react-icons/ai";
import { CiLock } from "react-icons/ci";
import { FaRegTrashAlt, FaRegUser } from "react-icons/fa";
import { FiUserPlus } from "react-icons/fi";
import { ImProfile } from "react-icons/im";
import { MdDriveFileRenameOutline, MdOutlineCancel, MdOutlineEmail } from "react-icons/md";
import { VscCompassActive, VscEditCode } from "react-icons/vsc";

export default function Usuario() {
    const [nome, setNome] = useState('')
    const [email, setEmail] = useState('')
    const [perfil, setPerfil] = useState("");
    const [senha, setSenha] = useState('')
    const [confirmarSenha, setConfirmarSenha] = useState('')
    const [contaAtiva, setContaAtiva] = useState(true);

    const [erro, setErro] = useState("");
    const [sucesso, setSucesso] = useState("");

    const { usuarios, loading } = useUsuarios();
    const { locais } = useLocais()
    const [unidadeDeTrabalho, setUnidadeDeTrabalho] = useState("")

    console.log(unidadeDeTrabalho)


    if (loading) {
        return (
            <div className="font-oswald text-verde-escuro text-4xl min-w-screen min-h-screen flex justify-center items-center text-verde-escuro">
                <h2>Carregando...</h2>
            </div>
        )
    }

    const unidadesSolicitantesDaCidade = locais.filter(local => local.cep == '86455000')
    const opcoesUnidadesDeOrigem = [
        {
            label: 'Selecione',
            valor: ''
        },
        ...unidadesSolicitantesDaCidade.map(local => ({
            label: local.nome,
            valor: local.id
        }))
    ]


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setErro("");
        setSucesso("");

        try {
            if (!nome || !email || !senha || !perfil) {
                setErro("Preencha todos os campos obrigatórios.");
                return;
            }

            if (senha.length < 6) {
                setErro("A senha deve ter pelo menos 6 caracteres.");
                return;
            }

            if (senha !== confirmarSenha) {
                setErro("As senhas não coincidem.");
                return;
            }

            const response = await fetch("/api/usuarios", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    nome,
                    email,
                    senha,
                    role: perfil,
                    contaAtiva,
                    localId: unidadeDeTrabalho || null,
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
            setEmail("");
            setSenha("");
            setConfirmarSenha("");
            setPerfil("");
            setContaAtiva(true);

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
        <div className="p-6 overflow-x-hidden max-h-[91.5vh]">
            <div className="mb-4">
                <h3 className="text-2xl font-bold">Usuários</h3>
            </div>
            <div>
                <h4 className="font-bold text-2xl">Cadastrar Novo Usuário</h4>
                <p>Crie uma conta para um funcionário ou estagiário utilizar o SSJT.</p>
            </div>
            <div className="mt-4 flex flex-col gap-6">
                <form onSubmit={handleSubmit} className="shadow-[0px_0px_2px_1px_#306D29] rounded-lg p-4">
                    <h3 className="text-xl font-bold text-green-800 border-b border-zinc-400 pb-2 mb-2">Dados do Usuario</h3>
                    <div className="flex flex-col gap-2">
                        <InputNome id="nome" label="Nome" nome="nome" valor={nome} setValor={setNome} icone={<MdDriveFileRenameOutline />} placeholder="Nome..." />
                        <InputEmail id="email" label="Email" nome="email" valor={email} setValor={setEmail} icone={<MdOutlineEmail />} placeholder="seuemail@gmail.com" />

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="perfil" className="2xl:text-lg">Tipo de conta</label>
                                <div className="relative">
                                    <div className="absolute left-2 top-[50%]" style={{ transform: 'translate(0,-50%)' }}>
                                        <ImProfile />
                                    </div>
                                    <select
                                        name="perfil"
                                        id="perfil"
                                        value={perfil}
                                        onChange={(e) => setPerfil(e.target.value)}
                                        className="shadow-[0px_0px_2px_1px_#999] p-1 rounded-lg pl-8 text-lg transition-all duration-200 focus:outline-verde w-full"
                                    >
                                        <option value="">Selecione</option>
                                        <option value="SUPER_ADMIN">Super Administrador</option>
                                        <option value="ADMIN">Administrador</option>
                                        <option value="ESTAGIARIO">Estagiário</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <InputSelect
                                    icone={<AiOutlineSelect />}
                                    id="unidadeDeTrabalho"
                                    label="Unidade de Origem"
                                    nome="unidadeDeTrabalho"
                                    setValor={setUnidadeDeTrabalho}
                                    valor={unidadeDeTrabalho}
                                    opcoes={opcoesUnidadesDeOrigem}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <InputSenha id="senha" label="Senha" nome="senha" valor={senha} setValor={setSenha} icone={<CiLock />} placeholder="*********" />
                            <InputSenha id="confirmarSenha" label="Confirmar Senha" nome="confirmarSenha" valor={confirmarSenha} setValor={setConfirmarSenha} icone={<CiLock />} placeholder="*********" />
                        </div>
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                name="contaAtiva"
                                id="contaAtiva"
                                checked={contaAtiva}
                                onChange={(e) => setContaAtiva(e.target.checked)}
                            />

                            <label htmlFor="contaAtiva">
                                <p>Usuário Ativo</p>
                                <span>
                                    Desmarque para bloquear o acesso do usuário no sistema.
                                </span>
                            </label>
                        </div>
                        <div className="flex items-center gap-2 ml-auto">
                            <button type="submit" className="border text-green-800 text-xl px-2 py-1 rounded-lg flex items-center gap-1">
                                <MdOutlineCancel />
                                <p>Cancelar</p>
                            </button>
                            <button type="submit" className="border border-green-800 bg-verde text-white text-xl px-2 py-1 rounded-lg flex items-center gap-1">
                                <FiUserPlus />
                                <p>Criar Usuário</p>
                            </button>
                        </div>
                    </div>
                </form>
                <div className="shadow-[0px_0px_2px_1px_#306D29] rounded-xl overflow-hidden">
                    <div>
                        <ul className="grid grid-cols-[1fr_180px_140px_70px_120px_200px] border-b-2 border-[#306D29]">
                            <li className="flex items-center justify-center border border-[#306D29] py-1">
                                <p>Usuário</p>
                            </li>
                            <li className="flex items-center justify-center border border-[#306D29] py-1">
                                <p>Email</p>
                            </li>
                            <li className="flex items-center justify-center border border-[#306D29] py-1">
                                <p>Tipo de Conta</p>
                            </li>
                            <li className="flex items-center justify-center border border-[#306D29] py-1">
                                <p>Status</p>
                            </li>
                            <li className="flex items-center justify-center border border-[#306D29] py-1">
                                <p>Último Acesso</p>
                            </li>
                            <li className="flex items-center justify-center border border-[#306D29] py-1">
                                <p>Ações</p>
                            </li>
                        </ul>
                    </div>
                    <div>
                        {
                            usuarios.length > 0 ? (
                                <ul className="flex flex-col">
                                    {
                                        usuarios.map(user => {
                                            return (
                                                <li className="grid grid-cols-[1fr_180px_140px_70px_120px_200px]">
                                                    <div className="px-2 py-1 border border-[#306D29] flex items-center gap-2 min-w-0 w-full">
                                                        <div className="rounded-full p-2 text-verde-escuro bg-green-200 shrink-0">
                                                            <FaRegUser />
                                                        </div>

                                                        <div className="min-w-0 flex-1">
                                                            <h3 className="truncate">
                                                                {user.nome}
                                                            </h3>
                                                        </div>
                                                    </div>
                                                    <div className="px-2 py-1 border border-[#306D29] flex items-center min-w-0 w-full">
                                                        <span className="truncate block w-full">
                                                            {user.email}
                                                        </span>
                                                    </div>
                                                    <div className="px-2 py-1 border border-[#306D29] flex items-center min-w-0 w-full">
                                                        <span className="truncate block w-full capitalize">
                                                            {user.role.replaceAll('_', ' ').toLowerCase()}
                                                        </span>
                                                    </div>
                                                    <div className="px-2 py-1 border border-[#306D29] flex items-center min-w-0 w-full">
                                                        <span className="truncate block w-full text-center">
                                                            {user.ativo ? 'Ativo' : 'Inativo'}
                                                        </span>
                                                    </div>
                                                    <div className="px-2 py-1 border border-[#306D29] flex items-center min-w-0 w-full">
                                                        <span className="truncate block w-full text-center">
                                                            {user.ativo ? 'Ativo' : 'Inativo'}
                                                        </span>
                                                    </div>
                                                    <div className="px-2 py-1 border border-[#306D29] truncate max-w-full grid grid-cols-3 gap-2">
                                                        <button className="text-red-500 w-full flex justify-center items-center text-xl rounded-lg transition-all duration-300 py-1 hover:bg-red-500 hover:text-white"><FaRegTrashAlt /></button>
                                                        <button className="text-amber-600 w-full flex justify-center items-center text-xl rounded-lg transition-all duration-300 py-1 hover:bg-amber-600 hover:text-white"><VscEditCode /></button>
                                                        <button className="w-full flex justify-center items-center text-xl rounded-lg transition-all duration-300 py-1 hover:bg-verde-escuro hover:text-white"><VscCompassActive /></button>
                                                    </div>
                                                </li>
                                            )
                                        })
                                    }
                                </ul>
                            ) : (
                                <div>
                                    <h2>Nenhum Usuario cadastrado...</h2>
                                </div>
                            )
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}