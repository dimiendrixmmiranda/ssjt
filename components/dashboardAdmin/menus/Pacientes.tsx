import InputSelect from "@/components/assets/InputSelect";
import InputTexto from "@/components/assets/InputTexto";
import { useState } from "react";
import { AiOutlineSelect, AiOutlineUserAdd } from "react-icons/ai";
import { IoAdd, IoClose } from "react-icons/io5";
import { MdDriveFileRenameOutline } from "react-icons/md";
import { RiMenuSearchLine } from "react-icons/ri";
import { Dialog } from "primereact/dialog";
import { FiUserPlus } from "react-icons/fi";
import { FaRegUser } from "react-icons/fa";
import Image from "next/image";
import InputCheckbox from "@/components/assets/InputCheckbox";

enum TipoDeDado {
    NOME = "NOME",
    DATA_DE_NASCIMENTO = "DATA_DE_NASCIMENTO",
    CPF = "CPF",
    CARTAO_SUS = "CARTAO_SUS",
    NOME_DA_MAE = "NOME_DA_MAE",
}
enum Condicao {
    CONTEM = "CONTEM",
    MAIOR_QUE = "MAIOR_QUE",
    MENOR_QUE = "MENOR_QUE",
    IGUAL = "IGUAL",
}

interface TipoDeDadoOption {
    valor: TipoDeDado;
    label: string;
}
interface CondicaoOption {
    valor: Condicao;
    label: string;
}
export default function Pacientes() {
    const [tipoDeDado, setTipoDeDado] = useState<TipoDeDado>()
    const [condicao, setCondicao] = useState<Condicao>()
    const [valor, setValor] = useState('')
    const [visible, setVisible] = useState(false);

    // INFORMAÇÕES PESSOAIS
    const [nome, setNome] = useState('')
    const [nomeSocial, setNomeSocial] = useState('')
    const [declaroNaoPossuirNomeSocial, setDeclaroNaoPossuirNomeSocial] = useState(false)
    const [nomeDaMae, setNomeDaMae] = useState('')
    const [nomeDoPai, setNomeDoPai] = useState('')
    const [dataDeNascimento, setDataDeNascimento] = useState('')
    const [sexo, setSexo] = useState('')
    const [estadoCivil, setEstadoCivil] = useState('')
    const [corRaça, setCorRaça] = useState('')
    const [cpf, setCpf] = useState('')
    const [cartaoSus, setCartaoSus] = useState('')
    const [codigoGsus, setCodigoGsus] = useState('')
    const [codigoIds, setCodigoIds] = useState('')
    const [nis, setNis] = useState('')
    const [unidadeDeSaude, setUnidadeDeSaude] = useState('')
    const [tipoSanguineo, setTipoSanguineo] = useState('')
    const [fatorRh, setFatorRh] = useState('')
    const [situacaoFamiliar, setSituacaoFamiliar] = useState('')
    const [povoTradicional, setPovoTradicional] = useState('')
    const [religiao, setReligiao] = useState('')
    const [observacoes, setObservacoes] = useState('')

    // DOCUMENTOS
    const [rg, setRg] = useState('')
    const [orgaoEmissor, setOrgaoEmissor] = useState('')
    const [ufRg, setUfRg] = useState('')
    const [dataEmissaoRg, setDataEmissaoRg] = useState('')
    const [cpfRegular, setCpfRegular] = useState('')
    const [cpfCns, setCpfCns] = useState('')
    const [cnsMae, setCnsMae] = useState('')
    const [orientacaoRegCpf, setOrientacaoRegCpf] = useState('')

    const [tituloEleitor, setTituloEleitor] = useState('')
    const [zonaEleitoral, setZonaEleitoral] = useState('')
    const [secaoEleitoral, setSecaoEleitoral] = useState('')

    // TRABALHISTA
    const [ctpsNumero, setCtpsNumero] = useState('')
    const [ctpsSerie, setCtpsSerie] = useState('')
    const [ctpsUf, setCtpsUf] = useState('')
    const [ctpsDataEmissao, setCtpsDataEmissao] = useState('')
    const [pisPasep, setPisPasep] = useState('')

    // EDUCAÇÃO
    const [frequentaEscola, setFrequentaEscola] = useState('')
    const [escola, setEscola] = useState('')
    const [serieEscolar, setSerieEscolar] = useState('')
    const [grauEscolaridade, setGrauEscolaridade] = useState('')
    const [cursoProfissionalizante, setCursoProfissionalizante] = useState('')

    // NATURALIZAÇÃO
    const [paisOrigem, setPaisOrigem] = useState('')
    const [entradaBrasil, setEntradaBrasil] = useState('')
    const [numeroPortaria, setNumeroPortaria] = useState('')
    const [dataNaturalizacao, setDataNaturalizacao] = useState('')

    // LOCALIDADE
    const [pais, setPais] = useState('')
    const [uf, setUf] = useState('')
    const [municipio, setMunicipio] = useState('')
    const [bairro, setBairro] = useState('')
    const [rua, setRua] = useState('')
    const [numero, setNumero] = useState('')
    const [complemento, setComplemento] = useState('')

    // GEOLOCALIZAÇÃO
    const [latitude, setLatitude] = useState('')
    const [longitude, setLongitude] = useState('')
    const [zona, setZona] = useState('')



    const tiposDeDados: TipoDeDadoOption[] = [
        {
            valor: TipoDeDado.NOME,
            label: "Nome",
        },
        {
            valor: TipoDeDado.CPF,
            label: "CPF",
        },
        {
            valor: TipoDeDado.CARTAO_SUS,
            label: "Cartão SUS",
        },
    ]
    const tiposDeCondicoes: CondicaoOption[] = [
        {
            valor: Condicao.CONTEM,
            label: "Contem",
        },
        {
            valor: Condicao.IGUAL,
            label: "Igual",
        },
        {
            valor: Condicao.MAIOR_QUE,
            label: "Maior Que",
        },
        {
            valor: Condicao.MENOR_QUE,
            label: "Menor Que",
        },
    ]

    const opcoesSexo = [
        { valor: "MASCULINO", label: "Masculino" },
        { valor: "FEMININO", label: "Feminino" },
        { valor: "OUTRO", label: "Outro" },
        { valor: "NAO_INFORMADO", label: "Não informado" },
    ]

    const opcoesEstadoCivil = [
        { valor: "SOLTEIRO", label: "Solteiro(a)" },
        { valor: "CASADO", label: "Casado(a)" },
        { valor: "DIVORCIADO", label: "Divorciado(a)" },
        { valor: "VIUVO", label: "Viúvo(a)" },
        { valor: "SEPARADO", label: "Separado(a)" },
        { valor: "UNIAO_ESTAVEL", label: "União estável" },
    ]

    const opcoesCorRaca = [
        { valor: "BRANCA", label: "Branca" },
        { valor: "PRETA", label: "Preta" },
        { valor: "PARDA", label: "Parda" },
        { valor: "AMARELA", label: "Amarela" },
        { valor: "INDIGENA", label: "Indígena" },
        { valor: "NAO_INFORMADO", label: "Não informado" },
    ]

    const opcoesTipoSanguineo = [
        { valor: "A", label: "A" },
        { valor: "B", label: "B" },
        { valor: "AB", label: "AB" },
        { valor: "O", label: "O" },
    ]

    const opcoesRh = [
        { valor: "POSITIVO", label: "Positivo (+)" },
        { valor: "NEGATIVO", label: "Negativo (-)" },
    ]

    const opcoesSimNao = [
        { valor: "SIM", label: "Sim" },
        { valor: "NAO", label: "Não" },
    ]

    const opcoesUf = [
        { valor: "AC", label: "Acre - AC" },
        { valor: "AL", label: "Alagoas - AL" },
        { valor: "AP", label: "Amapá - AP" },
        { valor: "AM", label: "Amazonas - AM" },
        { valor: "BA", label: "Bahia - BA" },
        { valor: "CE", label: "Ceará - CE" },
        { valor: "DF", label: "Distrito Federal - DF" },
        { valor: "ES", label: "Espírito Santo - ES" },
        { valor: "GO", label: "Goiás - GO" },
        { valor: "MA", label: "Maranhão - MA" },
        { valor: "MT", label: "Mato Grosso - MT" },
        { valor: "MS", label: "Mato Grosso do Sul - MS" },
        { valor: "MG", label: "Minas Gerais - MG" },
        { valor: "PA", label: "Pará - PA" },
        { valor: "PB", label: "Paraíba - PB" },
        { valor: "PR", label: "Paraná - PR" },
        { valor: "PE", label: "Pernambuco - PE" },
        { valor: "PI", label: "Piauí - PI" },
        { valor: "RJ", label: "Rio de Janeiro - RJ" },
        { valor: "RN", label: "Rio Grande do Norte - RN" },
        { valor: "RS", label: "Rio Grande do Sul - RS" },
        { valor: "RO", label: "Rondônia - RO" },
        { valor: "RR", label: "Roraima - RR" },
        { valor: "SC", label: "Santa Catarina - SC" },
        { valor: "SP", label: "São Paulo - SP" },
        { valor: "SE", label: "Sergipe - SE" },
        { valor: "TO", label: "Tocantins - TO" },
    ]

    const opcoesGrauEscolaridade = [
        { valor: "FUNDAMENTAL_INCOMPLETO", label: "Fundamental incompleto" },
        { valor: "FUNDAMENTAL_COMPLETO", label: "Fundamental completo" },
        { valor: "MEDIO_INCOMPLETO", label: "Médio incompleto" },
        { valor: "MEDIO_COMPLETO", label: "Médio completo" },
        { valor: "SUPERIOR_INCOMPLETO", label: "Superior incompleto" },
        { valor: "SUPERIOR_COMPLETO", label: "Superior completo" },
        { valor: "POS_GRADUACAO", label: "Pós-graduação" },
        { valor: "MESTRADO", label: "Mestrado" },
        { valor: "DOUTORADO", label: "Doutorado" },
    ]

    console.log(tipoDeDado)

    return (
        <div className="p-4 flex flex-col gap-4 font-arimo text-verde-escuro">
            <div className="flex items-center gap-2">
                <AiOutlineUserAdd className="text-6xl"/>
                <div className="">
                    <h3 className="text-2xl font-bold">Pacientes</h3>
                    <span>Busque, adicione, edite um novo paciente.</span>
                </div>
            </div>
            <div className="shadow-[0px_0px_2px_1px_#999] rounded-lg p-4 flex flex-col gap-3">
                <div className="flex justify-between">
                    <div className="flex items-center gap-2 text-xl font-bold">
                        <RiMenuSearchLine />
                        <h2>Realize uma nova busca</h2>
                    </div>
                    <button onClick={() => setVisible(true)} className="flex items-center cursor-pointer gap-2 text-xl font-bold border border-verde p-1 rounded-lg px-3 transition-all duration-300 hover:bg-verde hover:text-white">
                        <IoAdd />
                        <h2>Adicionar Cliente</h2>
                    </button>
                </div>
                <div className="grid grid-cols-[160px_160px_160px_1fr_140px] gap-2">
                    <InputSelect
                        icone={<AiOutlineSelect />}
                        id="tipoDeDado"
                        label="Tipo de busca"
                        nome="tipoDeDado"
                        setValor={setTipoDeDado}
                        valor={tipoDeDado}
                        opcoes={tiposDeDados}
                    />
                    <InputSelect
                        icone={<AiOutlineSelect />}
                        id="condicao"
                        label="Condição"
                        nome="condicao"
                        setValor={setCondicao}
                        valor={condicao}
                        opcoes={tiposDeCondicoes}
                    />
                    {/* falta o select de unidade do cliente */}
                    <InputSelect
                        icone={<AiOutlineSelect />}
                        id="condicao"
                        label="Condição"
                        nome="condicao"
                        setValor={setCondicao}
                        valor={condicao}
                        opcoes={tiposDeCondicoes}
                    />
                    {/* vai ter que ser um input especial depois */}
                    <InputTexto icone={<MdDriveFileRenameOutline />} id="valor" label="Valor" nome="valor" placeholder="valor..." setValor={setValor} valor={valor} />
                    <button className="font-bold bg-verde text-white h-fit mt-auto py-2 rounded-lg">Buscar</button>
                </div>
            </div>
            <div className="shadow-[0px_0px_2px_1px_#999] rounded-lg p-4 flex flex-col gap-3">
                <div>
                    <div className="flex items-center gap-2 text-xl font-bold">
                        <RiMenuSearchLine />
                        <h2>Resultado da sua busca:</h2>
                    </div>
                </div>
                <div className="flex w-full">
                    <ul className="grid grid-cols-8 w-full">
                        <li className="text-sm font-semibold border border-verde px-2 py-1">
                            <p>Nome</p>
                        </li>
                        <li className="text-sm font-semibold border border-verde px-2 py-1">
                            <p>Nascimento</p>
                        </li>
                        <li className="text-sm font-semibold border border-verde px-2 py-1">
                            <p>Idade</p>
                        </li>
                        <li className="text-sm font-semibold border border-verde px-2 py-1">
                            <p>Nome da mãe</p>
                        </li>
                        <li className="text-sm font-semibold border border-verde px-2 py-1">
                            <p>CPF</p>
                        </li>
                        <li className="text-sm font-semibold border border-verde px-2 py-1">
                            <p>Cartão Sus</p>
                        </li>
                        <li className="text-sm font-semibold border border-verde px-2 py-1">
                            <p>Un. do Cliente</p>
                        </li>
                        <li className="text-sm font-semibold border border-verde px-2 py-1">
                            <p>Situação</p>
                        </li>
                    </ul>
                </div>
            </div>
            <div id="dialogNovoPaciente">
                <Dialog
                    visible={visible}
                    onHide={() => setVisible(false)}
                    className="w-[95vw] max-w-[1400px] bg-verde-escuro"
                    modal
                    closable
                    draggable={false}
                    resizable={false}
                    contentClassName="p-0"
                    closeIcon={
                        <IoClose
                            size={45}
                            className="text-white my-auto pt-4 pr-4"
                        />
                    }
                    header={
                        <div className="flex items-center gap-3 font-oswald px-6 py-3 text-white">
                            <FiUserPlus className="text-2xl" />
                            <div>
                                <h3 className="text-2xl font-bold">
                                    Adicionar Paciente
                                </h3>

                                <p className="text-sm font-normal opacity-90">
                                    Preencha as informações cadastrais do paciente
                                </p>
                            </div>
                        </div>
                    }
                >
                    <div className="bg-white text-verde-escuro font-arimo border-2 border-verde-escuro">
                        {/* Informações Pessoais */}
                        <section className="p-5 px-8 border-b border-gray-400">
                            <div className="flex items-center gap-2 text-xl font-bold mb-4">
                                <FaRegUser />
                                <h3>Informações Pessoais</h3>
                            </div>
                            <div className="flex flex-col gap-4">
                                <div className="grid grid-cols-2 gap-3">
                                    <InputTexto
                                        icone={<MdDriveFileRenameOutline />}
                                        id="nome"
                                        label="Nome Completo *"
                                        nome="nome"
                                        placeholder="Informe o nome completo..."
                                        setValor={setNome}
                                        valor={nome}
                                    />

                                    <div className="grid grid-cols-[1fr_170px] gap-2 items-center">
                                        <InputTexto
                                            icone={<MdDriveFileRenameOutline />}
                                            id="nomeSocial"
                                            label="Nome Social"
                                            nome="nomeSocial"
                                            placeholder="Informe o nome social..."
                                            setValor={setNomeSocial}
                                            valor={nomeSocial}
                                        />

                                        <InputCheckbox
                                            id="declaroNomeSocial"
                                            label="Declaro não possuir nome social"
                                            nome="declaroNomeSocial"
                                            setValor={setDeclaroNaoPossuirNomeSocial}
                                            valor={declaroNaoPossuirNomeSocial}
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-3">
                                    <InputTexto
                                        icone={<MdDriveFileRenameOutline />}
                                        id="nomeMae"
                                        label="Nome da Mãe *"
                                        nome="nomeMae"
                                        placeholder="Informe o nome da mãe..."
                                        setValor={setNomeDaMae}
                                        valor={nomeDaMae}
                                    />
                                    <InputTexto
                                        icone={<MdDriveFileRenameOutline />}
                                        id="nomePai"
                                        label="Nome do Pai"
                                        nome="nomePai"
                                        placeholder="Informe o nome do pai..."
                                        setValor={setNomeDoPai}
                                        valor={nomeDoPai}
                                    />
                                    <InputTexto
                                        icone={<MdDriveFileRenameOutline />}
                                        id="dataNascimento"
                                        label="Data de Nascimento *"
                                        nome="dataNascimento"
                                        placeholder="dd/mm/aaaa"
                                        setValor={setDataDeNascimento}
                                        valor={dataDeNascimento}
                                    />
                                </div>
                                <div className="grid grid-cols-3 gap-3">
                                    <InputSelect
                                        icone={<AiOutlineSelect />}
                                        id="sexo"
                                        label="Sexo *"
                                        nome="sexo"
                                        setValor={setSexo}
                                        valor={sexo}
                                        opcoes={opcoesSexo}
                                    />
                                    <InputSelect
                                        icone={<AiOutlineSelect />}
                                        id="estadoCivil"
                                        label="Estado Civil"
                                        nome="estadoCivil"
                                        setValor={setEstadoCivil}
                                        valor={estadoCivil}
                                        opcoes={opcoesEstadoCivil}
                                    />
                                    <InputSelect
                                        icone={<AiOutlineSelect />}
                                        id="corRaca"
                                        label="Cor / Raça"
                                        nome="corRaca"
                                        setValor={setCorRaça}
                                        valor={corRaça}
                                        opcoes={opcoesCorRaca}
                                    />
                                </div>
                                <div className="grid grid-cols-3 gap-3">
                                    <InputTexto
                                        icone={<MdDriveFileRenameOutline />}
                                        id="cpf"
                                        label="CPF *"
                                        nome="cpf"
                                        placeholder="000.000.000-00"
                                        setValor={setCpf}
                                        valor={cpf}
                                    />
                                    <InputTexto
                                        icone={<MdDriveFileRenameOutline />}
                                        id="cartaoSus"
                                        label="Cartão SUS"
                                        nome="cartaoSus"
                                        placeholder="000 0000 0000 0000"
                                        setValor={setCartaoSus}
                                        valor={cartaoSus}
                                    />
                                    <InputTexto
                                        icone={<MdDriveFileRenameOutline />}
                                        id="nis"
                                        label="NIS"
                                        nome="nis"
                                        placeholder="Informe o NIS..."
                                        setValor={setNis}
                                        valor={nis}
                                    />
                                </div>
                                <div className="grid grid-cols-[1fr_150px_150px_160px_160px] gap-3">
                                    {/* Vai ser um select depois */}
                                    <InputTexto
                                        icone={<MdDriveFileRenameOutline />}
                                        id="unidadeSaude"
                                        label="Unidade de Saúde"
                                        nome="unidadeSaude"
                                        placeholder="Unidade de saúde..."
                                        setValor={setUnidadeDeSaude}
                                        valor={unidadeDeSaude}
                                    />
                                    <InputTexto
                                        icone={<MdDriveFileRenameOutline />}
                                        id="codigoGsus"
                                        label="Código GSUS"
                                        nome="codigoGsus"
                                        placeholder="Código GSUS"
                                        setValor={setCodigoGsus}
                                        valor={codigoGsus}
                                    />
                                    <InputTexto
                                        icone={<MdDriveFileRenameOutline />}
                                        id="codigoIds"
                                        label="Código IDS"
                                        nome="codigoIds"
                                        placeholder="Código IDS"
                                        setValor={setCodigoIds}
                                        valor={codigoIds}
                                    />

                                    <InputSelect
                                        icone={<AiOutlineSelect />}
                                        id="tipoSanguineo"
                                        label="Tipo Sanguíneo"
                                        nome="tipoSanguineo"
                                        setValor={setTipoSanguineo}
                                        valor={tipoSanguineo}
                                        opcoes={opcoesTipoSanguineo}
                                    />
                                    <InputSelect
                                        icone={<AiOutlineSelect />}
                                        id="fatorRh"
                                        label="Fator RH"
                                        nome="fatorRh"
                                        setValor={setFatorRh}
                                        valor={fatorRh}
                                        opcoes={opcoesRh}
                                    />
                                </div>
                            </div>
                            <div className="mt-4">
                                <InputTexto
                                    icone={<MdDriveFileRenameOutline />}
                                    id="observacoes"
                                    label="Observações sobre a Pessoa"
                                    nome="observacoes"
                                    placeholder="Informe observações adicionais..."
                                    setValor={setObservacoes}
                                    valor={observacoes}
                                />
                            </div>
                        </section>

                        {/* Documentos */}
                        <section className="p-5 px-8 border-b border-gray-400">
                            <div className="flex items-center gap-2 text-xl font-bold mb-4">
                                <span className="text-2xl">▣</span>
                                <h3>Documentos e Identificações</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                                <InputTexto
                                    icone={<MdDriveFileRenameOutline />}
                                    id="rg"
                                    label="RG / Nº Identidade"
                                    nome="rg"
                                    placeholder="Número da identidade..."
                                    setValor={setRg}
                                    valor={rg}
                                />
                                <InputSelect
                                    icone={<AiOutlineSelect />}
                                    id="orgaoEmissor"
                                    label="Órgão Emissor"
                                    nome="orgaoEmissor"
                                    setValor={setOrgaoEmissor}
                                    valor={orgaoEmissor}
                                    opcoes={[
                                        { valor: "SSP", label: "SSP" },
                                        { valor: "DETRAN", label: "DETRAN" },
                                        { valor: "POLICIA_CIVIL", label: "Polícia Civil" },
                                        { valor: "OUTRO", label: "Outro" },
                                    ]}
                                />
                                <InputSelect
                                    icone={<AiOutlineSelect />}
                                    id="ufRg"
                                    label="UF"
                                    nome="ufRg"
                                    setValor={setUfRg}
                                    valor={ufRg}
                                    opcoes={opcoesUf}
                                />
                                <InputTexto
                                    icone={<MdDriveFileRenameOutline />}
                                    id="dataEmissaoRg"
                                    label="Data de Emissão"
                                    nome="dataEmissaoRg"
                                    placeholder="dd/mm/aaaa"
                                    setValor={setDataEmissaoRg}
                                    valor={dataEmissaoRg}
                                />
                                <InputSelect
                                    icone={<AiOutlineSelect />}
                                    id="cpfRegular"
                                    label="CPF Regular"
                                    nome="cpfRegular"
                                    setValor={setCpfRegular}
                                    valor={cpfRegular}
                                    opcoes={opcoesSimNao}
                                />
                                <InputTexto
                                    icone={<MdDriveFileRenameOutline />}
                                    id="cpfCns"
                                    label="CPF CNS"
                                    nome="cpfCns"
                                    placeholder="Informe o CPF CNS..."
                                    setValor={setCpfCns}
                                    valor={cpfCns}
                                />
                                <InputTexto
                                    icone={<MdDriveFileRenameOutline />}
                                    id="cnsMae"
                                    label="CNS da Mãe"
                                    nome="cnsMae"
                                    placeholder="Informe o CNS da mãe..."
                                    setValor={setCnsMae}
                                    valor={cnsMae}
                                />
                                <InputSelect
                                    icone={<AiOutlineSelect />}
                                    id="orientacaoRegCpf"
                                    label="Recebeu Orientação Reg. CPF?"
                                    nome="orientacaoRegCpf"
                                    setValor={setOrientacaoRegCpf}
                                    valor={orientacaoRegCpf}
                                    opcoes={opcoesSimNao}
                                />
                            </div>
                        </section>

                        {/* Titulo de eleitor */}
                        <section className="p-5 px-8 border-b border-gray-400">
                            <h3 className="font-bold text-lg mb-4">
                                Título de Eleitor
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                <InputTexto
                                    icone={<MdDriveFileRenameOutline />}
                                    id="tituloEleitor"
                                    label="Título de Eleitor"
                                    nome="tituloEleitor"
                                    placeholder="Número do título..."
                                    setValor={setTituloEleitor}
                                    valor={tituloEleitor}
                                />
                                <InputTexto
                                    icone={<MdDriveFileRenameOutline />}
                                    id="zonaEleitoral"
                                    label="Zona"
                                    nome="zonaEleitoral"
                                    placeholder="Zona eleitoral..."
                                    setValor={setZonaEleitoral}
                                    valor={zonaEleitoral}
                                />
                                <InputTexto
                                    icone={<MdDriveFileRenameOutline />}
                                    id="secaoEleitoral"
                                    label="Seção"
                                    nome="secaoEleitoral"
                                    placeholder="Seção eleitoral..."
                                    setValor={setSecaoEleitoral}
                                    valor={secaoEleitoral}
                                />
                            </div>
                        </section>

                        {/* Trabalhistas */}
                        <section className="p-5 px-8 border-b border-gray-400">
                            <div className="flex items-center gap-2 text-xl font-bold mb-4">
                                <span className="text-2xl">▤</span>
                                <h3>Informações Trabalhistas</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
                                <InputTexto
                                    icone={<MdDriveFileRenameOutline />}
                                    id="ctpsNumero"
                                    label="CTPS Número"
                                    nome="ctpsNumero"
                                    placeholder="Número da CTPS..."
                                    setValor={setCtpsNumero}
                                    valor={ctpsNumero}
                                />
                                <InputTexto
                                    icone={<MdDriveFileRenameOutline />}
                                    id="ctpsSerie"
                                    label="Série"
                                    nome="ctpsSerie"
                                    placeholder="Série..."
                                    setValor={setCtpsSerie}
                                    valor={ctpsSerie}
                                />
                                <InputSelect
                                    icone={<AiOutlineSelect />}
                                    id="ctpsUf"
                                    label="UF"
                                    nome="ctpsUf"
                                    setValor={setCtpsUf}
                                    valor={ctpsUf}
                                    opcoes={opcoesUf}
                                />
                                <InputTexto
                                    icone={<MdDriveFileRenameOutline />}
                                    id="ctpsDataEmissao"
                                    label="Data de Emissão"
                                    nome="ctpsDataEmissao"
                                    placeholder="dd/mm/aaaa"
                                    setValor={setCtpsDataEmissao}
                                    valor={ctpsDataEmissao}
                                />
                                <InputTexto
                                    icone={<MdDriveFileRenameOutline />}
                                    id="pisPasep"
                                    label="PIS/PASEP"
                                    nome="pisPasep"
                                    placeholder="Número do PIS/PASEP..."
                                    setValor={setPisPasep}
                                    valor={pisPasep}
                                />
                            </div>
                        </section>

                        {/* Educação */}
                        <section className="p-5 px-8 border-b border-gray-400">
                            <div className="flex items-center gap-2 text-xl font-bold mb-4">
                                <span className="text-2xl">⌂</span>
                                <h3>Informações de Educação</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
                                <InputSelect
                                    icone={<AiOutlineSelect />}
                                    id="frequentaEscola"
                                    label="Frequenta Escola?"
                                    nome="frequentaEscola"
                                    setValor={setFrequentaEscola}
                                    valor={frequentaEscola}
                                    opcoes={opcoesSimNao}
                                />
                                <InputTexto
                                    icone={<MdDriveFileRenameOutline />}
                                    id="escola"
                                    label="Escola"
                                    nome="escola"
                                    placeholder="Informe a escola..."
                                    setValor={setEscola}
                                    valor={escola}
                                />
                                <InputTexto
                                    icone={<MdDriveFileRenameOutline />}
                                    id="serieEscolar"
                                    label="Série Escolar"
                                    nome="serieEscolar"
                                    placeholder="Série..."
                                    setValor={setSerieEscolar}
                                    valor={serieEscolar}
                                />
                                <InputSelect
                                    icone={<AiOutlineSelect />}
                                    id="grauEscolaridade"
                                    label="Grau de Escolaridade"
                                    nome="grauEscolaridade"
                                    setValor={setGrauEscolaridade}
                                    valor={grauEscolaridade}
                                    opcoes={opcoesGrauEscolaridade}
                                />
                                <InputTexto
                                    icone={<MdDriveFileRenameOutline />}
                                    id="cursoProfissionalizante"
                                    label="Curso Profissionalizante"
                                    nome="cursoProfissionalizante"
                                    placeholder="Informe o curso..."
                                    setValor={setCursoProfissionalizante}
                                    valor={cursoProfissionalizante}
                                />
                            </div>
                        </section>

                        {/* Naturalização*/}
                        <section className="p-5 px-8 border-b border-gray-400">
                            <div className="flex items-center gap-2 text-xl font-bold mb-4">
                                <span className="text-2xl">◎</span>
                                <h3>Naturalização</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                                <InputTexto
                                    icone={<MdDriveFileRenameOutline />}
                                    id="paisOrigem"
                                    label="País de Origem"
                                    nome="paisOrigem"
                                    placeholder="Informe o país..."
                                    setValor={setPaisOrigem}
                                    valor={paisOrigem}
                                />
                                <InputTexto
                                    icone={<MdDriveFileRenameOutline />}
                                    id="entradaBrasil"
                                    label="Entrada no Brasil"
                                    nome="entradaBrasil"
                                    placeholder="dd/mm/aaaa"
                                    setValor={setEntradaBrasil}
                                    valor={entradaBrasil}
                                />
                                <InputTexto
                                    icone={<MdDriveFileRenameOutline />}
                                    id="numeroPortaria"
                                    label="Nº Portaria"
                                    nome="numeroPortaria"
                                    placeholder="Número da portaria..."
                                    setValor={setNumeroPortaria}
                                    valor={numeroPortaria}
                                />
                                <InputTexto
                                    icone={<MdDriveFileRenameOutline />}
                                    id="dataNaturalizacao"
                                    label="Data Naturalização"
                                    nome="dataNaturalizacao"
                                    placeholder="dd/mm/aaaa"
                                    setValor={setDataNaturalizacao}
                                    valor={dataNaturalizacao}
                                />
                            </div>
                        </section>

                        {/* Localidade */}
                        <section className="p-5 px-8 border-b border-gray-400">
                            <div className="flex items-center gap-2 text-xl font-bold mb-4">
                                <span className="text-2xl">⌖</span>
                                <h3>Endereço e Localidade</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                                <InputSelect
                                    icone={<AiOutlineSelect />}
                                    id="pais"
                                    label="País"
                                    nome="pais"
                                    setValor={setPais}
                                    valor={pais}
                                    opcoes={[
                                        { valor: "BRASIL", label: "Brasil" },
                                        { valor: "OUTRO", label: "Outro" },
                                    ]}
                                />
                                <InputSelect
                                    icone={<AiOutlineSelect />}
                                    id="uf"
                                    label="UF"
                                    nome="uf"
                                    setValor={setUf}
                                    valor={uf}
                                    opcoes={opcoesUf}
                                />
                                <InputTexto
                                    icone={<MdDriveFileRenameOutline />}
                                    id="municipio"
                                    label="Município"
                                    nome="municipio"
                                    placeholder="Informe o município..."
                                    setValor={setMunicipio}
                                    valor={municipio}
                                />
                                <InputTexto
                                    icone={<MdDriveFileRenameOutline />}
                                    id="bairro"
                                    label="Bairro"
                                    nome="bairro"
                                    placeholder="Informe o bairro..."
                                    setValor={setBairro}
                                    valor={bairro}
                                />
                                <InputTexto
                                    icone={<MdDriveFileRenameOutline />}
                                    id="rua"
                                    label="Logradouro"
                                    nome="rua"
                                    placeholder="Rua, avenida..."
                                    setValor={setRua}
                                    valor={rua}
                                />
                                <InputTexto
                                    icone={<MdDriveFileRenameOutline />}
                                    id="numero"
                                    label="Número"
                                    nome="numero"
                                    placeholder="Nº"
                                    setValor={setNumero}
                                    valor={numero}
                                />
                                <InputTexto
                                    icone={<MdDriveFileRenameOutline />}
                                    id="complemento"
                                    label="Complemento"
                                    nome="complemento"
                                    placeholder="Apartamento, casa..."
                                    setValor={setComplemento}
                                    valor={complemento}
                                />
                                <InputTexto
                                    icone={<MdDriveFileRenameOutline />}
                                    id="zona"
                                    label="Zona"
                                    nome="zona"
                                    placeholder="Urbana / Rural..."
                                    setValor={setZona}
                                    valor={zona}
                                />
                            </div>
                        </section>

                        {/* Geolocalização */}
                        <section className="p-5">
                            <div className="flex items-center gap-2 text-xl font-bold mb-4">
                                <span className="text-2xl">⌖</span>
                                <h3>Geolocalização</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <InputTexto
                                    icone={<MdDriveFileRenameOutline />}
                                    id="latitude"
                                    label="Latitude"
                                    nome="latitude"
                                    placeholder="Digite a latitude..."
                                    setValor={setLatitude}
                                    valor={latitude}
                                />
                                <InputTexto
                                    icone={<MdDriveFileRenameOutline />}
                                    id="longitude"
                                    label="Longitude"
                                    nome="longitude"
                                    placeholder="Digite a longitude..."
                                    setValor={setLongitude}
                                    valor={longitude}
                                />
                            </div>
                        </section>

                        <div className="flex items-center justify-between px-4">
                            <div className="relative w-22 h-22">
                                <Image alt="Logo do SSJT" src={'/logo/logo-sistema.png'} fill className="object-contain" />
                            </div>
                            <div className="p-4 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setVisible(false)}
                                    className="
                                px-5 py-2
                                rounded-lg
                                border border-verde
                                text-verde
                                font-bold
                                hover:bg-verde
                                hover:text-white
                                transition-all
                            "
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="button"
                                    className="
                                px-6 py-2
                                rounded-lg
                                bg-verde
                                text-white
                                font-bold
                                hover:bg-verde-escuro
                                transition-all
                            "
                                >
                                    Salvar Paciente
                                </button>

                            </div>
                        </div>
                    </div>
                </Dialog>
            </div>
        </div>
    )
}