'use client'

import { FaList, FaRegAddressCard, FaRegBuilding, FaRegTrashAlt } from "react-icons/fa";
import Template from "../Template";
import InputTexto from "@/components/inputs/InputTexto";
import { HiOutlinePencilAlt, HiSaveAs } from "react-icons/hi";
import { FormEvent, useState } from "react";
import InputSelect from "@/components/inputs/InputSelect";
import { MdLocalPhone, MdMailOutline, MdOutlineAddHomeWork, MdOutlineLocationCity } from "react-icons/md";
import { GrMapLocation } from "react-icons/gr";
import { PiCityLight, PiTrainRegionalFill } from "react-icons/pi";
import { GiHorizonRoad } from "react-icons/gi";
import { TbNumber100Small } from "react-icons/tb";
import { RiDashboardLine } from "react-icons/ri";
import { AiOutlineClear } from "react-icons/ai";
import InputEmail from "@/components/inputs/InputEmail";
import { useLocais } from "@/hooks/useListaDeLocais";
import { FiEdit } from "react-icons/fi";
import DialogPersonalizado from "@/components/dialog/DialogPersonalizado";
import { opcoesDeAtendimentoDentroOuForaDoMunicipio, opcoesDeTipoDeLocal } from "@/constants/dados";
import { Dialog } from 'primereact/dialog';
import { Local } from "@/generated/prisma/browser";

export default function Page() {
    const { locais, buscarLocais } = useLocais();

    const [nomeDoLocal, setNomeDoLocal] = useState('')
    const [tipoDeLocal, setTipoDeLocal] = useState('')
    const [atendimentoDentroOuForaDoMunicipio, setAtendimentoDentroOuForaDoMunicipio] = useState('')
    const [quantidadeDeSalas, setQuantidadeDeSalas] = useState('')
    const [cidade, setCidade] = useState('')
    const [cep, setCep] = useState('')
    const [rua, setRua] = useState('')
    const [numero, setNumero] = useState('')
    const [bairro, setBairro] = useState('')
    const [complemento, setComplemento] = useState('')
    const [uf, setUf] = useState('')
    const [telefone, setTelefone] = useState('')
    const [email, setEmail] = useState('')

    const [carregando, setCarregando] = useState(false);
    const [erro, setErro] = useState("");
    const [sucesso, setSucesso] = useState("");

    const [localAtual, setLocalAtual] = useState<Local | null>(null)

    const [dialogConfirmacao, setDialogConfirmacao] = useState(false);
    const [dialogResultado, setDialogResultado] = useState(false);

    const [tituloResultado, setTituloResultado] = useState("");
    const [mensagemResultado, setMensagemResultado] = useState("");

    const [dialogAtualizarLocal, setDialogAtualizarLocal] = useState(false)
    const [dialogConfirmacaoAtualizacao, setDialogConfirmacaoAtualizacao] = useState(false)

    // Inativar/reativar local 
    const [dialogAlterarStatus, setDialogAlterarStatus] = useState(false)
    const [localParaAlterarStatus, setLocalParaAlterarStatus] = useState<Local | null>(null)

    // filtros
    const [filtroPorNome, setFiltroPorNome] = useState('')
    const [filtroPorCidade, setFiltroPorCidade] = useState('')

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const camposObrigatorios = [
            nomeDoLocal,
            tipoDeLocal,
            atendimentoDentroOuForaDoMunicipio,
            cidade,
            cep,
            rua,
            numero,
            bairro,
            telefone,
        ];

        const formularioIncompleto = camposObrigatorios.some(
            (campo) => !campo.trim()
        );

        if (formularioIncompleto) {
            setErro("Preencha todos os campos obrigatórios.");
            return;
        }

        setErro("");
        setDialogConfirmacao(true);
    }

    function handleSubmitAtualizar(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!localAtual) return;

        const camposObrigatorios = [
            nomeDoLocal,
            tipoDeLocal,
            atendimentoDentroOuForaDoMunicipio,
            cidade,
            cep,
            rua,
            numero,
            bairro,
            telefone,
        ];

        const formularioIncompleto = camposObrigatorios.some(
            campo => !campo.trim()
        );

        if (formularioIncompleto) {
            setTituloResultado("Campos obrigatórios");
            setMensagemResultado("Preencha todos os campos obrigatórios.");
            setDialogResultado(true);
            return;
        }

        setDialogConfirmacaoAtualizacao(true);
    }

    function abrirConfirmacaoStatus(local: Local) {
        setLocalParaAlterarStatus(local);
        setDialogAlterarStatus(true);
    }

    function cancelarCadastro() {
        setDialogConfirmacao(false);

        setTituloResultado("Cadastro cancelado");
        setMensagemResultado("A operação foi cancelada. Nenhum local foi cadastrado.");

        setDialogResultado(true);
    }

    function limparFormulario() {
        setNomeDoLocal("")
        setTipoDeLocal("")
        setAtendimentoDentroOuForaDoMunicipio("")
        setCidade("")
        setCep("")
        setRua("")
        setNumero("")
        setBairro("")
        setComplemento("")
        setUf("")
        setTelefone("")
        setEmail("")
        setErro("")
        setSucesso("")
    }

    async function alterarStatusLocal() {
        if (!localParaAlterarStatus) return;

        setCarregando(true);
        setDialogAlterarStatus(false);

        try {
            const novoStatus = !localParaAlterarStatus.ativo;

            const resposta = await fetch(
                `/api/criar-local/${localParaAlterarStatus.id}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        ativo: novoStatus,
                    }),
                }
            );

            const dados = await resposta.json();

            if (!resposta.ok) {
                throw new Error(dados.erro || "Não foi possível alterar o status.");
            }

            await buscarLocais();

            setTituloResultado("Status atualizado");
            setMensagemResultado(
                novoStatus
                    ? "O local foi reativado com sucesso."
                    : "O local foi inativado com sucesso."
            );

        } catch (erro) {
            setTituloResultado("Erro ao atualizar");
            setMensagemResultado(
                erro instanceof Error
                    ? erro.message
                    : "Ocorreu um erro inesperado."
            );

        } finally {
            setCarregando(false);
            setLocalParaAlterarStatus(null);
            setDialogResultado(true);
        }
    }

    async function atualizarLocal() {
        if (!localAtual) return;

        setDialogConfirmacaoAtualizacao(false);
        setCarregando(true);

        try {
            const resposta = await fetch(
                `/api/criar-local/${localAtual.id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        nome: nomeDoLocal,
                        tipoDeLocal,
                        atendimentoDentroOuForaDoMunicipio,
                        quantidadeDeSalas: Number(quantidadeDeSalas),
                        cidade,
                        cep,
                        uf,
                        rua,
                        numero,
                        bairro,
                        complemento,
                        telefone1: telefone,
                        email,
                    }),
                }
            );

            const resultado = await resposta.json();

            if (!resposta.ok) {
                throw new Error(
                    resultado.erro || "Não foi possível atualizar o local."
                );
            }

            await buscarLocais();

            setDialogAtualizarLocal(false);
            setLocalAtual(null);

            setTituloResultado("Atualização realizada!");
            setMensagemResultado(
                "As informações do local foram atualizadas com sucesso."
            );

        } catch (erro) {
            setTituloResultado("Erro na atualização");
            setMensagemResultado(
                erro instanceof Error
                    ? erro.message
                    : "Não foi possível atualizar o local."
            );
        } finally {
            setCarregando(false);
            setDialogResultado(true);
        }
    }

    async function cadastrarLocal() {
        setDialogConfirmacao(false);
        setCarregando(true);

        try {
            const resposta = await fetch("/api/criar-local", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    nome: nomeDoLocal,
                    tipoDeLocal,
                    atendimentoDentroOuForaDoMunicipio,
                    quantidadeDeSalas: Number(quantidadeDeSalas),
                    cidade,
                    cep,
                    uf,
                    rua,
                    numero,
                    bairro,
                    complemento,
                    telefone1: telefone,
                    email,
                }),
            });

            const resultado = await resposta.json();

            if (!resposta.ok) {
                throw new Error(resultado.erro || "Erro ao cadastrar local.");
            }

            await buscarLocais();

            setTituloResultado("Cadastro realizado!");
            setMensagemResultado("O local foi cadastrado com sucesso.");

            // Limpar os campos
            setNomeDoLocal("");
            setTipoDeLocal("");
            setAtendimentoDentroOuForaDoMunicipio("");
            setCidade("");
            setCep("");
            setRua("");
            setNumero("");
            setBairro("");
            setComplemento("");
            setTelefone("");
            setEmail("");

        } catch (erro) {
            setTituloResultado("Erro no cadastro");
            setMensagemResultado(
                erro instanceof Error
                    ? erro.message
                    : "Não foi possível cadastrar o local."
            );
        } finally {
            setCarregando(false);
            setDialogResultado(true);
        }
    }

    return (
        <Template>
            <div className="p-4 text-verde-escuro flex flex-col gap-4 max-h-[100vh] overflow-y-scroll">
                <div className="flex items-center gap-2">
                    <div className="font-bold text-5xl">
                        <FaRegBuilding />
                    </div>
                    <div>
                        <h3 className="font-bold text-2xl">Criar Local de Atendimento</h3>
                        <p>Gerecie os locais de atendimento cadastrados no sistema.</p>
                    </div>
                </div>
                <div className="flex flex-col gap-6">
                    <form className="p-4 border-2 border-verde-escuro rounded-lg flex flex-col gap-4" onSubmit={handleSubmit}>
                        <div className="grid grid-cols-2 gap-4">
                            <InputTexto icone={<HiOutlinePencilAlt />} id="nomeDoLocal" label="Nome do Local" nome="nomeDoLocal" placeholder="Digite o nome do local..." setValor={setNomeDoLocal} valor={nomeDoLocal} estiloPersonalizado="col-span-2" />
                            <InputSelect icone={<MdOutlineLocationCity />} id="tipoDeLocal" label="Tipo de Local" nome="tipoDeLocal" setValor={setTipoDeLocal} valor={tipoDeLocal} opcoes={opcoesDeTipoDeLocal} />
                            <div className="grid grid-cols-3 gap-4">
                                <div className={`${atendimentoDentroOuForaDoMunicipio === "DENTRO_DO_MUNICIPIO" ? 'col-span-2' : 'col-span-3'}`}>
                                    <InputSelect icone={<GrMapLocation />} id="atendimentoDentroOuForaDoMunicipio" label="Atendimento dentro ou fora do município" nome="atendimentoDentroOuForaDoMunicipio" setValor={setAtendimentoDentroOuForaDoMunicipio} valor={atendimentoDentroOuForaDoMunicipio} opcoes={opcoesDeAtendimentoDentroOuForaDoMunicipio} />
                                </div>
                                {atendimentoDentroOuForaDoMunicipio === "DENTRO_DO_MUNICIPIO" && (
                                    <InputTexto icone={<FaRegAddressCard />} id="quantidadeDeSalas" label="Quantidade de salas:" nome="quantidadeDeSalas" placeholder="4" setValor={setQuantidadeDeSalas} valor={quantidadeDeSalas} />
                                )}
                            </div>

                            <InputTexto icone={<PiCityLight />} id="cidade" label="Nome da Cidade" nome="cidade" placeholder="Digite o nome da cidade..." setValor={setCidade} valor={cidade} />
                            <InputTexto icone={<FaRegAddressCard />} id="cep" label="CEP da Cidade" nome="cep" placeholder="Digite o CEP da cidade" setValor={setCep} valor={cep} />
                            <InputTexto icone={<GiHorizonRoad />} id="rua" label="Nome da Rua" nome="rua" placeholder="Digite o nome da rua" setValor={setRua} valor={rua} />
                            <InputTexto icone={<TbNumber100Small />} id="numero" label="Número" nome="numero" placeholder="Digite o numero do endereço" setValor={setNumero} valor={numero} />
                            <div className="grid grid-cols-2 gap-4">
                                <InputTexto icone={<MdOutlineAddHomeWork />} id="bairro" label="Nome do Bairro" nome="bairro" placeholder="Digite o nome do bairro" setValor={setBairro} valor={bairro} />
                                <InputTexto icone={<PiTrainRegionalFill />} id="uf" label="UF" nome="uf" placeholder="UF" setValor={setUf} valor={uf} />
                            </div>
                            <InputTexto icone={<RiDashboardLine />} id="complemento" label="Complemento" nome="complemento" placeholder="Digite um local próximo ou um ponto de referência" setValor={setComplemento} valor={complemento} />
                            <InputTexto icone={<MdLocalPhone />} id="telefone" label="Telefone" nome="telefone" placeholder="Digite um número de telefone" setValor={setTelefone} valor={telefone} />
                            <InputEmail icone={<MdMailOutline />} id="email" label="Email" nome="email" placeholder="Digite um email" setValor={setEmail} valor={email} />
                        </div>

                        <div className="flex items-center gap-3 ml-auto">
                            <button
                                type="button"
                                onClick={() => {
                                    setNomeDoLocal("");
                                    setTipoDeLocal("");
                                    setAtendimentoDentroOuForaDoMunicipio("");
                                    setCidade("");
                                    setCep("");
                                    setRua("");
                                    setNumero("");
                                    setBairro("");
                                    setComplemento("");
                                    setTelefone("");
                                    setEmail("");
                                    setErro("");
                                    setSucesso("");
                                }}
                                className="flex items-center gap-2 font-bold rounded-lg border border-red-600 text-red-600 p-2 px-4 transition-all duration-300 cursor-pointer hover:text-white hover:bg-red-600"

                            >
                                <AiOutlineClear className="text-2xl" />
                                <p>Limpar</p>
                            </button>
                            <button
                                type="submit"
                                disabled={carregando}
                                className="flex items-center gap-2 font-bold rounded-lg border border-verde p-2 px-4 transition-all duration-300 cursor-pointer hover:text-white hover:bg-verde"
                            >
                                <HiSaveAs className="text-2xl" />
                                <p>Salvar</p>
                            </button>
                        </div>
                    </form>

                    <div className="p-4 border-2 border-verde-escuro rounded-lg flex flex-col gap-4 min-w-0">
                        <div className="flex items-center gap-2 font-bold text-xl">
                            <FaList />
                            <h2>Locais já cadastrados</h2>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col">
                                <label htmlFor="filtroPorNome">Buscar por nome do local:</label>
                                <input type="search" name="filtroPorNome" id="filtroPorNome" value={filtroPorNome} onChange={(e) => setFiltroPorNome(e.target.value)} className="shadow-[0px_0px_2px_1px_var(--verde-escuro)] p-2 rounded-lg text-lg transition-all duration-200 focus:outline-verde h-[35px]" />
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="filtroPorCidade">Buscar por cidade:</label>
                                <input type="search" name="filtroPorCidade" id="filtroPorCidade" value={filtroPorCidade} onChange={(e) => setFiltroPorCidade(e.target.value)} className="shadow-[0px_0px_2px_1px_var(--verde-escuro)] p-2 rounded-lg text-lg transition-all duration-200 focus:outline-verde h-[35px]" />
                            </div>
                        </div>
                        <div className="w-full min-w-0 max-w-full overflow-x-auto">
                            <table className="w-[1500px] table-fixed border-collapse text-left">
                                <thead>
                                    <tr className="border-b-2 border-verde-escuro">
                                        <th className="w-[250px] p-2">Nome do Local</th>
                                        <th className="w-[200px] p-2">Tipo do Local</th>
                                        <th className="w-[200px] p-2">Atendimento</th>
                                        <th className="w-[100px] p-2">Salas</th>
                                        <th className="w-[150px] p-2">Nome da Cidade</th>
                                        <th className="w-[120px] p-2">CEP</th>
                                        <th className="w-[250px] p-2">Endereço</th>
                                        <th className="w-[170px] p-2">Telefone</th>
                                        <th className="w-[170px] p-2">Email</th>
                                        <th className="w-[110px] p-2">Ações</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {locais.length > 0 ? (
                                        locais.map((local) => (
                                            <tr key={local.id} className="border-b border-gray-300">
                                                <td className="p-2 break-words">{local.nome}</td>
                                                <td className="p-2 break-words capitalize">{local.tipoDeLocal.replaceAll('_', ' ').toLowerCase()}</td>
                                                <td className="p-2 break-words capitalize">
                                                    {local.atendimentoDentroOuForaDoMunicipio.replaceAll('_', ' ').toLowerCase()}
                                                </td>
                                                <td className="p-2 break-words capitalize">
                                                    {local.quantidadeDeSalas}
                                                </td>
                                                <td className="p-2 break-words">{local.cidade}</td>
                                                <td className="p-2">{local.cep}</td>
                                                <td className="p-2 break-words">
                                                    {local.rua}, {local.numero} - {local.bairro}
                                                    {local.complemento && ` (${local.complemento})`}
                                                </td>
                                                <td className="p-2">{local.telefone1}</td>
                                                <td className="p-2 break-words">
                                                    {local.email || "Não informado"}
                                                </td>
                                                <td className="p-2 break-words grid grid-cols-2 gap-3 gap-y-1 mt-1">
                                                    <button
                                                        className="rounded-lg border h-6 w-11 mt-1 border-amber-600 flex justify-center items-center text-amber-600 cursor-pointer duration-300 transition-all hover:bg-amber-600 hover:text-white"
                                                        onClick={() => {
                                                            setLocalAtual(local)
                                                            setDialogAtualizarLocal(true)

                                                            setNomeDoLocal(local.nome)
                                                            setTipoDeLocal(local.tipoDeLocal)
                                                            setAtendimentoDentroOuForaDoMunicipio(local.atendimentoDentroOuForaDoMunicipio)
                                                            setCidade(local.cidade)
                                                            setCep(local.cep)
                                                            setRua(local.rua)
                                                            setNumero(local.numero)
                                                            setBairro(local.bairro)
                                                            setComplemento(local.complemento || '')
                                                            setTelefone(local.telefone1)
                                                            setEmail(local.email || '')

                                                        }}
                                                    >
                                                        <FiEdit />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => abrirConfirmacaoStatus(local)}
                                                        className={`relative mt-1 inline-flex h-6 w-11 items-center rounded-full transition-colors ${local.ativo ? "bg-green-600" : "bg-gray-300"
                                                            }`}
                                                        aria-label={local.ativo ? "Inativar local" : "Reativar local"}
                                                    >
                                                        <span
                                                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${local.ativo ? "translate-x-6" : "translate-x-1"
                                                                }`}
                                                        />
                                                    </button>
                                                    <button className="rounded-lg border h-6 w-11 mt-1 border-red-600 flex justify-center items-center text-red-600 cursor-pointer duration-300 transition-all hover:bg-amber-600 hover:text-white">
                                                        <FaRegTrashAlt />
                                                    </button>
                                                    <button className="rounded-lg border h-6 w-11 mt-1 border-red-600 flex justify-center items-center text-red-600 cursor-pointer duration-300 transition-all hover:bg-amber-600 hover:text-white">
                                                        <FaRegTrashAlt />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={8} className="p-4 text-center">
                                                Sem locais cadastrados
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* Dialog Salvar Local */}
            <DialogPersonalizado
                visivel={dialogConfirmacao}
                titulo="Confirmar cadastro"
                mensagem={`Deseja realmente cadastrar o local "${nomeDoLocal}"?`}
                textoConfirmar="Confirmar"
                textoCancelar="Cancelar"
                mostrarCancelar={true}
                aoConfirmar={cadastrarLocal}
                aoCancelar={cancelarCadastro}
            />
            <DialogPersonalizado
                visivel={dialogResultado}
                titulo={tituloResultado}
                mensagem={mensagemResultado}
                textoConfirmar="Entendi"
                aoConfirmar={() => setDialogResultado(false)}
                aoCancelar={() => setDialogResultado(false)}
            />

            {/* Dialog atualizar um local */}
            <Dialog
                header="Atualizar Informações do Local"
                visible={dialogAtualizarLocal}
                onHide={() => { if (!dialogAtualizarLocal) return; setDialogAtualizarLocal(false); }}
                className="w-full max-w-[90%] lg:max-w-[900px]"
            >
                <form className="p-4 border-2 border-verde-escuro rounded-lg flex flex-col gap-4" onSubmit={handleSubmitAtualizar}>
                    <div className="grid grid-cols-2 gap-4">
                        <InputTexto icone={<HiOutlinePencilAlt />} id="nomeDoLocal" label="Nome do Local" nome="nomeDoLocal" placeholder="Digite o nome do local..." setValor={setNomeDoLocal} valor={nomeDoLocal} estiloPersonalizado="col-span-2" />
                        <InputSelect icone={<MdOutlineLocationCity />} id="tipoDeLocal" label="Tipo de Local" nome="tipoDeLocal" setValor={setTipoDeLocal} valor={tipoDeLocal} opcoes={opcoesDeTipoDeLocal} />
                        <InputSelect icone={<GrMapLocation />} id="atendimentoDentroOuForaDoMunicipio" label="Atendimento dentro ou fora do município" nome="atendimentoDentroOuForaDoMunicipio" setValor={setAtendimentoDentroOuForaDoMunicipio} valor={atendimentoDentroOuForaDoMunicipio} opcoes={opcoesDeAtendimentoDentroOuForaDoMunicipio} />

                        <div className="grid grid-cols-3 gap-4">
                            <div className={`${atendimentoDentroOuForaDoMunicipio === "DENTRO_DO_MUNICIPIO" ? 'col-span-2' : 'col-span-3'}`}>
                                <InputSelect icone={<GrMapLocation />} id="atendimentoDentroOuForaDoMunicipio" label="Atendimento dentro ou fora do município" nome="atendimentoDentroOuForaDoMunicipio" setValor={setAtendimentoDentroOuForaDoMunicipio} valor={atendimentoDentroOuForaDoMunicipio} opcoes={opcoesDeAtendimentoDentroOuForaDoMunicipio} />
                            </div>
                            {atendimentoDentroOuForaDoMunicipio === "DENTRO_DO_MUNICIPIO" && (
                                <InputTexto icone={<FaRegAddressCard />} id="quantidadeDeSalas" label="Quantidade de salas:" nome="quantidadeDeSalas" placeholder="4" setValor={setQuantidadeDeSalas} valor={quantidadeDeSalas} />
                            )}
                        </div>

                        <InputTexto icone={<PiCityLight />} id="cidade" label="Nome da Cidade" nome="cidade" placeholder="Digite o nome da cidade..." setValor={setCidade} valor={cidade} />
                        <InputTexto icone={<FaRegAddressCard />} id="cep" label="CEP da Cidade" nome="cep" placeholder="Digite o CEP da cidade" setValor={setCep} valor={cep} />
                        <InputTexto icone={<GiHorizonRoad />} id="rua" label="Nome da Rua" nome="rua" placeholder="Digite o nome da rua" setValor={setRua} valor={rua} />
                        <InputTexto icone={<TbNumber100Small />} id="numero" label="Número" nome="numero" placeholder="Digite o numero do endereço" setValor={setNumero} valor={numero} />
                        <InputTexto icone={<MdOutlineAddHomeWork />} id="bairro" label="Nome do Bairro" nome="bairro" placeholder="Digite o nome do bairro" setValor={setBairro} valor={bairro} />
                        <InputTexto icone={<RiDashboardLine />} id="complemento" label="Complemento" nome="complemento" placeholder="Digite um local próximo ou um ponto de referência" setValor={setComplemento} valor={complemento} />
                        <InputTexto icone={<MdLocalPhone />} id="telefone" label="Telefone" nome="telefone" placeholder="Digite um número de telefone" setValor={setTelefone} valor={telefone} />
                        <InputEmail icone={<MdMailOutline />} id="email" label="Email" nome="email" placeholder="Digite um email" setValor={setEmail} valor={email} />
                    </div>

                    <div className="flex items-center gap-3 ml-auto">
                        <button
                            type="button"
                            onClick={() => limparFormulario()}
                            className="flex items-center gap-2 font-bold rounded-lg border border-red-600 text-red-600 p-2 px-4 transition-all duration-300 cursor-pointer hover:text-white hover:bg-red-600"

                        >
                            <AiOutlineClear className="text-2xl" />
                            <p>Limpar</p>
                        </button>
                        <button
                            type="submit"
                            disabled={carregando}
                            className="flex items-center gap-2 font-bold rounded-lg border border-verde p-2 px-4 transition-all duration-300 cursor-pointer hover:text-white hover:bg-verde"
                        >
                            <HiSaveAs className="text-2xl" />
                            <p>Atualizar</p>
                        </button>
                    </div>
                </form>
            </Dialog>

            {/* Dialog de confirmar atualização */}
            <DialogPersonalizado
                visivel={dialogConfirmacaoAtualizacao}
                titulo="Confirmar atualização"
                mensagem={`Deseja realmente atualizar as informações de "${nomeDoLocal}"?`}
                textoConfirmar="Atualizar"
                textoCancelar="Voltar"
                mostrarCancelar={true}
                aoConfirmar={atualizarLocal}
                aoCancelar={() => setDialogConfirmacaoAtualizacao(false)}
            />

            {/* Dialog de inativar um local */}
            <DialogPersonalizado
                visivel={dialogAlterarStatus}
                titulo={
                    localParaAlterarStatus?.ativo
                        ? "Inativar local"
                        : "Reativar local"
                }
                mensagem={
                    localParaAlterarStatus?.ativo
                        ? `Deseja realmente inativar o local "${localParaAlterarStatus.nome}"?`
                        : `Deseja realmente reativar o local "${localParaAlterarStatus?.nome}"?`
                }
                textoConfirmar={
                    localParaAlterarStatus?.ativo ? "Inativar" : "Reativar"
                }
                textoCancelar="Cancelar"
                mostrarCancelar={true}
                aoConfirmar={alterarStatusLocal}
                aoCancelar={() => {
                    setDialogAlterarStatus(false);
                    setLocalParaAlterarStatus(null);
                }}
            />
        </Template>
    )
}
