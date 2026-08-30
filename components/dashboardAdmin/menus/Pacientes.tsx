import InputSelect from "@/components/assets/InputSelect";
import InputTexto from "@/components/assets/InputTexto";
import { useState } from "react";
import { AiOutlineSelect, AiOutlineUserAdd } from "react-icons/ai";
import { IoAdd, IoClose } from "react-icons/io5";
import { MdDriveFileRenameOutline } from "react-icons/md";
import { RiLightbulbLine, RiMenuSearchLine } from "react-icons/ri";
import { Dialog } from "primereact/dialog";
import { FiUserPlus } from "react-icons/fi";
import { FaRegUser } from "react-icons/fa";
import Image from "next/image";
import InputCheckbox from "@/components/assets/InputCheckbox";
import { usePacientes } from "@/hooks/usePacientes";
import { Paciente } from "@/app/generated/prisma/client";
import { GiMagnifyingGlass } from "react-icons/gi";
import { IoIosCheckmarkCircle } from "react-icons/io";
import { TiDeleteOutline } from "react-icons/ti";
import calcularIdade from "@/utils/calcularIdade";
import { useLocais } from "@/hooks/useLocais";
import { Condicao, CondicaoOption, TipoDeDado, TipoDeDadoOption } from "@/enum/enums";
import InputData from "@/components/assets/InputData";
import { HiOutlineCalendarDateRange } from "react-icons/hi2";
import { Paginator, PaginatorPageChangeEvent } from "primereact/paginator";
import { opcoesCorRaca, opcoesEstadoCivil, opcoesGrauEscolaridade, opcoesOrgaoEmissor, opcoesRh, opcoesSexo, opcoesSimNao, opcoesTipoSanguineo, opcoesUf, tiposDeCondicoes, tiposDeDados } from "@/utils/opcoesDeDados";
import { limparCampos } from "@/utils/limparCampos";

export default function Pacientes() {
    const { pacientes } = usePacientes()
    const { locais } = useLocais()

    const locaisJoaquimTavora = locais.filter(local => local.cep === '86455000')

    const [tipoDeDado, setTipoDeDado] = useState<TipoDeDado>(TipoDeDado.NOME)
    const [condicao, setCondicao] = useState<Condicao>(Condicao.IGUAL)
    const [unidadeCliente, setUnidadeCliente] = useState("")
    const [valor, setValor] = useState('')
    const [visible, setVisible] = useState(false);
    const [valorBuscado, setValorBuscado] = useState('')

    // INFORMAÇÕES PESSOAIS
    const [nome, setNome] = useState('')
    const [nomeSocial, setNomeSocial] = useState('')
    const [declaroNaoPossuirNomeSocial, setDeclaroNaoPossuirNomeSocial] = useState(true)
    const [nomeDaMae, setNomeDaMae] = useState('')
    const [nomeDoPai, setNomeDoPai] = useState('')
    const [dataDeNascimento, setDataDeNascimento] = useState('')
    const [sexo, setSexo] = useState('')
    const [estadoCivil, setEstadoCivil] = useState('')
    const [corRaca, setCorRaca] = useState('')
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

    // Contato
    const [telefone1, setTelefone1] = useState('')
    const [telefone2, setTelefone2] = useState('')
    const [email, setEmail] = useState('')

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


    const [buscaRealizada, setBuscaRealizada] = useState(false)
    const [pacientesEncontrados, setPacientesEncontrados] = useState<any[]>([])

    const [first, setFirst] = useState(0)
    const [rows, setRows] = useState(5)

    const pacientesDaPagina = pacientesEncontrados.slice(
        first,
        first + rows
    )

    const limparFormulario = () => {
        limparCampos(
            [setNome, ''],
            [setNomeSocial, ''],
            [setDeclaroNaoPossuirNomeSocial, false],
            [setNomeDaMae, ''],
            [setNomeDoPai, ''],
            [setDataDeNascimento, ''],
            [setSexo, ''],
            [setEstadoCivil, ''],
            [setCorRaca, ''],
            [setCpf, ''],
            [setCartaoSus, ''],
            [setCodigoGsus, ''],
            [setCodigoIds, ''],
            [setNis, ''],
            [setUnidadeDeSaude, ''],
            [setTipoSanguineo, ''],
            [setFatorRh, ''],
            [setSituacaoFamiliar, ''],
            [setPovoTradicional, ''],
            [setReligiao, ''],
            [setObservacoes, ''],

            [setRg, ''],
            [setOrgaoEmissor, ''],
            [setUfRg, ''],
            [setDataEmissaoRg, ''],
            [setCpfRegular, ''],
            [setCpfCns, ''],
            [setCnsMae, ''],
            [setOrientacaoRegCpf, ''],

            [setTituloEleitor, ''],
            [setZonaEleitoral, ''],
            [setSecaoEleitoral, ''],

            [setCtpsNumero, ''],
            [setCtpsSerie, ''],
            [setCtpsUf, ''],
            [setCtpsDataEmissao, ''],
            [setPisPasep, ''],

            [setFrequentaEscola, ''],
            [setEscola, ''],
            [setSerieEscolar, ''],
            [setGrauEscolaridade, ''],
            [setCursoProfissionalizante, ''],

            [setPaisOrigem, ''],
            [setEntradaBrasil, ''],
            [setNumeroPortaria, ''],
            [setDataNaturalizacao, ''],

            [setPais, ''],
            [setUf, ''],
            [setMunicipio, ''],
            [setBairro, ''],
            [setRua, ''],
            [setNumero, ''],
            [setComplemento, ''],

            [setLatitude, ''],
            [setLongitude, ''],
            [setZona, ''],
        )
    }

    const opcoesUnidades = [
        {
            label: "Selecione",
            valor: '',
        },
        ...locaisJoaquimTavora.map(local => ({
            label: local.nome,
            valor: local.id
        }))
    ]
    
    const opcoesUnidadeDeSaudePaciente = [
        {
            label: "Selecione",
            valor: ''
        },
        ...locaisJoaquimTavora.map(local => ({
            label: local.nome,
            valor: local.id
        }))
    ]

    const handleSubmit = async () => {
        try {

            if (!nome.trim()) {
                throw new Error("Informe o nome do paciente.")
            }
            if (!nomeDaMae.trim()) {
                throw new Error("Informe o nome da mãe.")
            }
            if (!dataDeNascimento) {
                throw new Error("Informe a data de nascimento.")
            }
            if (!sexo) {
                throw new Error("Selecione o sexo.")
            }
            if (!cpf.trim()) {
                throw new Error("Informe o CPF.")
            }
            if (!telefone1.trim()) {
                throw new Error("Informe o telefone principal.")
            }

            const paciente = {
                nome: nome.trim(),
                nomeSocial:
                    declaroNaoPossuirNomeSocial
                        ? null
                        : nomeSocial.trim() || null,
                declaroNaoPossuirNomeSocial,
                nomeDaMae: nomeDaMae.trim(),
                nomeDoPai: nomeDoPai.trim() || null,
                dataDeNascimento: dataDeNascimento,
                sexo: sexo || null,
                estadoCivil: estadoCivil || null,
                corRaca: corRaca || null,
                cpf: cpf.trim(),
                cartaoSus: cartaoSus.trim() || null,
                nis: nis.trim() || null,
                unidadeDeSaude: unidadeDeSaude || null,
                codigoGsus: codigoGsus.trim() || null,
                codigoIds: codigoIds.trim() || null,
                tipoSanguineo: tipoSanguineo || null,
                fatorRh: fatorRh || null,
                observacoes: observacoes.trim() || null,

                telefone1: telefone1.trim(),
                telefone2: telefone2.trim() || null,
                email: email.trim() || null,

                rg: rg.trim() || null,
                orgaoEmissor: orgaoEmissor || null,
                ufRg: ufRg || null,
                dataEmissaoRg: dataEmissaoRg || null,
                cpfRegular: cpfRegular || null,
                cpfCns: cpfCns.trim() || null,
                cnsMae: cnsMae.trim() || null,
                orientacaoRegCpf: orientacaoRegCpf || null,

                tituloEleitor: tituloEleitor.trim() || null,
                zonaEleitoral: zonaEleitoral.trim() || null,
                secaoEleitoral: secaoEleitoral.trim() || null,

                ctpsNumero: ctpsNumero.trim() || null,
                ctpsSerie: ctpsSerie.trim() || null,
                ctpsUf: ctpsUf || null,
                ctpsDataEmissao: ctpsDataEmissao || null,
                pisPasep: pisPasep.trim() || null,

                frequentaEscola: frequentaEscola || null,
                escola: escola.trim() || null,
                serieEscolar: serieEscolar.trim() || null,
                grauEscolaridade: grauEscolaridade || null,
                cursoProfissionalizante: cursoProfissionalizante.trim() || null,

                paisOrigem: paisOrigem.trim() || null,
                entradaBrasil: entradaBrasil || null,
                numeroPortaria: numeroPortaria.trim() || null,
                dataNaturalizacao: dataNaturalizacao || null,

                pais: pais || null,
                uf: uf || null,
                municipio: municipio.trim() || null,
                cep: null,
                bairro: bairro.trim() || null,
                rua: rua.trim() || null,
                numero: numero.trim() || null,
                complemento: complemento.trim() || null,
                zona: zona || null,

                latitude:
                    latitude.trim()
                        ? Number(latitude)
                        : null,
                longitude:
                    longitude.trim()
                        ? Number(longitude)
                        : null,
            }

            const response = await fetch("/api/pacientes", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(paciente),
            })

            const data = await response.json()
            if (!response.ok) {
                throw new Error(
                    data.erro ||
                    data.error ||
                    "Erro ao cadastrar paciente."
                )
            }
            console.log(
                "PACIENTE CADASTRADO:",
                data
            )
            alert(
                "Paciente cadastrado com sucesso!"
            )
            setVisible(false)
            limparFormulario()
        } catch (error) {
            console.error(
                "ERRO AO CADASTRAR PACIENTE:",
                error
            )
            alert(
                error instanceof Error
                    ? error.message
                    : "Erro ao cadastrar paciente."
            )
        }
    }

    const handleBuscar = () => {
        setBuscaRealizada(true)
        setValorBuscado(valor)
        setFirst(0)

        if (!tipoDeDado) {
            alert("Selecione o tipo de busca.")
            return
        }
        if (!valor.trim()) {
            alert("Digite um valor para realizar a busca.")
            setPacientesEncontrados([])
            return
        }

        const termo = valor.trim().toLowerCase()
        let resultados: Paciente[] = []
        switch (tipoDeDado) {
            case TipoDeDado.NOME: {
                const termos = termo
                    .split(/\s+/)
                    .filter(Boolean)

                resultados = pacientes.filter((paciente) => {
                    const nome = paciente.nome?.toLowerCase() ?? ""

                    return termos.every((palavra) =>
                        nome.includes(palavra)
                    )
                })

                break
            }

            case TipoDeDado.CPF:
                resultados = pacientes.filter((paciente) =>
                    paciente.cpf
                        ?.replace(/\D/g, "")
                        .includes(termo.replace(/\D/g, ""))
                )
                break

            case TipoDeDado.CARTAO_SUS:
                resultados = pacientes.filter((paciente) =>
                    paciente.cartaoSus
                        ?.replace(/\D/g, "")
                        .includes(termo.replace(/\D/g, ""))
                )
                break

            default:
                resultados = []
        }

        if (unidadeCliente) {
            resultados = resultados.filter(
                (paciente) =>
                    paciente.unidadeDeSaude === unidadeCliente
            )
        }

        setPacientesEncontrados(resultados)
    }

    return (
        <div className="row-span-2 overflow-hidden">
            <div className="p-4 flex flex-col gap-4 font-arimo text-verde-escuro h-full">
                <div className="flex items-center gap-2">
                    <AiOutlineUserAdd className="text-6xl" />
                    <div className="">
                        <h3 className="text-2xl font-bold">Pacientes</h3>
                        <span>Busque, adicione, edite um novo paciente.</span>
                    </div>
                </div>
                <div className="shadow-[0px_0px_2px_1px_var(--verde-escuro)] rounded-lg p-4 flex flex-col gap-3">
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
                    <div className="grid grid-cols-[160px_160px_200px_1fr_140px] gap-2">
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
                        <InputSelect
                            icone={<AiOutlineSelect />}
                            id="unidadeCliente"
                            label="Unidade do cliente"
                            nome="unidadeCliente"
                            setValor={setUnidadeCliente}
                            valor={unidadeCliente}
                            opcoes={opcoesUnidades}
                        />
                        {/* vai ter que ser um input especial depois */}
                        <InputTexto icone={<MdDriveFileRenameOutline />} id="valor" label="Valor" nome="valor" placeholder={`${tipoDeDado}`} setValor={setValor} valor={valor} />
                        <button className="font-bold bg-verde text-white h-fit mt-auto py-2 rounded-lg" onClick={handleBuscar}>Buscar</button>
                    </div>
                </div>
                <div className="shadow-[0px_0px_2px_1px_var(--verde-escuro)] rounded-lg p-4 flex flex-col gap-3 h-full">
                    <div>
                        <div className="flex items-center gap-2 text-xl font-bold">
                            <RiMenuSearchLine />
                            <h2>Resultado da sua busca:</h2>
                        </div>
                    </div>
                    {
                        pacientesDaPagina.length > 0 ? (
                            <>
                                <div className="flex flex-col w-full rounded-t-lg overflow-x-scroll pb-3 h-full">
                                    <ul className="grid grid-cols-[130px_170px_110px_140px_170px_130px_130px_150px_170px_110px_110px_180px] w-full h-fit">
                                        <li className="text-sm font-semibold border border-zinc-200 px-2 py-1 rounded-tl-lg text-center">
                                            <p>ID</p>
                                        </li>
                                        <li className="text-sm font-semibold border border-zinc-200 px-2 py-1">
                                            <p>Nome</p>
                                        </li>
                                        <li className="text-sm font-semibold border border-zinc-200 px-2 py-1 text-center">
                                            <p>Nascimento</p>
                                        </li>
                                        <li className="text-sm font-semibold border border-zinc-200 px-2 py-1 text-center">
                                            <p>Idade</p>
                                        </li>
                                        <li className="text-sm font-semibold border border-zinc-200 px-2 py-1">
                                            <p>Nome da mãe</p>
                                        </li>
                                        <li className="text-sm font-semibold border border-zinc-200 px-2 py-1">
                                            <p>Sexo</p>
                                        </li>
                                        <li className="text-sm font-semibold border border-zinc-200 px-2 py-1 text-center">
                                            <p>CPF</p>
                                        </li>
                                        <li className="text-sm font-semibold border border-zinc-200 px-2 py-1 text-center">
                                            <p>Cartão Sus</p>
                                        </li>
                                        <li className="text-sm font-semibold border border-zinc-200 px-2 py-1 text-center">
                                            <p>Un. do Cliente</p>
                                        </li>
                                        <li className="text-sm font-semibold border border-zinc-200 px-2 py-1 text-center">
                                            <p>Código IDS</p>
                                        </li>
                                        <li className="text-sm font-semibold border border-zinc-200 px-2 py-1">
                                            <p>Código GSUS</p>
                                        </li>
                                        <li className="text-sm font-semibold border border-zinc-200 px-2 py-1 rounded-tr-lg">
                                            <p>Endereço do Paciente</p>
                                        </li>
                                    </ul>
                                    <ul className="flex flex-col h-full">
                                        {
                                            pacientesEncontrados.map(((paciente: Paciente) => {
                                                const unidadeDoCliente = locais.find(local => local.id === paciente.unidadeDeSaude)
                                                return (
                                                    <li key={paciente.id} className="grid grid-cols-[130px_170px_110px_140px_170px_130px_130px_150px_170px_110px_110px_180px] w-full duration-200 cursor-pointer transition-all hover:bg-verde-escuro/20">
                                                        <div className="text-sm font-semibold border border-zinc-200 px-2 py-1 flex items-center justify-center">
                                                            <p>{paciente.idPaciente}</p>
                                                        </div>
                                                        <div className="text-sm font-semibold border border-zinc-200 px-2 py-1 flex items-center">
                                                            <p className="leading-4 uppercase">{paciente.nome}</p>
                                                        </div>
                                                        <div className="text-sm font-semibold border border-zinc-200 px-2 py-1 flex justify-center items-center">
                                                            <p>
                                                                {new Date(paciente.dataDeNascimento).toLocaleDateString("pt-BR")}
                                                            </p>
                                                        </div>
                                                        <div className="text-sm font-semibold border border-zinc-200 px-2 py-1 text-center">
                                                            <p>{calcularIdade(paciente.dataDeNascimento)}</p>
                                                        </div>
                                                        <div className="text-sm font-semibold border border-zinc-200 px-2 py-1 flex items-center">
                                                            <p className="leading-4 uppercase">{paciente.nomeDaMae}</p>
                                                        </div>
                                                        <div className="text-sm font-semibold border border-zinc-200 px-2 py-1 flex items-center">
                                                            <p>{paciente.sexo}</p>
                                                        </div>
                                                        <div className="text-sm font-semibold border border-zinc-200 px-2 py-1 flex justify-center items-center">
                                                            <p>{paciente.cpf}</p>
                                                        </div>
                                                        <div className="text-sm font-semibold border border-zinc-200 px-2 py-1 flex justify-center items-center">
                                                            <p>{paciente.cartaoSus ? paciente.cartaoSus : 'Não Informado'}</p>
                                                        </div>
                                                        <div className="text-sm font-semibold border border-zinc-200 px-2 py-1 flex items-center justify-center text-center">
                                                            <p>{unidadeDoCliente?.nome}</p>
                                                        </div>
                                                        <div className="text-sm font-semibold border border-zinc-200 px-2 py-1 flex items-center justify-center">
                                                            <p>{paciente.codigoIds}</p>
                                                        </div>
                                                        <div className="text-sm font-semibold border border-zinc-200 px-2 py-1 flex items-center justify-center">
                                                            <p>{paciente.codigoGsus}</p>
                                                        </div>
                                                        <div className="text-sm font-semibold border border-zinc-200 px-2 py-1 flex items-center justify-center">
                                                            <p className="leading-4 line-clamp-2">Rua das Hortências, 100 - Centro de Eventosaaaaaaaaaaaaaaaa</p>
                                                        </div>
                                                    </li>
                                                )
                                            }))
                                        }
                                    </ul>
                                </div>
                                {/* Paginator */}
                                <div className="relative w-full">
                                    {pacientesEncontrados.length > 0 && (
                                        <div className="border-t border-zinc-200">
                                            <Paginator
                                                first={first}
                                                rows={rows}
                                                totalRecords={pacientesEncontrados.length}
                                                rowsPerPageOptions={[5, 10, 20, 50]}
                                                onPageChange={(event: PaginatorPageChangeEvent) => {
                                                    setFirst(event.first)
                                                    setRows(event.rows)
                                                }}
                                                template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown CurrentPageReport"
                                                currentPageReportTemplate="{first} até {last} de {totalRecords} pacientes"
                                            />
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <div className="grid grid-cols-2 gap-6 my-auto row-span-2 2xl:px-10 3xl:px-16 4xl:px-30">
                                <div className="relative w-full h-full">
                                    <Image alt="image" src={'/mulher.png'} fill className="object-contain" />
                                </div>
                                <div className="text-verde-escuro flex flex-col gap-4">
                                    <div className="flex items-center gap-2 text-lg">
                                        <GiMagnifyingGlass />
                                        <h5>Resultado da busca:</h5>
                                    </div>
                                    <div>
                                        <h3 className="text-verde-escuro text-3xl font-bold 2xl:text-4xl 3xl:text-[44px]">Nenhum Paciente Encontrado</h3>
                                        <span className="text-zinc-500 flex flex-col 2xl:text-lg">Não encontramos nenhum paciente com os critérios informados: <b>"{valor}"</b></span>
                                    </div>
                                    <div className="border border-verde-escuro rounded-lg p-4 bg-verde-escuro/10 flex flex-col gap-2">
                                        <div className="flex items-center text-xl font-bold">
                                            <RiLightbulbLine />
                                            <p>Dicas para uma nova busca:</p>
                                        </div>
                                        <div>
                                            <ul>
                                                <li className="flex items-center gap-2">
                                                    <IoIosCheckmarkCircle />
                                                    <p>Verifique se os dados estão corretos.</p>
                                                </li>
                                                <li className="flex items-center gap-2">
                                                    <IoIosCheckmarkCircle />
                                                    <p>Tente usar menos filtros na pesquisa</p>
                                                </li>
                                                <li className="flex items-center gap-2">
                                                    <IoIosCheckmarkCircle />
                                                    <p>Utilize parte do nome ou CPF.</p>
                                                </li>
                                                <li className="flex items-center gap-2">
                                                    <IoIosCheckmarkCircle />
                                                    <p>Confira se não há espaços extras.</p>
                                                </li>
                                            </ul>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4 max-w-[600px] ml-auto">
                                            <button className="flex items-center justify-center cursor-pointer gap-2 text-lg font-bold border border-red-500 p-1 rounded-lg px-3 transition-all duration-300 bg-red-500 text-white hover:bg-white hover:text-red-500">
                                                <TiDeleteOutline />
                                                <h2>Limpar Filtros</h2>
                                            </button>
                                            <button onClick={() => setVisible(true)} className="flex items-center justify-center cursor-pointer gap-2 text-lg font-bold border border-verde p-1 rounded-lg px-3 transition-all duration-300 hover:bg-verde hover:text-white">
                                                <IoAdd />
                                                <h2>Adicionar Cliente</h2>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    }
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
                            className="text-verde-escuro my-auto"
                        />
                    }
                    header={
                        <div className="flex items-center gap-3 font-oswald px-6 py-3 text-verde-escuro">
                            <FiUserPlus className="text-5xl" />
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
                                        <div className={`${declaroNaoPossuirNomeSocial ? 'opacity-35' : ''}`}>
                                            <InputTexto
                                                icone={<MdDriveFileRenameOutline />}
                                                id="nomeSocial"
                                                label="Nome Social"
                                                nome="nomeSocial"
                                                placeholder="Informe o nome social..."
                                                setValor={setNomeSocial}
                                                disabled={declaroNaoPossuirNomeSocial}
                                                valor={nomeSocial}
                                            />
                                        </div>
                                        <div className="flex justify-center items-center mt-auto">
                                            <InputCheckbox
                                                id="declaroNomeSocial"
                                                label="Declaro não possuir nome social"
                                                nome="declaroNomeSocial"
                                                setValor={setDeclaroNaoPossuirNomeSocial}
                                                valor={declaroNaoPossuirNomeSocial}
                                            />
                                        </div>
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
                                    <InputData
                                        icone={<HiOutlineCalendarDateRange />}
                                        id="dataDeNascimento"
                                        label="Data de Nascimento"
                                        nome="dataDeNascimento"
                                        placeholder="Data de Nascimento"
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
                                        setValor={setCorRaca}
                                        valor={corRaca}
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
                                    <InputSelect
                                        icone={<AiOutlineSelect />}
                                        id="unidadeSaude"
                                        label="Unidade de Saúde"
                                        nome="unidadeSaude"
                                        setValor={setUnidadeDeSaude}
                                        valor={unidadeDeSaude}
                                        opcoes={opcoesUnidadeDeSaudePaciente}
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

                        {/* Contato */}
                        <section className="p-5 px-8 border-b border-gray-400">
                            <div className="flex items-center gap-2 text-xl font-bold mb-4">
                                <span className="text-2xl">▣</span>
                                <h3>Contato</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                <InputTexto
                                    icone={<MdDriveFileRenameOutline />}
                                    id="telefone1"
                                    label="Telefone 1"
                                    nome="telefone1"
                                    placeholder="Informe o telefone principal..."
                                    setValor={setTelefone1}
                                    valor={telefone1}
                                />
                                <InputTexto
                                    icone={<MdDriveFileRenameOutline />}
                                    id="telefone2"
                                    label="Telefone 2"
                                    nome="telefone2"
                                    placeholder="Informe o telefone secundário..."
                                    setValor={setTelefone2}
                                    valor={telefone2}
                                />
                                <InputTexto
                                    icone={<MdDriveFileRenameOutline />}
                                    id="email"
                                    label="admin@ssjt.com"
                                    nome="email"
                                    placeholder="Informe seu email..."
                                    setValor={setEmail}
                                    valor={email}
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
                                    opcoes={opcoesOrgaoEmissor}
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

                                <InputData
                                    icone={<MdDriveFileRenameOutline />}
                                    id="dataEmissaoRg"
                                    label="Data de Emissão"
                                    nome="dataEmissaoRg"
                                    placeholder=""
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
                                    onClick={handleSubmit}
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