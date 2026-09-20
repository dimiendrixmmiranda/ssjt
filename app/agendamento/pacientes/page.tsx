'use client'
import InputData from "@/components/assets/inputs/InputData";
import InputSelect from "@/components/assets/inputs/InputSelect";
import InputTexto from "@/components/assets/inputs/InputTexto";
import Image from "next/image";
import { Dialog } from "primereact/dialog";
import { useState } from "react";
import { FaPlus, FaRegLightbulb, FaRegUser } from "react-icons/fa6";
import { FiUserPlus } from "react-icons/fi";
import { HiMagnifyingGlassCircle, HiOutlineCalendarDateRange } from "react-icons/hi2";
import { IoClose } from "react-icons/io5";
import { MdDriveFileRenameOutline } from "react-icons/md";
import { PiMagnifyingGlassFill } from "react-icons/pi";
import { RiDeleteBin5Line, RiUserSearchFill } from "react-icons/ri";
import { AiOutlineSelect } from "react-icons/ai";
import InputCheckbox from "@/components/assets/inputs/InputCheckbox";
import { useLocaisDeAtendimento } from "@/hooks/useLocaisDeAtendimento";
import { limparCampos } from "@/lib/utils";
import { identificarTipoBuscaPaciente, removerCaracteresEspeciais } from "@/lib/buscaPaciente";
import { Paciente } from "@/app/generated/prisma/client";
import { LuUserRoundSearch } from "react-icons/lu";
import { TiUserDelete } from "react-icons/ti";
import { BiSolidEdit } from "react-icons/bi";
import { Paginator, PaginatorPageChangeEvent } from "primereact/paginator";
import MenuContextoPaciente from "@/components/assets/contextoDeAtendimento/ContextoDeAtendimento";
import { calcularIdade } from "@/lib/calcularIdade";

export default function Page() {
    const { locais, buscarLocais } = useLocaisDeAtendimento()
    const [pesquisarPaciente, setPesquisarPaciente] = useState('')
    const [pacientesEncontrados, setPacientesEncontrados] = useState<Paciente[]>([])
    const [visible, setVisible] = useState(false);

    const [editar, setEditar] = useState(false);
    const [pacienteEditandoId, setPacienteEditandoId] = useState<string | null>(null);

    const [menuContexto, setMenuContexto] = useState<{
        x: number
        y: number
        atendimento: typeof pacientesEncontrados[number]
    } | null>(null)

    const [first, setFirst] = useState(0)
    const [rows] = useState(5)

    // Formulario
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

    const editarPaciente = (paciente: Paciente) => {
        setPacienteEditandoId(paciente.id);

        setNome(paciente.nome ?? "");
        setNomeSocial(paciente.nomeSocial ?? "");
        setDeclaroNaoPossuirNomeSocial(
            paciente.declaroNaoPossuirNomeSocial ?? false
        );
        setNomeDaMae(paciente.nomeDaMae ?? "");
        setNomeDoPai(paciente.nomeDoPai ?? "");

        setDataDeNascimento(
            paciente.dataDeNascimento
                ? new Date(paciente.dataDeNascimento)
                    .toISOString()
                    .split("T")[0]
                : ""
        );

        setSexo(paciente.sexo ?? "");
        setEstadoCivil(paciente.estadoCivil ?? "");
        setCorRaca(paciente.corRaca ?? "");

        setCpf(paciente.cpf ?? "");
        setCartaoSus(paciente.cartaoSus ?? "");
        setNis(paciente.nis ?? "");
        setUnidadeDeSaude(paciente.unidadeDeSaude ?? "");
        setCodigoGsus(paciente.codigoGsus ?? "");
        setCodigoIds(paciente.codigoIds ?? "");
        setTipoSanguineo(paciente.tipoSanguineo ?? "");
        setFatorRh(paciente.fatorRh ?? "");
        setObservacoes(paciente.observacoes ?? "");

        // CONTATO
        setTelefone1(paciente.telefone1 ?? "");
        setTelefone2(paciente.telefone2 ?? "");
        setEmail(paciente.email ?? "");

        // DOCUMENTOS
        setRg(paciente.rg ?? "");
        setOrgaoEmissor(paciente.orgaoEmissor ?? "");
        setUfRg(paciente.ufRg ?? "");

        setDataEmissaoRg(
            paciente.dataEmissaoRg
                ? new Date(paciente.dataEmissaoRg)
                    .toISOString()
                    .split("T")[0]
                : ""
        );

        setCpfRegular(paciente.cpfRegular ?? "");
        setCpfCns(paciente.cpfCns ?? "");
        setCnsMae(paciente.cnsMae ?? "");
        setOrientacaoRegCpf(paciente.orientacaoRegCpf ?? "");

        // TÍTULO
        setTituloEleitor(paciente.tituloEleitor ?? "");
        setZonaEleitoral(paciente.zonaEleitoral ?? "");
        setSecaoEleitoral(paciente.secaoEleitoral ?? "");

        // TRABALHISTA
        setCtpsNumero(paciente.ctpsNumero ?? "");
        setCtpsSerie(paciente.ctpsSerie ?? "");
        setCtpsUf(paciente.ctpsUf ?? "");

        setCtpsDataEmissao(
            paciente.ctpsDataEmissao
                ? new Date(paciente.ctpsDataEmissao)
                    .toISOString()
                    .split("T")[0]
                : ""
        );

        setPisPasep(paciente.pisPasep ?? "");

        // EDUCAÇÃO
        setFrequentaEscola(paciente.frequentaEscola ?? "");
        setEscola(paciente.escola ?? "");
        setSerieEscolar(paciente.serieEscolar ?? "");
        setGrauEscolaridade(paciente.grauEscolaridade ?? "");
        setCursoProfissionalizante(paciente.cursoProfissionalizante ?? "");

        // NATURALIZAÇÃO
        setPaisOrigem(paciente.paisOrigem ?? "");

        setEntradaBrasil(
            paciente.entradaBrasil
                ? new Date(paciente.entradaBrasil)
                    .toISOString()
                    .split("T")[0]
                : ""
        );

        setNumeroPortaria(paciente.numeroPortaria ?? "");

        setDataNaturalizacao(
            paciente.dataNaturalizacao
                ? new Date(paciente.dataNaturalizacao)
                    .toISOString()
                    .split("T")[0]
                : ""
        );

        // LOCALIDADE
        setPais(paciente.pais ?? "");
        setUf(paciente.uf ?? "");
        setMunicipio(paciente.municipio ?? "");
        setBairro(paciente.bairro ?? "");
        setRua(paciente.rua ?? "");
        setNumero(paciente.numero ?? "");
        setComplemento(paciente.complemento ?? "");

        // GEOLOCALIZAÇÃO
        setLatitude(
            paciente.latitude !== null && paciente.latitude !== undefined
                ? String(paciente.latitude)
                : ""
        );

        setLongitude(
            paciente.longitude !== null && paciente.longitude !== undefined
                ? String(paciente.longitude)
                : ""
        );

        setZona(paciente.zona ?? "");

        setEditar(true);
    };

    const opcoesSexo = [
        { valor: "", label: "Selecione" },
        { valor: "MASCULINO", label: "Masculino" },
        { valor: "FEMININO", label: "Feminino" },
        { valor: "OUTRO", label: "Outro" },
        { valor: "NAO_INFORMADO", label: "Não informado" },
    ]
    const opcoesEstadoCivil = [
        { valor: "", label: "Selecione" },
        { valor: "SOLTEIRO", label: "Solteiro(a)" },
        { valor: "CASADO", label: "Casado(a)" },
        { valor: "DIVORCIADO", label: "Divorciado(a)" },
        { valor: "VIUVO", label: "Viúvo(a)" },
        { valor: "SEPARADO", label: "Separado(a)" },
        { valor: "UNIAO_ESTAVEL", label: "União estável" },
    ]
    const opcoesCorRaca = [
        { valor: "", label: "Selecione" },
        { valor: "BRANCA", label: "Branca" },
        { valor: "PRETA", label: "Preta" },
        { valor: "PARDA", label: "Parda" },
        { valor: "AMARELA", label: "Amarela" },
        { valor: "INDIGENA", label: "Indígena" },
        { valor: "NAO_INFORMADO", label: "Não informado" },
    ]
    const opcoesTipoSanguineo = [
        { valor: "", label: "Selecione" },
        { valor: "A", label: "A" },
        { valor: "B", label: "B" },
        { valor: "AB", label: "AB" },
        { valor: "O", label: "O" },
    ]
    const opcoesRh = [
        { valor: "", label: "Selecione" },
        { valor: "POSITIVO", label: "Positivo (+)" },
        { valor: "NEGATIVO", label: "Negativo (-)" },
    ]
    const opcoesSimNao = [
        { valor: "", label: "Selecione" },
        { valor: "SIM", label: "Sim" },
        { valor: "NAO", label: "Não" },
    ]
    const opcoesUf = [
        { valor: "", label: "Selecione" },
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
        { valor: "", label: "Selecione" },
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
    const opcoesOrgaoEmissor = [
        { valor: "", label: "Selecione" },
        { valor: "SSP", label: "SSP" },
        { valor: "DETRAN", label: "DETRAN" },
        { valor: "POLICIA_CIVIL", label: "Polícia Civil" },
        { valor: "OUTRO", label: "Outro" },
    ]
    const opcoesDeUnidadeDeSaudeDoPaciente = [
        {
            valor: '',
            label: 'Selecione'
        },
        ...locais.map(local => ({
            valor: local.id.toString(),
            label: local.nome
        }))
    ]

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

    const handleSubmit = async () => {
        try {
            if (!nome.trim()) {
                throw new Error("Informe o nome do paciente.");
            }

            if (!nomeDaMae.trim()) {
                throw new Error("Informe o nome da mãe.");
            }

            if (!dataDeNascimento) {
                throw new Error("Informe a data de nascimento.");
            }

            if (!sexo) {
                throw new Error("Selecione o sexo.");
            }

            if (!cpf.trim()) {
                throw new Error("Informe o CPF.");
            }

            if (!telefone1.trim()) {
                throw new Error("Informe o telefone principal.");
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

                dataDeNascimento,

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
                cursoProfissionalizante:
                    cursoProfissionalizante.trim() || null,

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

                latitude: latitude.trim()
                    ? Number(latitude)
                    : null,

                longitude: longitude.trim()
                    ? Number(longitude)
                    : null,
            };

            const url = pacienteEditandoId
                ? `/api/pacientes/${pacienteEditandoId}`
                : "/api/pacientes";

            const method = pacienteEditandoId
                ? "PUT"
                : "POST";

            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(paciente),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.erro ||
                    data.error ||
                    "Erro ao salvar paciente."
                );
            }

            alert(
                pacienteEditandoId
                    ? "Paciente atualizado com sucesso!"
                    : "Paciente cadastrado com sucesso!"
            );

            // Atualiza a lista
            if (pacienteEditandoId) {
                setPacientesEncontrados((atual) =>
                    atual.map((item) =>
                        item.id === pacienteEditandoId
                            ? data
                            : item
                    )
                );
            } else {
                setPacientesEncontrados((atual) => [
                    ...atual,
                    data,
                ]);
            }

            setVisible(false);
            setEditar(false);
            setPacienteEditandoId(null);

            limparFormulario();

        } catch (error) {
            console.error(
                "ERRO AO SALVAR PACIENTE:",
                error
            );

            alert(
                error instanceof Error
                    ? error.message
                    : "Erro ao salvar paciente."
            );
        }
    }

    const handleBuscarPaciente = async () => {
        const valor = pesquisarPaciente.trim()

        if (!valor) {
            return
        }

        const tipo = identificarTipoBuscaPaciente(valor)

        console.log("Busca:", {
            tipo,
            valor,
        })

        try {
            const params = new URLSearchParams()

            params.set("tipo", tipo)
            params.set("valor", valor)

            const response = await fetch(
                `/api/pacientes/buscar?${params.toString()}`
            )

            const data = await response.json()

            if (!response.ok) {
                throw new Error(
                    data.erro ||
                    data.error ||
                    "Erro ao pesquisar paciente."
                )
            }

            console.log("PACIENTES ENCONTRADOS:", data)
            setPacientesEncontrados(data)
        } catch (error) {
            console.error(
                "ERRO AO BUSCAR PACIENTE:",
                error
            )
        }
    }

    const tipoBusca = pesquisarPaciente.trim()
        ? identificarTipoBuscaPaciente(pesquisarPaciente)
        : null

    const formulario = () => {
        return (
            <div className="bg-white text-verde-escuro font-arimo border-2 border-verde-escuro rounded-lg">
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

                            <div className="grid grid-cols-[1fr_230px] gap-3 items-center">
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
                                opcoes={opcoesDeUnidadeDeSaudeDoPaciente}
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
                        <Image alt="Logo do SSJT" src={'/logo/logo-sistema-de-saude.png'} fill className="object-contain" />
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
                            <p>
                                {editar
                                    ? "Atualizar Paciente"
                                    : "Salvar Paciente"}
                            </p>
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <>
            <div className="p-4 flex flex-col gap-4 row-span-2 h-full">
                <div className="flex items-center justify-between gap-6">
                    <div className="flex items-center my-auto gap-2 text-verde-escuro">
                        <RiUserSearchFill className="text-5xl" />
                        <div className="flex flex-col">
                            <h3 className="text-3xl font-bold">Pacientes</h3>
                            <p className="-mt-1">Busque informações de algum paciente</p>
                        </div>
                    </div>
                    <div>
                        <button onClick={() => {
                            limparFormulario();
                            setPacienteEditandoId(null);
                            setEditar(false);
                            setVisible(true);
                        }}
                            className="flex items-center gap-2 rounded-lg px-4 h-[45px] bg-verde-escuro text-white font-bold"
                        >
                            <FaPlus />
                            <p>Adicionar Paciente</p>
                        </button>
                    </div>
                </div>
                <div className="relative flex flex-col gap-2 p-4 pb-6 rounded-lg shadow-[0px_0px_2px_1px_var(--verde-escuro)]">
                    <div className="flex items-center gap-2">
                        <HiMagnifyingGlassCircle className="text-3xl text-verde-escuro" />
                        <h3 className="font-bold text-2xl">Pesquisar Paciente</h3>
                    </div>
                    <div className="flex flex-col gap-2 relative">
                        <div className="flex items-center gap-2 w-full">
                            <div className="relative flex-1">
                                <PiMagnifyingGlassFill className="absolute top-[50%] left-2 text-lg" style={{ transform: 'translate(0,-50%)' }} />
                                <input className="border border-verde-escuro rounded-lg h-[40px] pl-8 w-full" type="search" name="pesquisarPaciente" id="pesquisarPaciente" value={pesquisarPaciente} onChange={(e) => setPesquisarPaciente(e.target.value)} />
                            </div>
                            <button onClick={handleBuscarPaciente} className="flex items-center gap-2 bg-verde h-[40px] rounded-lg px-4 font-bold text-white text-shadow-[1px_1px_2px_black]">
                                <PiMagnifyingGlassFill />
                                <p>Buscar</p>
                            </button>
                            <button className="flex items-center gap-2 bg-verde h-[40px] rounded-lg px-4 font-bold text-white text-shadow-[1px_1px_2px_black]">
                                <PiMagnifyingGlassFill />
                                <p>Filtros Avançados</p>
                            </button>
                            <button className="flex items-center gap-2 bg-verde h-[40px] rounded-lg px-4 font-bold text-white text-shadow-[1px_1px_2px_black]">
                                <PiMagnifyingGlassFill />
                                <p>Limpar Pesquisa</p>
                            </button>
                        </div>
                        <div className="absolute left-0 bottom-0">
                            {tipoBusca && (
                                <span className="absolute -bottom-5 left-1 text-xs text-gray-500 whitespace-nowrap flex gap-1">
                                    Buscando por:{" "}
                                    <strong className="whitespace-nowrap w-full flex">
                                        {tipoBusca === "CPF" && "CPF"}
                                        {tipoBusca === "NOME" && "Nome"}
                                        {tipoBusca === "DATA_NASCIMENTO" && "Data de nascimento"}
                                        {tipoBusca === "CARTAO_SUS" && "Cartão SUS"}
                                    </strong>
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {
                    pacientesEncontrados.length > 0 ? (
                        <div className="relative flex flex-col gap-2 p-4 pb-6 rounded-lg shadow-[0px_0px_2px_1px_var(--verde-escuro)] overflow-hidden h-full">
                            <div className="flex items-center gap-2">
                                <LuUserRoundSearch className="text-3xl" />
                                <h3 className="font-bold text-2xl mt-1">Resultado da sua busca</h3>
                            </div>
                            <div className="barraDeRolagemBusca overflow-x-scroll pb-2">
                                <ul className="grid grid-cols-[100px_250px_120px_140px_250px_140px_140px_170px_250px_150px_150px_150px]">
                                    <li className="border border-verde p-1 px-2 bg-verde-escuro text-white font-bold flex justify-center items-center">
                                        <p>ID</p>
                                    </li>
                                    <li className="border border-verde p-1 px-2 bg-verde-escuro text-white font-bold flex items-center">
                                        <p>Nome</p>
                                    </li>
                                    <li className="border border-verde p-1 px-2 bg-verde-escuro text-white font-bold flex justify-center items-center">
                                        <p>Nascimento</p>
                                    </li>
                                    <li className="border border-verde p-1 px-2 bg-verde-escuro text-white font-bold flex justify-center items-center">
                                        <p>Idade</p>
                                    </li>
                                    <li className="border border-verde p-1 px-2 bg-verde-escuro text-white font-bold flex items-center">
                                        <p>Nome da Mãe</p>
                                    </li>
                                    <li className="border border-verde p-1 px-2 bg-verde-escuro text-white font-bold flex justify-center items-center">
                                        <p>Sexo</p>
                                    </li>
                                    <li className="border border-verde p-1 px-2 bg-verde-escuro text-white font-bold flex justify-center items-center">
                                        <p>CPF</p>
                                    </li>
                                    <li className="border border-verde p-1 px-2 bg-verde-escuro text-white font-bold flex justify-center items-center">
                                        <p>Cartão SUS</p>
                                    </li>
                                    <li className="border border-verde p-1 px-2 bg-verde-escuro text-white font-bold flex items-center">
                                        <p>Un. do Cliente</p>
                                    </li>
                                    <li className="border border-verde p-1 px-2 bg-verde-escuro text-white font-bold flex justify-center items-center">
                                        <p>Código IDS</p>
                                    </li>
                                    <li className="border border-verde p-1 px-2 bg-verde-escuro text-white font-bold flex justify-center items-center">
                                        <p>Código GSUS</p>
                                    </li>
                                    <li className="border border-verde p-1 px-2 bg-verde-escuro text-white font-bold flex justify-center items-center">
                                        <p>Detalhes</p>
                                    </li>
                                </ul>
                                {
                                    pacientesEncontrados.map((paciente, i) => {
                                        // const unidadeDoPaciente = locais.find(local => local.id === paciente.unidadeDeSaude)
                                        return (
                                            <ul
                                                onContextMenu={(e) => {
                                                    e.preventDefault()
                                                    setMenuContexto({
                                                        x: e.clientX,
                                                        y: e.clientY - 200,
                                                        atendimento: paciente,
                                                    })
                                                }}
                                                key={i}
                                                className="grid grid-cols-[100px_250px_120px_140px_250px_140px_140px_170px_250px_150px_150px_150px] h-[50px]"
                                            >
                                                <li className="border border-verde p-1 px-2 flex justify-center items-center">
                                                    <p>{paciente.codigoIds}</p>
                                                </li>
                                                <li className="border border-verde p-1 px-2 flex items-center">
                                                    <p>{paciente.nome}</p>
                                                </li>
                                                <li className="border border-verde p-1 px-2 flex justify-center items-center">
                                                    <p>
                                                        {new Date(paciente.dataDeNascimento).toLocaleDateString("pt-BR")}
                                                    </p>
                                                </li>
                                                <li className="border border-verde p-1 px-2 flex justify-center items-center text-center">
                                                    <p className="leading-5">{calcularIdade(paciente.dataDeNascimento)}</p>
                                                </li>
                                                <li className="border border-verde p-1 px-2 flex items-center">
                                                    <p>{paciente.nomeDaMae}</p>
                                                </li>
                                                <li className="border border-verde p-1 px-2 flex justify-center items-center">
                                                    <p>{paciente.sexo}</p>
                                                </li>
                                                <li className="border border-verde p-1 px-2 flex justify-center items-center">
                                                    <p>{paciente.cpf}</p>
                                                </li>
                                                <li className="border border-verde p-1 px-2 flex justify-center items-center">
                                                    <p>{paciente.cartaoSus}</p>
                                                </li>
                                                <li className="border border-verde p-1 px-2 flex items-center">
                                                    <p>auqi</p>
                                                </li>
                                                <li className="border border-verde p-1 px-2 flex justify-center items-center">
                                                    <p>{paciente.codigoIds}</p>
                                                </li>
                                                <li className="border border-verde p-1 px-2 flex justify-center items-center">
                                                    <p>{paciente.codigoGsus}</p>
                                                </li>
                                                <li className="flex justify-center items-center border border-verde p-1 px-2">
                                                    <div className="grid grid-cols-3 gap-2">
                                                        <button className="flex justify-center items-center rounded-full border border-amber-500 text-amber-500 w-7 h-7 mx-auto duration-200 transition-all hover:bg-amber-500 hover:text-white" onClick={() => editarPaciente(paciente)}><BiSolidEdit /></button>
                                                        <button className="flex justify-center items-center rounded-full border border-red-500 text-red-500 w-7 h-7 mx-auto duration-200 transition-all hover:bg-red-500 hover:text-white"><RiDeleteBin5Line /></button>
                                                        <button className="flex justify-center items-center rounded-full border border-purple-600 text-purple-600 w-7 h-7 mx-auto duration-200 transition-all hover:bg-purple-600 hover:text-white"><TiUserDelete /></button>
                                                    </div>
                                                </li>
                                            </ul>
                                        )
                                    })
                                }
                            </div>
                            <div className="grid grid-cols-[300px_1fr] mt-auto -mb-2">
                                <p className="my-auto">Mostrando 1 a 5 de 5 registros</p>
                                <Paginator
                                    first={first}
                                    rows={rows}
                                    totalRecords={pacientesEncontrados.length}
                                    onPageChange={(event: PaginatorPageChangeEvent) => {
                                        setFirst(event.first)
                                    }}
                                    className="my-auto"
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="relative flex flex-col items-center justify-center gap-2 p-4 rounded-lg shadow-[0px_0px_2px_1px_var(--verde-escuro)] overflow-hidden h-full">
                            <div className="relative w-[300px] h-[300px]">
                                <Image alt="Lupa de pesquisa" src={'/assets/lupa-pacientes.png'} fill className="object-contain" />
                            </div>
                            <div className="flex flex-col justify-center items-center">
                                <h3 className="font-bold text-2xl">Pesquise um paciente para começar</h3>
                                <p>Informe o nome, data de nascimento, cpf ou cartão SUS para visualizar os resultados encontrados.</p>
                            </div>
                            <div className="relative flex items-center gap-2 p-2 rounded-lg shadow-[0px_0px_2px_1px_var(--verde-escuro)] overflow-hidden mt-4">
                                <FaRegLightbulb className="text-verde-escuro" />
                                <p>Você vera somente os pacientes correspondentes à sua busca.</p>
                            </div>
                        </div>
                    )
                }

            </div>
            <Dialog
                visible={visible || editar}
                onHide={() => {
                    setVisible(false);
                    setEditar(false);
                    setPacienteEditandoId(null);
                    limparFormulario();
                }}
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
                        {editar ? (
                            <BiSolidEdit className="text-5xl" />
                        ) : (
                            <FiUserPlus className="text-5xl" />
                        )}

                        <div>
                            <h3 className="text-2xl font-bold">
                                {editar
                                    ? "Editar Paciente"
                                    : "Adicionar Paciente"}
                            </h3>

                            <p className="text-sm font-normal opacity-90">
                                {editar
                                    ? "Altere as informações cadastrais do paciente"
                                    : "Preencha as informações cadastrais do paciente"}
                            </p>
                        </div>
                    </div>
                }
            >
                {formulario()}
            </Dialog>
        </>
    )
}