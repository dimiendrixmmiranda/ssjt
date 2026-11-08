'use client'
import { useEffect, useState } from "react";
import Template from "../Template";
import { Local, TipoDeCadastroPaciente } from "@/generated/prisma/browser";
import { RiUserSearchFill } from "react-icons/ri";
import { FaPlus, FaRegUser, FaUserFriends } from "react-icons/fa";
import { Dialog } from "primereact/dialog";
import InputTexto from "@/components/inputs/InputTexto";
import InputSelect from "@/components/inputs/InputSelect";
import InputData from "@/components/inputs/InputData";
import { BsBook, BsBriefcase, BsBuilding, BsCalendarDate, BsCardChecklist, BsCardText, BsCreditCard, BsDroplet, BsEnvelope, BsFileText, BsGenderAmbiguous, BsGeo, BsGeoAlt, BsGlobe, BsHeart, BsHouse, BsHouseDoor, BsJournalBookmark, BsMap, BsMortarboard, BsPalette, BsPeople, BsPerson, BsPinMap, BsSignpost, BsTelephone, BsWhatsapp } from "react-icons/bs";
import { opcoesDeCorERaca, opcoesDeDeficiencia, opcoesDeEstadoCivil, opcoesDeGrauEscolaridade, opcoesDeLocais, opcoesDeSexo, opcoesDeTipoLogradouro, opcoesDeTipoSanguineo, opcoesDeUF, opcoesDeZona, opcoesFatorRH, opcoesSimNao } from "@/constants/dados";
import InputCheckbox from "@/components/inputs/InputCheckbox";
import { useLocais } from "@/hooks/useListaDeLocais";
import { AiOutlineClear } from "react-icons/ai";
import { HiSaveAs } from "react-icons/hi";

export default function Page() {
    const { locais } = useLocais()

    const [dialogCriarPaciente, setDialogCriarPaciente] = useState(false);

    // Identificação pessoal
    const [nomeDoPaciente, setNomeDoPaciente] = useState("")
    const [nomeSocial, setNomeSocial] = useState("")
    const [inputNomeSocial, setInputNomeSocial] = useState(false)

    const [nomeDaMae, setNomeDaMae] = useState("")
    const [nomeDoPai, setNomeDoPai] = useState("")
    const [dataDeNascimento, setDataDeNascimento] = useState("")

    const [sexo, setSexo] = useState("")
    const [estadoCivil, setEstadoCivil] = useState("")
    const [corERaca, setCorERaca] = useState("")


    const [unidadeDeSaude, setUnidadeDeSaude] = useState<number | null>(null)
    const [codigoGSUS, setCodigoGSUS] = useState("")
    const [codigoIDS, setcodigoIDS] = useState("")
    const [tipoSanguineo, setTipoSanguineo] = useState("")
    const [fatorRH, setFatorRH] = useState("")

    const [nacionalidade, setNacionalidade] = useState("")
    const [municipioDeNascimento, setMunicipioDeNascimento] = useState("")
    const [ufDeNascimento, setUfDeNascimento] = useState("")

    const [pacienteMenorDeIdade, setPacienteMenorDeIdade] = useState(false)

    const [observacoes, setObservacoes] = useState("")

    // Dados do responsavel pelo paciente
    const [nomeDoResponsavel, setNomeDoResponsavel] = useState("")
    const [CPFDoResponsavel, setCPFDoResponsavel] = useState("")
    const [parentescoDoResponsavel, setParentescoDoResponsavel] = useState("")
    const [telefoneDoResponsavel, setTelefoneDoResponsavel] = useState("")

    // Contato
    const [email, setEmail] = useState('')
    const [telefone, setTelefone] = useState("")
    const [telefoneWhatsApp, setTelefoneWhatsApp] = useState("")
    const [nomeContatoEmergencia, setNomeContatoEmergencia] = useState("")
    const [parentescoContatoEmergencia, setParentescoContatoEmergencia] = useState("")
    const [telefoneDeEmergencia, setTelefoneDeEmergencia] = useState("")

    // DOCUMENTOS
    const [CPF, setCPF] = useState("")
    const [cartaoDoSus, setCartaoDoSus] = useState("")
    const [NIS, setNIS] = useState("")
    const [RG, setRG] = useState('')
    const [orgaoEmissorDoRG, setOrgaoEmissorDoRG] = useState('')
    const [ufDoRG, setUfDoRG] = useState('')
    const [dataDaEmissaoDoRG, setdataDaEmissaoDoRG] = useState('')
    const [cnsMae, setCnsMae] = useState('')
    const [tituloDeEleitor, setTituloDeEleitor] = useState('')
    const [zonaEleitoral, setZonaEleitoral] = useState('')
    const [secaoEleitoral, setSecaoEleitoral] = useState('')

    // TRABALHISTA
    const [CTPSNumero, setCTPSNumero] = useState('')
    const [CTPSSerie, setCTPSSerie] = useState('')
    const [cTPSUf, setCTPSUf] = useState('')
    const [CTPSDataEmissao, setCTPSDataEmissao] = useState('')
    const [PISPASEP, setPISPASEP] = useState('')

    // EDUCAÇÃO
    const [frequentaEscola, setFrequentaEscola] = useState('')
    const [escola, setEscola] = useState('')
    const [serieEscolar, setSerieEscolar] = useState('')
    const [grauEscolaridade, setGrauEscolaridade] = useState('')
    const [cursoProfissionalizante, setCursoProfissionalizante] = useState('')

    // NATURALIZAÇÃO
    const [paisDeOrigem, setpaisDeOrigem] = useState('')
    const [entradaNoBrasil, setEntradaNoBrasil] = useState('')

    // LOCALIDADE
    const [pais, setPais] = useState('')
    const [UF, setUF] = useState('')
    const [municipio, setMunicipio] = useState('')
    const [bairro, setBairro] = useState('')
    const [rua, setRua] = useState('')
    const [numero, setNumero] = useState('')
    const [complemento, setComplemento] = useState('')
    const [CEP, setCEP] = useState("")
    const [tipoLogradouro, setTipoLogradouro] = useState("")
    const [pontoDeReferencia, setPontoDeReferencia] = useState("")
    const [latitude, setLatitude] = useState('')
    const [longitude, setLongitude] = useState('')
    const [zona, setZona] = useState('')

    // Informações Adicionais
    const [possuiDeficiencia, setPossuiDeficiencia] = useState(false)
    const [tipoDeDeficiencia, setTipoDeDeficiencia] = useState<string[]>([])
    const [pacienteAtivo, setPacienteAtivo] = useState(true)
    console.log(pacienteMenorDeIdade)

    const [tipoDeCadastro, setTipoDeCadastro] = useState<TipoDeCadastroPaciente>(TipoDeCadastroPaciente.COMPLETO)

    const opcoesDeUnidadeDeSaude = opcoesDeLocais(locais)
    console.log(opcoesDeUnidadeDeSaude)

    useEffect(() => {
        if (!dataDeNascimento) {
            setPacienteMenorDeIdade(false)
            return
        }

        const nascimento = new Date(`${dataDeNascimento}T00:00:00`)
        const hoje = new Date()

        let idade = hoje.getFullYear() - nascimento.getFullYear()

        const aindaNaoFezAniversario =
            hoje.getMonth() < nascimento.getMonth() ||
            (
                hoje.getMonth() === nascimento.getMonth() &&
                hoje.getDate() < nascimento.getDate()
            )

        if (aindaNaoFezAniversario) idade--

        setPacienteMenorDeIdade(idade < 18)
    }, [dataDeNascimento])

    return (
        <Template>
            <div className="p-4 text-verde-escuro flex flex-col gap-4 max-h-[100vh] overflow-y-scroll">
                <div className="flex items-center justify-between gap-6">
                    <div className="flex items-center my-auto gap-2 text-verde-escuro">
                        <RiUserSearchFill className="text-5xl" />
                        <div className="flex flex-col">
                            <h3 className="text-3xl font-bold">Pacientes</h3>
                            <p className="-mt-1">Busque informações de algum paciente</p>
                        </div>
                    </div>
                    <div>
                        <button className="flex items-center gap-2 rounded-lg px-4 h-[45px] bg-verde-escuro text-white font-bold" onClick={() => setDialogCriarPaciente(true)}>
                            <FaPlus />
                            <p>Adicionar Paciente</p>
                        </button>
                    </div>
                </div>
            </div>

            <div className="card flex justify-content-center">
                <Dialog header="Criar Paciente" visible={dialogCriarPaciente} className="max-w-[90%] w-full" onHide={() => { if (!dialogCriarPaciente) return; setDialogCriarPaciente(false); }}>
                    <div className="flex flex-col gap-8">
                        {/* Tipo de cadastro */}
                        <div className="grid grid-cols-2 gap-3">
                            {[
                                {
                                    valor: "PROVISORIO",
                                    label: "Cadastro provisório",
                                    descricao: "Cadastro com informações essenciais."
                                },
                                {
                                    valor: "COMPLETO",
                                    label: "Cadastro completo",
                                    descricao: "Cadastro com todas as informações do paciente."
                                }
                            ].map((opcao) => (
                                <label
                                    key={opcao.valor}
                                    htmlFor={opcao.valor}
                                    className="group flex items-start gap-3 w-full cursor-pointer select-none rounded-lg border border-gray-200 bg-white px-4 py-2.5 transition-all duration-200 hover:border-blue-300 hover:bg-blue-50/40 has-[:checked]:border-blue-500 has-[:checked]:bg-blue-50 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-blue-500/30"
                                >
                                    <div className="relative mt-0.5 shrink-0">
                                        <input
                                            type="radio"
                                            name="tipoDeCadastro"
                                            id={opcao.valor}
                                            value={opcao.valor}
                                            checked={tipoDeCadastro === opcao.valor}
                                            onChange={() => setTipoDeCadastro(opcao.valor as "PROVISORIO" | "COMPLETO")}
                                            className="peer sr-only"
                                        />
                                        <div
                                            className="flex h-8 w-10 items-center justify-center rounded-md border-2 border-gray-300 bg-white transition-all duration-200 peer-checked:border-blue-600 peer-checked:bg-blue-600 peer-focus-visible:ring-2 peer-focus-visible:ring-blue-500/30 group-hover:border-blue-400"
                                        >
                                            <svg
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="3"
                                                className="h-3.5 w-3.5 text-white opacity-0 scale-75 transition-all duration-150 peer-checked:opacity-100 peer-checked:scale-100"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M5 12.5l4.5 4.5L19 7.5"
                                                />
                                            </svg>
                                        </div>
                                    </div>

                                    <div className="flex min-w-0 flex-col gap-0.5">
                                        <span className="font-bold leading-4.5 text-gray-700 transition-colors group-hover:text-gray-900">
                                            {opcao.label}
                                        </span>

                                        <span className="text-xs leading-4 text-gray-500">
                                            {opcao.descricao}
                                        </span>
                                    </div>
                                </label>
                            ))}

                        </div>

                        {/* IDENTIFICAÇÃO */}
                        <section className="flex flex-col gap-3">
                            <h3 className="font-semibold text-lg text-[var(--verde-escuro)]">
                                Dados pessoais
                            </h3>
                            <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
                                <InputTexto
                                    label="Nome completo"
                                    id="nomeDoPaciente"
                                    nome="nomeDoPaciente"
                                    valor={nomeDoPaciente}
                                    setValor={setNomeDoPaciente}
                                    icone={<BsPerson />}
                                    placeholder="Digite o nome completo"
                                    estiloPersonalizado={`col-span-2 ${tipoDeCadastro == TipoDeCadastroPaciente.PROVISORIO ? 'opacity-100' : 'opacity-40'} ${tipoDeCadastro == TipoDeCadastroPaciente.COMPLETO ? 'opacity-100' : ''}`}
                                    campoObrigatorio={tipoDeCadastro === TipoDeCadastroPaciente.PROVISORIO || TipoDeCadastroPaciente.COMPLETO ? true : false}
                                />
                                <div className="grid grid-cols-3 gap-4 col-span-2">
                                    <InputCheckbox
                                        label="Possui nome social?"
                                        id="inputNomeSocial"
                                        nome="inputNomeSocial"
                                        valor={inputNomeSocial}
                                        setValor={setInputNomeSocial}
                                    />
                                    <InputTexto
                                        label="Nome social"
                                        id="nomeSocial"
                                        nome="nomeSocial"
                                        valor={nomeSocial}
                                        setValor={setNomeSocial}
                                        icone={<BsPerson />}
                                        disabled={!inputNomeSocial}
                                        placeholder="Digite o nome social"
                                        estiloPersonalizado={`${inputNomeSocial ? "opacity-100" : "opacity-40"} col-span-2`}
                                    />
                                </div>
                                <InputData
                                    label="Data de nascimento"
                                    id="dataDeNascimento"
                                    nome="dataDeNascimento"
                                    valor={dataDeNascimento}
                                    setValor={setDataDeNascimento}
                                    icone={<BsCalendarDate />}
                                    placeholder="Selecione a data"
                                    campoObrigatorio={tipoDeCadastro === TipoDeCadastroPaciente.PROVISORIO || TipoDeCadastroPaciente.COMPLETO ? true : false}
                                    estiloPersonalizado={`${tipoDeCadastro == TipoDeCadastroPaciente.PROVISORIO ? 'opacity-100' : 'opacity-40'} ${tipoDeCadastro == TipoDeCadastroPaciente.COMPLETO ? 'opacity-100' : ''}`}
                                />
                                <InputSelect
                                    label="Sexo"
                                    id="sexo"
                                    nome="sexo"
                                    valor={sexo}
                                    setValor={setSexo}
                                    icone={<BsGenderAmbiguous />}
                                    opcoes={opcoesDeSexo}
                                    campoObrigatorio={tipoDeCadastro === TipoDeCadastroPaciente.PROVISORIO || TipoDeCadastroPaciente.COMPLETO ? true : false}
                                    estiloPersonalizado={`${tipoDeCadastro == TipoDeCadastroPaciente.PROVISORIO ? 'opacity-100' : 'opacity-40'} ${tipoDeCadastro == TipoDeCadastroPaciente.COMPLETO ? 'opacity-100' : ''}`}
                                />
                                <InputSelect
                                    label="Estado civil"
                                    id="estadoCivil"
                                    nome="estadoCivil"
                                    valor={estadoCivil}
                                    setValor={setEstadoCivil}
                                    icone={<BsHeart />}
                                    opcoes={opcoesDeEstadoCivil}
                                    disabled={tipoDeCadastro === TipoDeCadastroPaciente.PROVISORIO ? true : false}
                                    campoObrigatorio={tipoDeCadastro === TipoDeCadastroPaciente.COMPLETO ? true : false}
                                    estiloPersonalizado={`${tipoDeCadastro == TipoDeCadastroPaciente.PROVISORIO ? 'opacity-40' : 'opacity-100'} ${tipoDeCadastro == TipoDeCadastroPaciente.COMPLETO ? 'opacity-100' : ''}`}
                                />
                                <InputSelect
                                    label="Cor/raça"
                                    id="corERaca"
                                    nome="corERaca"
                                    valor={corERaca}
                                    setValor={setCorERaca}
                                    icone={<BsPalette />}
                                    opcoes={opcoesDeCorERaca}
                                    disabled={tipoDeCadastro === TipoDeCadastroPaciente.PROVISORIO ? true : false}
                                    campoObrigatorio={tipoDeCadastro === TipoDeCadastroPaciente.COMPLETO ? true : false}
                                    estiloPersonalizado={`${tipoDeCadastro == TipoDeCadastroPaciente.PROVISORIO ? 'opacity-40' : 'opacity-100'} ${tipoDeCadastro == TipoDeCadastroPaciente.COMPLETO ? 'opacity-100' : ''}`}
                                />
                            </div>
                        </section>

                        {/* FILIAÇÃO */}
                        <section className="flex flex-col gap-3">
                            <h3 className="font-semibold text-lg text-[var(--verde-escuro)]">
                                Filiação
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <InputTexto
                                    label="Nome da mãe"
                                    id="nomeDaMae"
                                    nome="nomeDaMae"
                                    valor={nomeDaMae}
                                    setValor={setNomeDaMae}
                                    icone={<FaUserFriends />}
                                    placeholder="Digite o nome da mãe"
                                    disabled={tipoDeCadastro === TipoDeCadastroPaciente.PROVISORIO ? true : false}
                                    campoObrigatorio={tipoDeCadastro === TipoDeCadastroPaciente.COMPLETO ? true : false}
                                    estiloPersonalizado={`${tipoDeCadastro == TipoDeCadastroPaciente.PROVISORIO ? 'opacity-40' : 'opacity-100'} ${tipoDeCadastro == TipoDeCadastroPaciente.COMPLETO ? 'opacity-100' : ''}`}
                                />
                                <InputTexto
                                    label="Nome do pai"
                                    id="nomeDoPai"
                                    nome="nomeDoPai"
                                    valor={nomeDoPai}
                                    setValor={setNomeDoPai}
                                    icone={<FaUserFriends />}
                                    placeholder="Digite o nome do pai"
                                    disabled={tipoDeCadastro === TipoDeCadastroPaciente.PROVISORIO ? true : false}
                                    estiloPersonalizado={`${tipoDeCadastro == TipoDeCadastroPaciente.PROVISORIO ? 'opacity-40' : 'opacity-100'} ${tipoDeCadastro == TipoDeCadastroPaciente.COMPLETO ? 'opacity-100' : ''}`}
                                />
                            </div>
                        </section>

                        {/* municipioDeNascimento E NACIONALIDADE */}
                        <section className="flex flex-col gap-3">
                            <h3 className="font-semibold text-lg text-[var(--verde-escuro)]">
                                Naturalidade e nacionalidade
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <InputTexto
                                    label="Nacionalidade"
                                    id="nacionalidade"
                                    nome="nacionalidade"
                                    valor={nacionalidade}
                                    setValor={setNacionalidade}
                                    icone={<BsGlobe />}
                                    placeholder="Ex.: Brasileira"
                                    campoObrigatorio={tipoDeCadastro === TipoDeCadastroPaciente.COMPLETO ? true : false}
                                    disabled={tipoDeCadastro === TipoDeCadastroPaciente.PROVISORIO ? true : false}
                                    estiloPersonalizado={`${tipoDeCadastro == TipoDeCadastroPaciente.PROVISORIO ? 'opacity-40' : 'opacity-100'} ${tipoDeCadastro == TipoDeCadastroPaciente.COMPLETO ? 'opacity-100' : ''}`}
                                />
                                <InputTexto
                                    label="Município de nascimento"
                                    id="municipioDeNascimento"
                                    nome="municipioDeNascimento"
                                    valor={municipioDeNascimento}
                                    setValor={setMunicipioDeNascimento}
                                    icone={<BsGeoAlt />}
                                    placeholder="Digite o município de nascimento"
                                    campoObrigatorio={tipoDeCadastro === TipoDeCadastroPaciente.COMPLETO ? true : false}
                                    disabled={tipoDeCadastro === TipoDeCadastroPaciente.PROVISORIO ? true : false}
                                    estiloPersonalizado={`${tipoDeCadastro == TipoDeCadastroPaciente.PROVISORIO ? 'opacity-40' : 'opacity-100'} ${tipoDeCadastro == TipoDeCadastroPaciente.COMPLETO ? 'opacity-100' : ''}`}
                                />
                                <InputTexto
                                    label="UF de nascimento"
                                    id="ufDeNascimento"
                                    nome="ufDeNascimento"
                                    valor={ufDeNascimento}
                                    setValor={setUfDeNascimento}
                                    icone={<BsBuilding />}
                                    placeholder="Ex.: PR"
                                    campoObrigatorio={tipoDeCadastro === TipoDeCadastroPaciente.COMPLETO ? true : false}
                                    disabled={tipoDeCadastro === TipoDeCadastroPaciente.PROVISORIO ? true : false}
                                    estiloPersonalizado={`${tipoDeCadastro == TipoDeCadastroPaciente.PROVISORIO ? 'opacity-40' : 'opacity-100'} ${tipoDeCadastro == TipoDeCadastroPaciente.COMPLETO ? 'opacity-100' : ''}`}
                                />
                            </div>
                        </section>

                        {/* Unidade de Saúde */}
                        <section className="flex flex-col gap-5">
                            {/* VÍNCULO COM A UNIDADE DE SAÚDE */}
                            <section className="flex flex-col gap-3">
                                <h3 className="font-semibold text-lg text-[var(--verde-escuro)]">
                                    Vínculo com a unidade de saúde
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <InputSelect
                                        label="Unidade de saúde"
                                        id="unidadeDeSaude"
                                        nome="unidadeDeSaude"
                                        valor={unidadeDeSaude}
                                        setValor={setUnidadeDeSaude}
                                        icone={<BsBuilding />}
                                        opcoes={opcoesDeUnidadeDeSaude}
                                        campoObrigatorio={tipoDeCadastro === TipoDeCadastroPaciente.PROVISORIO || TipoDeCadastroPaciente.COMPLETO ? true : false}
                                        estiloPersonalizado={`${tipoDeCadastro == TipoDeCadastroPaciente.PROVISORIO ? 'opacity-100' : 'opacity-40'} ${tipoDeCadastro == TipoDeCadastroPaciente.COMPLETO ? 'opacity-100' : ''}`}
                                    />
                                    <div className="grid grid-cols-2 gap-4">
                                        <InputTexto
                                            label="Código GSUS"
                                            id="codigoGSUS"
                                            nome="codigoGSUS"
                                            valor={codigoGSUS}
                                            setValor={setCodigoGSUS}
                                            icone={<BsCardText />}
                                            placeholder="Digite o código GSUS"
                                            disabled={tipoDeCadastro === TipoDeCadastroPaciente.PROVISORIO ? true : false}
                                            estiloPersonalizado={`${tipoDeCadastro == TipoDeCadastroPaciente.PROVISORIO ? 'opacity-40' : 'opacity-100'} ${tipoDeCadastro == TipoDeCadastroPaciente.COMPLETO ? 'opacity-100' : ''}`}
                                        />
                                        <InputTexto
                                            label="Código IDS"
                                            id="codigoIDS"
                                            nome="codigoIDS"
                                            valor={codigoIDS}
                                            setValor={setcodigoIDS}
                                            icone={<BsCardText />}
                                            placeholder="Digite o código IDS"
                                            disabled={tipoDeCadastro === TipoDeCadastroPaciente.PROVISORIO ? true : false}
                                            estiloPersonalizado={`${tipoDeCadastro == TipoDeCadastroPaciente.PROVISORIO ? 'opacity-40' : 'opacity-100'} ${tipoDeCadastro == TipoDeCadastroPaciente.COMPLETO ? 'opacity-100' : ''}`}
                                        />
                                    </div>
                                </div>
                            </section>

                            {/* INFORMAÇÕES COMPLEMENTARES */}
                            <section className="flex flex-col gap-3">
                                <h3 className="font-semibold text-lg text-[var(--verde-escuro)]">
                                    Informações complementares
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <InputTexto
                                        label="Nacionalidade"
                                        id="nacionalidade"
                                        nome="nacionalidade"
                                        valor={nacionalidade}
                                        setValor={setNacionalidade}
                                        icone={<BsGlobe />}
                                        placeholder="Ex.: Brasileira"
                                        campoObrigatorio={tipoDeCadastro === TipoDeCadastroPaciente.COMPLETO ? true : false}
                                        disabled={tipoDeCadastro === TipoDeCadastroPaciente.PROVISORIO ? true : false}
                                        estiloPersonalizado={`${tipoDeCadastro == TipoDeCadastroPaciente.PROVISORIO ? 'opacity-40' : 'opacity-100'} ${tipoDeCadastro == TipoDeCadastroPaciente.COMPLETO ? 'opacity-100' : ''}`}
                                    />
                                    <InputTexto
                                        label="Município de nascimento"
                                        id="municipioDeNascimento"
                                        nome="municipioDeNascimento"
                                        valor={municipioDeNascimento}
                                        setValor={setMunicipioDeNascimento}
                                        icone={<BsGeoAlt />}
                                        placeholder="Digite o município"
                                        campoObrigatorio={tipoDeCadastro === TipoDeCadastroPaciente.COMPLETO ? true : false}
                                        disabled={tipoDeCadastro === TipoDeCadastroPaciente.PROVISORIO ? true : false}
                                        estiloPersonalizado={`${tipoDeCadastro == TipoDeCadastroPaciente.PROVISORIO ? 'opacity-40' : 'opacity-100'} ${tipoDeCadastro == TipoDeCadastroPaciente.COMPLETO ? 'opacity-100' : ''}`}
                                    />
                                    <InputTexto
                                        label="UF de nascimento"
                                        id="ufDeNascimento"
                                        nome="ufDeNascimento"
                                        valor={ufDeNascimento}
                                        setValor={setUfDeNascimento}
                                        icone={<BsBuilding />}
                                        placeholder="Ex.: PR"
                                        campoObrigatorio={tipoDeCadastro === TipoDeCadastroPaciente.COMPLETO ? true : false}
                                        disabled={tipoDeCadastro === TipoDeCadastroPaciente.PROVISORIO ? true : false}
                                        estiloPersonalizado={`${tipoDeCadastro == TipoDeCadastroPaciente.PROVISORIO ? 'opacity-40' : 'opacity-100'} ${tipoDeCadastro == TipoDeCadastroPaciente.COMPLETO ? 'opacity-100' : ''}`}
                                    />
                                    <div className="col-span-3 grid grid-cols-2 gap-4">
                                        <InputSelect
                                            label="Tipo sanguíneo"
                                            id="tipoSanguineo"
                                            nome="tipoSanguineo"
                                            valor={tipoSanguineo}
                                            setValor={setTipoSanguineo}
                                            icone={<BsDroplet />}
                                            opcoes={opcoesDeTipoSanguineo}
                                            disabled={tipoDeCadastro === TipoDeCadastroPaciente.PROVISORIO ? true : false}
                                            estiloPersonalizado={`${tipoDeCadastro == TipoDeCadastroPaciente.PROVISORIO ? 'opacity-40' : 'opacity-100'} ${tipoDeCadastro == TipoDeCadastroPaciente.COMPLETO ? 'opacity-100' : ''}`}
                                        />
                                        <InputSelect
                                            label="Fator RH"
                                            id="fatorRH"
                                            nome="fatorRH"
                                            valor={fatorRH}
                                            setValor={setFatorRH}
                                            icone={<BsDroplet />}
                                            opcoes={opcoesFatorRH}
                                            disabled={tipoDeCadastro === TipoDeCadastroPaciente.PROVISORIO ? true : false}
                                            estiloPersonalizado={`${tipoDeCadastro == TipoDeCadastroPaciente.PROVISORIO ? 'opacity-40' : 'opacity-100'} ${tipoDeCadastro == TipoDeCadastroPaciente.COMPLETO ? 'opacity-100' : ''}`}
                                        />
                                    </div>
                                </div>
                            </section>

                            {/* OBSERVAÇÕES */}
                            <section className="flex flex-col">
                                <h3 className="font-semibold text-lg text-[var(--verde-escuro)]">
                                    Observações
                                </h3>
                                <div className="flex flex-col gap-1">
                                    <textarea
                                        id="observacoes"
                                        name="observacoes"
                                        value={observacoes}
                                        onChange={(e) => setObservacoes(e.target.value)}
                                        placeholder="Digite informações complementares sobre o paciente..."
                                        rows={4}
                                        className="w-full rounded-lg border border-gray-300 p-3 text-sm shadow-sm focus:outline-verde disabled:opacity-50 resize-y"
                                    />
                                </div>
                            </section>

                        </section>

                        {/* Responsavel pelo paciente */}
                        {
                            pacienteMenorDeIdade && (
                                <section className="flex flex-col">
                                    <h3 className="font-semibold text-lg text-[var(--verde-escuro)]">
                                        Dados do Responsavel pelo Paciente
                                    </h3>
                                    <div className="grid grid-cols-4 gap-4">
                                        <InputTexto
                                            label="Nome do responsável"
                                            id="nomeDoResponsavel"
                                            nome="nomeDoResponsavel"
                                            valor={nomeDoResponsavel}
                                            setValor={setNomeDoResponsavel}
                                            icone={<BsPerson />}
                                            placeholder="Nome completo do responsável"
                                            campoObrigatorio={tipoDeCadastro === TipoDeCadastroPaciente.COMPLETO ? true : false}
                                            disabled={tipoDeCadastro === TipoDeCadastroPaciente.PROVISORIO ? true : false}
                                            estiloPersonalizado={`${tipoDeCadastro == TipoDeCadastroPaciente.PROVISORIO ? 'opacity-40' : 'opacity-100'} ${tipoDeCadastro == TipoDeCadastroPaciente.COMPLETO ? 'opacity-100' : ''}`}
                                        />
                                        <InputTexto
                                            label="CPF do responsável"
                                            id="CPFDoResponsavel"
                                            nome="CPFDoResponsavel"
                                            valor={CPFDoResponsavel}
                                            setValor={setCPFDoResponsavel}
                                            icone={<BsPerson />}
                                            placeholder="000.000.000-00"
                                            campoObrigatorio={tipoDeCadastro === TipoDeCadastroPaciente.COMPLETO ? true : false}
                                            disabled={tipoDeCadastro === TipoDeCadastroPaciente.PROVISORIO ? true : false}
                                            estiloPersonalizado={`${tipoDeCadastro == TipoDeCadastroPaciente.PROVISORIO ? 'opacity-40' : 'opacity-100'} ${tipoDeCadastro == TipoDeCadastroPaciente.COMPLETO ? 'opacity-100' : ''}`}

                                        />
                                        <InputTexto
                                            label="Parentesco"
                                            id="parentescoDoResponsavel"
                                            nome="parentescoDoResponsavel"
                                            valor={parentescoDoResponsavel}
                                            setValor={setParentescoDoResponsavel}
                                            icone={<BsPeople />}
                                            placeholder="Ex.: Mãe, pai, avó..."
                                            campoObrigatorio={tipoDeCadastro === TipoDeCadastroPaciente.COMPLETO ? true : false}
                                            disabled={tipoDeCadastro === TipoDeCadastroPaciente.PROVISORIO ? true : false}
                                            estiloPersonalizado={`${tipoDeCadastro == TipoDeCadastroPaciente.PROVISORIO ? 'opacity-40' : 'opacity-100'} ${tipoDeCadastro == TipoDeCadastroPaciente.COMPLETO ? 'opacity-100' : ''}`}
                                        />
                                        <InputTexto
                                            label="Telefone do responsável"
                                            id="telefoneDoResponsavel"
                                            nome="telefoneDoResponsavel"
                                            valor={telefoneDoResponsavel}
                                            setValor={setTelefoneDoResponsavel}
                                            icone={<BsTelephone />}
                                            placeholder="(00) 00000-0000"
                                            campoObrigatorio={tipoDeCadastro === TipoDeCadastroPaciente.COMPLETO ? true : false}
                                            disabled={tipoDeCadastro === TipoDeCadastroPaciente.PROVISORIO ? true : false}
                                            estiloPersonalizado={`${tipoDeCadastro == TipoDeCadastroPaciente.PROVISORIO ? 'opacity-40' : 'opacity-100'} ${tipoDeCadastro == TipoDeCadastroPaciente.COMPLETO ? 'opacity-100' : ''}`}
                                        />

                                    </div>
                                </section>
                            )
                        }

                        {/* Contato */}
                        <section className="flex flex-col">
                            <h3 className="font-semibold text-lg text-[var(--verde-escuro)]">
                                Contato
                            </h3>
                            <div className="grid grid-cols-3 gap-4">
                                <InputTexto
                                    label="E-mail"
                                    id="email"
                                    nome="email"
                                    valor={email}
                                    setValor={setEmail}
                                    icone={<BsEnvelope />}
                                    placeholder="email@exemplo.com"
                                    campoObrigatorio={tipoDeCadastro === TipoDeCadastroPaciente.COMPLETO ? true : false}
                                    disabled={tipoDeCadastro === TipoDeCadastroPaciente.PROVISORIO ? true : false}
                                    estiloPersonalizado={`${tipoDeCadastro == TipoDeCadastroPaciente.PROVISORIO ? 'opacity-40' : 'opacity-100'} ${tipoDeCadastro == TipoDeCadastroPaciente.COMPLETO ? 'opacity-100' : ''}`}
                                />

                                <InputTexto
                                    label="Telefone"
                                    id="telefone"
                                    nome="telefone"
                                    valor={telefone}
                                    setValor={setTelefone}
                                    icone={<BsTelephone />}
                                    placeholder="(00) 00000-0000"
                                    disabled={tipoDeCadastro === TipoDeCadastroPaciente.PROVISORIO ? true : false}
                                    estiloPersonalizado={`${tipoDeCadastro == TipoDeCadastroPaciente.PROVISORIO ? 'opacity-40' : 'opacity-100'} ${tipoDeCadastro == TipoDeCadastroPaciente.COMPLETO ? 'opacity-100' : ''}`}
                                />

                                <InputTexto
                                    label="Telefone WhatsApp"
                                    id="telefoneWhatsApp"
                                    nome="telefoneWhatsApp"
                                    valor={telefoneWhatsApp}
                                    setValor={setTelefoneWhatsApp}
                                    icone={<BsWhatsapp />}
                                    placeholder="(00) 00000-0000"
                                    campoObrigatorio={tipoDeCadastro === TipoDeCadastroPaciente.COMPLETO ? true : false}
                                    disabled={tipoDeCadastro === TipoDeCadastroPaciente.PROVISORIO ? true : false}
                                    estiloPersonalizado={`${tipoDeCadastro == TipoDeCadastroPaciente.PROVISORIO ? 'opacity-40' : 'opacity-100'} ${tipoDeCadastro == TipoDeCadastroPaciente.COMPLETO ? 'opacity-100' : ''}`}
                                />

                                <InputTexto
                                    label="Nome do contato de emergência"
                                    id="nomeContatoEmergencia"
                                    nome="nomeContatoEmergencia"
                                    valor={nomeContatoEmergencia}
                                    setValor={setNomeContatoEmergencia}
                                    icone={<BsPerson />}
                                    placeholder="Nome completo"
                                    disabled={tipoDeCadastro === TipoDeCadastroPaciente.PROVISORIO ? true : false}
                                    estiloPersonalizado={`${tipoDeCadastro == TipoDeCadastroPaciente.PROVISORIO ? 'opacity-40' : 'opacity-100'} ${tipoDeCadastro == TipoDeCadastroPaciente.COMPLETO ? 'opacity-100' : ''}`}
                                />

                                <InputTexto
                                    label="Parentesco do contato de emergência"
                                    id="parentescoContatoEmergencia"
                                    nome="parentescoContatoEmergencia"
                                    valor={parentescoContatoEmergencia}
                                    setValor={setParentescoContatoEmergencia}
                                    icone={<BsPeople />}
                                    placeholder="Ex.: Irmão, cônjuge..."
                                    disabled={tipoDeCadastro === TipoDeCadastroPaciente.PROVISORIO ? true : false}
                                    estiloPersonalizado={`${tipoDeCadastro == TipoDeCadastroPaciente.PROVISORIO ? 'opacity-40' : 'opacity-100'} ${tipoDeCadastro == TipoDeCadastroPaciente.COMPLETO ? 'opacity-100' : ''} text-[.9em]`}
                                />

                                <InputTexto
                                    label="Telefone de emergência"
                                    id="telefoneDeEmergencia"
                                    nome="telefoneDeEmergencia"
                                    valor={telefoneDeEmergencia}
                                    setValor={setTelefoneDeEmergencia}
                                    icone={<BsTelephone />}
                                    placeholder="(00) 00000-0000"
                                    disabled={tipoDeCadastro === TipoDeCadastroPaciente.PROVISORIO ? true : false}
                                    estiloPersonalizado={`${tipoDeCadastro == TipoDeCadastroPaciente.PROVISORIO ? 'opacity-40' : 'opacity-100'} ${tipoDeCadastro == TipoDeCadastroPaciente.COMPLETO ? 'opacity-100' : ''}`}
                                />
                            </div>
                        </section>

                        {/* Documentos */}
                        <section className="flex flex-col">
                            <h3 className="font-semibold text-lg text-[var(--verde-escuro)]">
                                Documentos
                            </h3>
                            <div className="grid grid-cols-3 gap-4">
                                <InputTexto
                                    label="CPF"
                                    id="CPF"
                                    nome="CPF"
                                    valor={CPF}
                                    setValor={setCPF}
                                    icone={<BsPerson />}
                                    placeholder="000.000.000-00"
                                    campoObrigatorio={tipoDeCadastro === TipoDeCadastroPaciente.PROVISORIO || TipoDeCadastroPaciente.COMPLETO ? true : false}
                                />

                                <InputTexto
                                    label="Cartão Nacional de Saúde (CNS)"
                                    id="cartaoDoSus"
                                    nome="cartaoDoSus"
                                    valor={cartaoDoSus}
                                    setValor={setCartaoDoSus}
                                    icone={<BsCreditCard />}
                                    placeholder="Número do cartão SUS"
                                    campoObrigatorio={tipoDeCadastro === TipoDeCadastroPaciente.COMPLETO ? true : false}
                                    disabled={tipoDeCadastro === TipoDeCadastroPaciente.PROVISORIO ? true : false}
                                    estiloPersonalizado={`${tipoDeCadastro == TipoDeCadastroPaciente.PROVISORIO ? 'opacity-40' : 'opacity-100'} ${tipoDeCadastro == TipoDeCadastroPaciente.COMPLETO ? 'opacity-100' : ''}`}
                                />

                                <InputTexto
                                    label="NIS"
                                    id="NIS"
                                    nome="NIS"
                                    valor={NIS}
                                    setValor={setNIS}
                                    icone={<BsCreditCard />}
                                    placeholder="Número do NIS"
                                    disabled={tipoDeCadastro === TipoDeCadastroPaciente.PROVISORIO ? true : false}
                                    estiloPersonalizado={`${tipoDeCadastro == TipoDeCadastroPaciente.PROVISORIO ? 'opacity-40' : 'opacity-100'} ${tipoDeCadastro == TipoDeCadastroPaciente.COMPLETO ? 'opacity-100' : ''}`}
                                />

                                <InputTexto
                                    label="RG"
                                    id="RG"
                                    nome="RG"
                                    valor={RG}
                                    setValor={setRG}
                                    icone={<BsPerson />}
                                    placeholder="Número do RG"
                                    campoObrigatorio={tipoDeCadastro === TipoDeCadastroPaciente.COMPLETO ? true : false}
                                    disabled={tipoDeCadastro === TipoDeCadastroPaciente.PROVISORIO ? true : false}
                                    estiloPersonalizado={`${tipoDeCadastro == TipoDeCadastroPaciente.PROVISORIO ? 'opacity-40' : 'opacity-100'} ${tipoDeCadastro == TipoDeCadastroPaciente.COMPLETO ? 'opacity-100' : ''}`}
                                />

                                <InputTexto
                                    label="Órgão emissor do RG"
                                    id="orgaoEmissorDoRG"
                                    nome="orgaoEmissorDoRG"
                                    valor={orgaoEmissorDoRG}
                                    setValor={setOrgaoEmissorDoRG}
                                    icone={<BsBuilding />}
                                    placeholder="Ex.: SSP"
                                    campoObrigatorio={tipoDeCadastro === TipoDeCadastroPaciente.COMPLETO ? true : false}
                                    disabled={tipoDeCadastro === TipoDeCadastroPaciente.PROVISORIO ? true : false}
                                    estiloPersonalizado={`${tipoDeCadastro == TipoDeCadastroPaciente.PROVISORIO ? 'opacity-40' : 'opacity-100'} ${tipoDeCadastro == TipoDeCadastroPaciente.COMPLETO ? 'opacity-100' : ''}`}
                                />

                                <InputSelect
                                    label="UF do RG"
                                    id="ufDoRG"
                                    nome="ufDoRG"
                                    valor={ufDoRG}
                                    setValor={setUfDoRG}
                                    icone={<BsGeoAlt />}
                                    opcoes={opcoesDeUF}
                                    campoObrigatorio={tipoDeCadastro === TipoDeCadastroPaciente.COMPLETO ? true : false}
                                    disabled={tipoDeCadastro === TipoDeCadastroPaciente.PROVISORIO ? true : false}
                                    estiloPersonalizado={`${tipoDeCadastro == TipoDeCadastroPaciente.PROVISORIO ? 'opacity-40' : 'opacity-100'} ${tipoDeCadastro == TipoDeCadastroPaciente.COMPLETO ? 'opacity-100' : ''}`}
                                />

                                <InputData
                                    label="Data de emissão do RG"
                                    id="dataDaEmissaoDoRG"
                                    nome="dataDaEmissaoDoRG"
                                    valor={dataDaEmissaoDoRG}
                                    setValor={setdataDaEmissaoDoRG}
                                    icone={<BsCalendarDate />}
                                    placeholder="Data de emissão"
                                    campoObrigatorio={tipoDeCadastro === TipoDeCadastroPaciente.COMPLETO ? true : false}
                                    disabled={tipoDeCadastro === TipoDeCadastroPaciente.PROVISORIO ? true : false}
                                    estiloPersonalizado={`${tipoDeCadastro == TipoDeCadastroPaciente.PROVISORIO ? 'opacity-40' : 'opacity-100'} ${tipoDeCadastro == TipoDeCadastroPaciente.COMPLETO ? 'opacity-100' : ''}`}
                                />

                                <InputTexto
                                    label="CNS da mãe"
                                    id="cnsMae"
                                    nome="cnsMae"
                                    valor={cnsMae}
                                    setValor={setCnsMae}
                                    icone={<BsPerson />}
                                    placeholder="Cartão SUS da mãe"
                                    disabled={tipoDeCadastro === TipoDeCadastroPaciente.PROVISORIO ? true : false}
                                    estiloPersonalizado={`${tipoDeCadastro == TipoDeCadastroPaciente.PROVISORIO ? 'opacity-40' : 'opacity-100'} ${tipoDeCadastro == TipoDeCadastroPaciente.COMPLETO ? 'opacity-100' : ''}`}
                                />

                                <InputTexto
                                    label="Título de eleitor"
                                    id="tituloDeEleitor"
                                    nome="tituloDeEleitor"
                                    valor={tituloDeEleitor}
                                    setValor={setTituloDeEleitor}
                                    icone={<BsCardChecklist />}
                                    placeholder="Número do título"
                                    disabled={tipoDeCadastro === TipoDeCadastroPaciente.PROVISORIO ? true : false}
                                    estiloPersonalizado={`${tipoDeCadastro == TipoDeCadastroPaciente.PROVISORIO ? 'opacity-40' : 'opacity-100'} ${tipoDeCadastro == TipoDeCadastroPaciente.COMPLETO ? 'opacity-100' : ''}`}
                                />

                                <InputTexto
                                    label="Zona eleitoral"
                                    id="zonaEleitoral"
                                    nome="zonaEleitoral"
                                    valor={zonaEleitoral}
                                    setValor={setZonaEleitoral}
                                    icone={<BsCardChecklist />}
                                    placeholder="Número da zona"
                                    disabled={tipoDeCadastro === TipoDeCadastroPaciente.PROVISORIO ? true : false}
                                    estiloPersonalizado={`${tipoDeCadastro == TipoDeCadastroPaciente.PROVISORIO ? 'opacity-40' : 'opacity-100'} ${tipoDeCadastro == TipoDeCadastroPaciente.COMPLETO ? 'opacity-100' : ''}`}
                                />

                                <InputTexto
                                    label="Seção eleitoral"
                                    id="secaoEleitoral"
                                    nome="secaoEleitoral"
                                    valor={secaoEleitoral}
                                    setValor={setSecaoEleitoral}
                                    icone={<BsCardChecklist />}
                                    placeholder="Número da seção"
                                    disabled={tipoDeCadastro === TipoDeCadastroPaciente.PROVISORIO ? true : false}
                                    estiloPersonalizado={`${tipoDeCadastro == TipoDeCadastroPaciente.PROVISORIO ? 'opacity-40' : 'opacity-100'} ${tipoDeCadastro == TipoDeCadastroPaciente.COMPLETO ? 'opacity-100' : ''}`}
                                />
                            </div>
                        </section>

                        {/* Dados Trabalhistas */}
                        <section className="flex flex-col">
                            <h3 className="font-semibold text-lg text-[var(--verde-escuro)]">
                                Dados Trabalhistas
                            </h3>
                            <div className="grid grid-cols-3 gap-4">
                                <InputTexto
                                    label="Número da CTPS"
                                    id="CTPSNumero"
                                    nome="CTPSNumero"
                                    valor={CTPSNumero}
                                    setValor={setCTPSNumero}
                                    icone={<BsBriefcase />}
                                    placeholder="Número da carteira de trabalho"
                                    disabled={tipoDeCadastro === TipoDeCadastroPaciente.PROVISORIO ? true : false}
                                    estiloPersonalizado={`${tipoDeCadastro == TipoDeCadastroPaciente.PROVISORIO ? 'opacity-40' : 'opacity-100'} ${tipoDeCadastro == TipoDeCadastroPaciente.COMPLETO ? 'opacity-100' : ''}`}
                                />

                                <InputTexto
                                    label="Série da CTPS"
                                    id="CTPSSerie"
                                    nome="CTPSSerie"
                                    valor={CTPSSerie}
                                    setValor={setCTPSSerie}
                                    icone={<BsBriefcase />}
                                    placeholder="Série"
                                    disabled={tipoDeCadastro === TipoDeCadastroPaciente.PROVISORIO ? true : false}
                                    estiloPersonalizado={`${tipoDeCadastro == TipoDeCadastroPaciente.PROVISORIO ? 'opacity-40' : 'opacity-100'} ${tipoDeCadastro == TipoDeCadastroPaciente.COMPLETO ? 'opacity-100' : ''}`}
                                />

                                <InputSelect
                                    label="UF da CTPS"
                                    id="cTPSUf"
                                    nome="cTPSUf"
                                    valor={cTPSUf}
                                    setValor={setCTPSUf}
                                    icone={<BsGeoAlt />}
                                    opcoes={opcoesDeUF}
                                    disabled={tipoDeCadastro === TipoDeCadastroPaciente.PROVISORIO ? true : false}
                                    estiloPersonalizado={`${tipoDeCadastro == TipoDeCadastroPaciente.PROVISORIO ? 'opacity-40' : 'opacity-100'} ${tipoDeCadastro == TipoDeCadastroPaciente.COMPLETO ? 'opacity-100' : ''}`}
                                />

                                <InputData
                                    label="Data de emissão da CTPS"
                                    id="CTPSDataEmissao"
                                    nome="CTPSDataEmissao"
                                    valor={CTPSDataEmissao}
                                    setValor={setCTPSDataEmissao}
                                    icone={<BsCalendarDate />}
                                    placeholder="Data de emissão"
                                    disabled={tipoDeCadastro === TipoDeCadastroPaciente.PROVISORIO ? true : false}
                                    estiloPersonalizado={`${tipoDeCadastro == TipoDeCadastroPaciente.PROVISORIO ? 'opacity-40' : 'opacity-100'} ${tipoDeCadastro == TipoDeCadastroPaciente.COMPLETO ? 'opacity-100' : ''}`}
                                />

                                <InputTexto
                                    label="PIS/PASEP"
                                    id="PISPASEP"
                                    nome="PISPASEP"
                                    valor={PISPASEP}
                                    setValor={setPISPASEP}
                                    icone={<BsCreditCard />}
                                    placeholder="Número do PIS/PASEP"
                                    disabled={tipoDeCadastro === TipoDeCadastroPaciente.PROVISORIO ? true : false}
                                    estiloPersonalizado={`${tipoDeCadastro == TipoDeCadastroPaciente.PROVISORIO ? 'opacity-40' : 'opacity-100'} ${tipoDeCadastro == TipoDeCadastroPaciente.COMPLETO ? 'opacity-100' : ''}`}
                                />
                            </div>
                        </section>

                        <section className="flex flex-col">
                            <h3 className="font-semibold text-lg text-[var(--verde-escuro)]">
                                Dados Educacionais
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                <InputSelect
                                    label="Frequenta escola?"
                                    id="frequentaEscola"
                                    nome="frequentaEscola"
                                    valor={frequentaEscola}
                                    setValor={setFrequentaEscola}
                                    icone={<BsMortarboard />}
                                    opcoes={opcoesSimNao}
                                    disabled={tipoDeCadastro === TipoDeCadastroPaciente.PROVISORIO ? true : false}
                                    estiloPersonalizado={`${tipoDeCadastro == TipoDeCadastroPaciente.PROVISORIO ? 'opacity-40' : 'opacity-100'} ${tipoDeCadastro == TipoDeCadastroPaciente.COMPLETO ? 'opacity-100' : ''}`}
                                />

                                <InputTexto
                                    label="Escola"
                                    id="escola"
                                    nome="escola"
                                    valor={escola}
                                    setValor={setEscola}
                                    icone={<BsBuilding />}
                                    placeholder="Nome da instituição de ensino"
                                    disabled={tipoDeCadastro === TipoDeCadastroPaciente.PROVISORIO ? true : false}
                                    estiloPersonalizado={`${tipoDeCadastro == TipoDeCadastroPaciente.PROVISORIO ? 'opacity-40' : 'opacity-100'} ${tipoDeCadastro == TipoDeCadastroPaciente.COMPLETO ? 'opacity-100' : ''}`}
                                />

                                <InputTexto
                                    label="Série escolar"
                                    id="serieEscolar"
                                    nome="serieEscolar"
                                    valor={serieEscolar}
                                    setValor={setSerieEscolar}
                                    icone={<BsBook />}
                                    placeholder="Ex.: 5º ano"
                                    disabled={tipoDeCadastro === TipoDeCadastroPaciente.PROVISORIO ? true : false}
                                    estiloPersonalizado={`${tipoDeCadastro == TipoDeCadastroPaciente.PROVISORIO ? 'opacity-40' : 'opacity-100'} ${tipoDeCadastro == TipoDeCadastroPaciente.COMPLETO ? 'opacity-100' : ''}`}
                                />

                                <InputSelect
                                    label="Grau de escolaridade"
                                    id="grauEscolaridade"
                                    nome="grauEscolaridade"
                                    valor={grauEscolaridade}
                                    setValor={setGrauEscolaridade}
                                    icone={<BsMortarboard />}
                                    opcoes={opcoesDeGrauEscolaridade}
                                    disabled={tipoDeCadastro === TipoDeCadastroPaciente.PROVISORIO ? true : false}
                                    estiloPersonalizado={`${tipoDeCadastro == TipoDeCadastroPaciente.PROVISORIO ? 'opacity-40' : 'opacity-100'} ${tipoDeCadastro == TipoDeCadastroPaciente.COMPLETO ? 'opacity-100' : ''}`}
                                />

                                <InputTexto
                                    label="Curso profissionalizante"
                                    id="cursoProfissionalizante"
                                    nome="cursoProfissionalizante"
                                    valor={cursoProfissionalizante}
                                    setValor={setCursoProfissionalizante}
                                    icone={<BsJournalBookmark />}
                                    placeholder="Nome do curso"
                                    disabled={tipoDeCadastro === TipoDeCadastroPaciente.PROVISORIO ? true : false}
                                    estiloPersonalizado={`${tipoDeCadastro == TipoDeCadastroPaciente.PROVISORIO ? 'opacity-40' : 'opacity-100'} ${tipoDeCadastro == TipoDeCadastroPaciente.COMPLETO ? 'opacity-100' : ''}`}
                                />
                            </div>
                        </section>

                        <section>
                            <h3 className="font-semibold text-lg text-[var(--verde-escuro)]">
                                Naturalização
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                <InputTexto
                                    label="País de origem"
                                    id="paisDeOrigem"
                                    nome="paisDeOrigem"
                                    valor={paisDeOrigem}
                                    setValor={setpaisDeOrigem}
                                    icone={<BsGlobe />}
                                    placeholder="País de origem"
                                    disabled={tipoDeCadastro === TipoDeCadastroPaciente.PROVISORIO ? true : false}
                                    estiloPersonalizado={`${tipoDeCadastro == TipoDeCadastroPaciente.PROVISORIO ? 'opacity-40' : 'opacity-100'} ${tipoDeCadastro == TipoDeCadastroPaciente.COMPLETO ? 'opacity-100' : ''}`}
                                />
                                <InputData
                                    label="Data de entrada no Brasil"
                                    id="entradaNoBrasil"
                                    nome="entradaNoBrasil"
                                    valor={entradaNoBrasil}
                                    setValor={setEntradaNoBrasil}
                                    icone={<BsCalendarDate />}
                                    placeholder="Data de entrada"
                                    disabled={tipoDeCadastro === TipoDeCadastroPaciente.PROVISORIO ? true : false}
                                    estiloPersonalizado={`${tipoDeCadastro == TipoDeCadastroPaciente.PROVISORIO ? 'opacity-40' : 'opacity-100'} ${tipoDeCadastro == TipoDeCadastroPaciente.COMPLETO ? 'opacity-100' : ''}`}
                                />
                            </div>
                        </section>

                        <section>
                            <h3 className="font-semibold text-lg text-[var(--verde-escuro)]">
                                Endereço e Localidade
                            </h3>
                            <div className="grid grid-cols-3 gap-4">
                                <InputTexto
                                    label="País"
                                    id="pais"
                                    nome="pais"
                                    valor={pais}
                                    setValor={setPais}
                                    icone={<BsGlobe />}
                                    placeholder="País"
                                    campoObrigatorio={tipoDeCadastro === TipoDeCadastroPaciente.COMPLETO ? true : false}
                                    disabled={tipoDeCadastro === TipoDeCadastroPaciente.PROVISORIO ? true : false}
                                    estiloPersonalizado={`${tipoDeCadastro == TipoDeCadastroPaciente.PROVISORIO ? 'opacity-40' : 'opacity-100'} ${tipoDeCadastro == TipoDeCadastroPaciente.COMPLETO ? 'opacity-100' : ''}`}
                                />
                                <InputSelect
                                    label="UF"
                                    id="UF"
                                    nome="UF"
                                    valor={UF}
                                    setValor={setUF}
                                    icone={<BsGeoAlt />}
                                    opcoes={opcoesDeUF}
                                    campoObrigatorio={tipoDeCadastro === TipoDeCadastroPaciente.COMPLETO ? true : false}
                                    disabled={tipoDeCadastro === TipoDeCadastroPaciente.PROVISORIO ? true : false}
                                    estiloPersonalizado={`${tipoDeCadastro == TipoDeCadastroPaciente.PROVISORIO ? 'opacity-40' : 'opacity-100'} ${tipoDeCadastro == TipoDeCadastroPaciente.COMPLETO ? 'opacity-100' : ''}`}
                                />
                                <InputTexto
                                    label="Município"
                                    id="municipio"
                                    nome="municipio"
                                    valor={municipio}
                                    setValor={setMunicipio}
                                    icone={<BsBuilding />}
                                    placeholder="Nome do município"
                                    campoObrigatorio={tipoDeCadastro === TipoDeCadastroPaciente.COMPLETO ? true : false}
                                    disabled={tipoDeCadastro === TipoDeCadastroPaciente.PROVISORIO ? true : false}
                                    estiloPersonalizado={`${tipoDeCadastro == TipoDeCadastroPaciente.PROVISORIO ? 'opacity-40' : 'opacity-100'} ${tipoDeCadastro == TipoDeCadastroPaciente.COMPLETO ? 'opacity-100' : ''}`}
                                />
                                <InputTexto
                                    label="Bairro"
                                    id="bairro"
                                    nome="bairro"
                                    valor={bairro}
                                    setValor={setBairro}
                                    icone={<BsGeoAlt />}
                                    placeholder="Nome do bairro"
                                    campoObrigatorio={tipoDeCadastro === TipoDeCadastroPaciente.COMPLETO ? true : false}
                                    disabled={tipoDeCadastro === TipoDeCadastroPaciente.PROVISORIO ? true : false}
                                    estiloPersonalizado={`${tipoDeCadastro == TipoDeCadastroPaciente.PROVISORIO ? 'opacity-40' : 'opacity-100'} ${tipoDeCadastro == TipoDeCadastroPaciente.COMPLETO ? 'opacity-100' : ''}`}
                                />
                                <InputTexto
                                    label="Rua"
                                    id="rua"
                                    nome="rua"
                                    valor={rua}
                                    setValor={setRua}
                                    icone={<BsSignpost />}
                                    placeholder="Nome da rua"
                                    campoObrigatorio={tipoDeCadastro === TipoDeCadastroPaciente.COMPLETO ? true : false}
                                    disabled={tipoDeCadastro === TipoDeCadastroPaciente.PROVISORIO ? true : false}
                                    estiloPersonalizado={`${tipoDeCadastro == TipoDeCadastroPaciente.PROVISORIO ? 'opacity-40' : 'opacity-100'} ${tipoDeCadastro == TipoDeCadastroPaciente.COMPLETO ? 'opacity-100' : ''}`}
                                />
                                <InputTexto
                                    label="Número"
                                    id="numero"
                                    nome="numero"
                                    valor={numero}
                                    setValor={setNumero}
                                    icone={<BsHouse />}
                                    placeholder="Número do imóvel"
                                    campoObrigatorio={tipoDeCadastro === TipoDeCadastroPaciente.COMPLETO ? true : false}
                                    disabled={tipoDeCadastro === TipoDeCadastroPaciente.PROVISORIO ? true : false}
                                    estiloPersonalizado={`${tipoDeCadastro == TipoDeCadastroPaciente.PROVISORIO ? 'opacity-40' : 'opacity-100'} ${tipoDeCadastro == TipoDeCadastroPaciente.COMPLETO ? 'opacity-100' : ''}`}
                                />
                                <InputTexto
                                    label="Complemento"
                                    id="complemento"
                                    nome="complemento"
                                    valor={complemento}
                                    setValor={setComplemento}
                                    icone={<BsHouseDoor />}
                                    placeholder="Apartamento, casa, bloco..."
                                    campoObrigatorio={tipoDeCadastro === TipoDeCadastroPaciente.COMPLETO ? true : false}
                                    disabled={tipoDeCadastro === TipoDeCadastroPaciente.PROVISORIO ? true : false}
                                    estiloPersonalizado={`${tipoDeCadastro == TipoDeCadastroPaciente.PROVISORIO ? 'opacity-40' : 'opacity-100'} ${tipoDeCadastro == TipoDeCadastroPaciente.COMPLETO ? 'opacity-100' : ''}`}
                                />
                                <InputTexto
                                    label="CEP"
                                    id="CEP"
                                    nome="CEP"
                                    valor={CEP}
                                    setValor={setCEP}
                                    icone={<BsGeoAlt />}
                                    placeholder="00000-000"
                                    campoObrigatorio={tipoDeCadastro === TipoDeCadastroPaciente.COMPLETO ? true : false}
                                    disabled={tipoDeCadastro === TipoDeCadastroPaciente.PROVISORIO ? true : false}
                                    estiloPersonalizado={`${tipoDeCadastro == TipoDeCadastroPaciente.PROVISORIO ? 'opacity-40' : 'opacity-100'} ${tipoDeCadastro == TipoDeCadastroPaciente.COMPLETO ? 'opacity-100' : ''}`}
                                />
                                <InputSelect
                                    label="Tipo de logradouro"
                                    id="tipoLogradouro"
                                    nome="tipoLogradouro"
                                    valor={tipoLogradouro}
                                    setValor={setTipoLogradouro}
                                    icone={<BsSignpost />}
                                    opcoes={opcoesDeTipoLogradouro}
                                    campoObrigatorio={tipoDeCadastro === TipoDeCadastroPaciente.COMPLETO ? true : false}
                                    disabled={tipoDeCadastro === TipoDeCadastroPaciente.PROVISORIO ? true : false}
                                    estiloPersonalizado={`${tipoDeCadastro == TipoDeCadastroPaciente.PROVISORIO ? 'opacity-40' : 'opacity-100'} ${tipoDeCadastro == TipoDeCadastroPaciente.COMPLETO ? 'opacity-100' : ''}`}
                                />
                                <InputTexto
                                    label="Ponto de referência"
                                    id="pontoDeReferencia"
                                    nome="pontoDeReferencia"
                                    valor={pontoDeReferencia}
                                    setValor={setPontoDeReferencia}
                                    icone={<BsPinMap />}
                                    placeholder="Próximo a..."
                                    disabled={tipoDeCadastro === TipoDeCadastroPaciente.PROVISORIO ? true : false}
                                    estiloPersonalizado={`${tipoDeCadastro == TipoDeCadastroPaciente.PROVISORIO ? 'opacity-40' : 'opacity-100'} ${tipoDeCadastro == TipoDeCadastroPaciente.COMPLETO ? 'opacity-100' : ''}`}
                                />
                                <InputTexto
                                    label="Latitude"
                                    id="latitude"
                                    nome="latitude"
                                    valor={latitude}
                                    setValor={setLatitude}
                                    icone={<BsGeo />}
                                    placeholder="Latitude"
                                    disabled={tipoDeCadastro === TipoDeCadastroPaciente.PROVISORIO ? true : false}
                                    estiloPersonalizado={`${tipoDeCadastro == TipoDeCadastroPaciente.PROVISORIO ? 'opacity-40' : 'opacity-100'} ${tipoDeCadastro == TipoDeCadastroPaciente.COMPLETO ? 'opacity-100' : ''}`}
                                />
                                <InputTexto
                                    label="Longitude"
                                    id="longitude"
                                    nome="longitude"
                                    valor={longitude}
                                    setValor={setLongitude}
                                    icone={<BsGeo />}
                                    placeholder="Longitude"
                                    disabled={tipoDeCadastro === TipoDeCadastroPaciente.PROVISORIO ? true : false}
                                    estiloPersonalizado={`${tipoDeCadastro == TipoDeCadastroPaciente.PROVISORIO ? 'opacity-40' : 'opacity-100'} ${tipoDeCadastro == TipoDeCadastroPaciente.COMPLETO ? 'opacity-100' : ''}`}
                                />
                                <InputSelect
                                    label="Zona"
                                    id="zona"
                                    nome="zona"
                                    valor={zona}
                                    setValor={setZona}
                                    icone={<BsMap />}
                                    opcoes={opcoesDeZona}
                                    disabled={tipoDeCadastro === TipoDeCadastroPaciente.PROVISORIO ? true : false}
                                    estiloPersonalizado={`${tipoDeCadastro == TipoDeCadastroPaciente.PROVISORIO ? 'opacity-40' : 'opacity-100'} ${tipoDeCadastro == TipoDeCadastroPaciente.COMPLETO ? 'opacity-100' : ''}`}
                                />
                            </div>
                        </section>

                        <section>
                            <h3 className="font-semibold text-lg text-[var(--verde-escuro)]">
                                Informações adicionais
                            </h3>
                            <div className="flex flex-col gap-4">
                                <div>
                                    <InputCheckbox
                                        label="Possui deficiência?"
                                        id="possuiDeficiencia"
                                        nome="possuiDeficiencia"
                                        valor={possuiDeficiencia}
                                        setValor={setPossuiDeficiencia}
                                    />
                                    {possuiDeficiencia && (
                                        <div className="grid grid-cols-2 gap-3 rounded-lg border border-gray-200 p-4">
                                            <p className="col-span-2 font-medium">
                                                Tipo de deficiência
                                            </p>

                                            {opcoesDeDeficiencia.map((opcao) => (
                                                <InputCheckbox
                                                    key={opcao.valor}
                                                    label={opcao.label}
                                                    id={`deficiencia-${opcao.valor}`}
                                                    nome="tipoDeDeficiencia"
                                                    valor={tipoDeDeficiencia.includes(opcao.valor)}
                                                    setValor={(marcado) => {
                                                        setTipoDeDeficiencia((anterior) =>
                                                            marcado
                                                                ? [...anterior, opcao.valor]
                                                                : anterior.filter((item) => item !== opcao.valor)
                                                        )
                                                    }}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <InputCheckbox
                                    label="Paciente ativo"
                                    id="pacienteAtivo"
                                    nome="pacienteAtivo"
                                    valor={pacienteAtivo}
                                    setValor={setPacienteAtivo}
                                />
                            </div>
                        </section>
                        
                        <div className="flex items-center gap-3 ml-auto text-verde-escuro">
                            <button
                                type="button"
                                className="flex items-center gap-2 font-bold rounded-lg border border-red-600 text-red-600 p-2 px-4 transition-all duration-300 cursor-pointer hover:text-white hover:bg-red-600"

                            >
                                <AiOutlineClear className="text-2xl" />
                                <p>Limpar</p>
                            </button>
                            <button
                                type="submit"
                                className="flex items-center gap-2 font-bold rounded-lg border border-verde p-2 px-4 transition-all duration-300 cursor-pointer hover:text-white hover:bg-verde"
                            >
                                <HiSaveAs className="text-2xl" />
                                <p>Salvar</p>
                            </button>
                        </div>
                    </div>
                </Dialog>
            </div>
        </Template>
    )
}