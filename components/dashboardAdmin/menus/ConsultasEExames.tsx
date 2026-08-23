import InputSelect from "@/components/assets/InputSelect";
import InputTexto from "@/components/assets/InputTexto";
import { Condicao, CondicaoOption, TipoDeDado, TipoDeDadoOption } from "@/enum/enums";
import { useLocais } from "@/hooks/useLocais";
import { useEffect, useState } from "react";
import { AiOutlineSelect } from "react-icons/ai";
import { FaLaptopMedical } from "react-icons/fa";
import { MdDriveFileRenameOutline } from "react-icons/md";
import { TiPlus } from "react-icons/ti";
import { Dialog } from 'primereact/dialog';
import { usePacientes } from "@/hooks/usePacientes";
import { CategoriaAtendimento, Paciente, Prestador, TipoAtendimento } from "@/app/generated/prisma/client";
import { FaUserPen } from "react-icons/fa6";
import { useEspecialidades } from "@/hooks/useEspecialidades";
import { usePrestadores } from "@/hooks/usePrestadores";
import { HiOutlineCalendarDateRange } from "react-icons/hi2";
import InputData from "@/components/assets/InputData";
import Image from "next/image";
import { useAtendimentos } from "@/hooks/useAtendimento";
import calcularIdade from "@/utils/calcularIdade";

export default function ConsultasEExames() {
    const [buttonActive, setButtonActive] = useState<'todos' | 'consultas' | 'exames' | 'cirurgias'>('todos')
    const [visible, setVisible] = useState(false);

    const { pacientes } = usePacientes()
    const { prestadores } = usePrestadores()
    const { especialidades } = useEspecialidades()
    const { locais } = useLocais()
    const { atendimentos } = useAtendimentos()

    const [buscarPaciente, setBuscarPaciente] = useState('')
    const [buscarPrestador, setBuscarPrestador] = useState('')

    const pacientesFiltrados = pacientes.filter((paciente) => {
        if (!buscarPaciente.trim()) return false

        const busca = buscarPaciente.toLowerCase().trim()

        return (
            paciente.nome.toLowerCase().includes(busca) ||
            paciente.cpf?.includes(busca) ||
            paciente.cartaoSus?.includes(busca)
        )
    }).slice(0, 8)

    const unidadesSolicitantesDaCidade = locais.filter(local => local.cep == '86455000')

    // filtros de busca
    const [tipoDeDado, setTipoDeDado] = useState<TipoDeDado>(TipoDeDado.NOME)
    const [condicao, setCondicao] = useState<Condicao>(Condicao.IGUAL)
    const [unidadeCliente, setUnidadeCliente] = useState("")
    const [valorDaBusca, setValorDaBusca] = useState("")

    // Origem
    const [pacienteAtual, setPacienteAtual] = useState<Paciente | null>(null)
    const [unidadeDeOrigem, setUnidadeDeOrigem] = useState("")
    const [dataDeEntrada, setDataDeEntrada] = useState('')
    const [prestadorAtual, setPrestadorAtual] = useState<Prestador | null>(null)
    const [especialidadeDoPrestador, setEspecialidadeDoPrestador] = useState<string>('')

    // Destino
    const [categoriaAtendimento, setCategoriaDeAtendimento] = useState<CategoriaAtendimento | null>(null)
    const [especialidadeEncaminhada, setEspecialidadeEncaminhada] = useState('')
    const [tipoDeConsulta, setTipoDeConsulta] = useState('')
    const [situacao, setSituacao] = useState('')

    console.log(categoriaAtendimento)

    const normalizarTexto = (texto: string) =>
        texto
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase()

    const prestadoresFiltrados = prestadores.filter((prestador) =>
        normalizarTexto(prestador.nome).includes(
            normalizarTexto(buscarPrestador)
        )
    )

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

    const opcoesUnidades = unidadesSolicitantesDaCidade.map(local => ({
        label: local.nome,
        valor: local.id
    }))
    const opcoesUnidadesDeOrigem = unidadesSolicitantesDaCidade.map(local => ({
        label: local.nome,
        valor: local.id
    }))

    const opcoesEspecialidade = [
        ...especialidades
            .filter((esp) => esp.id === prestadorAtual?.especialidadeId)
            .map((esp) => ({
                valor: esp.id,
                label: esp.nome
            }))
    ]

    const opcoesEspecialidadesFiltradas = especialidades
        .filter((esp) => {
            if (!categoriaAtendimento) return false

            return esp.categoria === categoriaAtendimento
        })
        .map((esp) => ({
            valor: esp.id,
            label: esp.nome
        }))

    const opcoesCategoriaDeAtendimento: {
        valor: CategoriaAtendimento
        label: string
    }[] = [
            {
                valor: 'CONSULTA' as CategoriaAtendimento,
                label: 'Consulta'
            },
            {
                valor: 'PROCEDIMENTO' as CategoriaAtendimento,
                label: 'Procedimento'
            },
            {
                valor: 'CIRURGIA' as CategoriaAtendimento,
                label: 'Cirurgia'
            }
        ]

    const opcoesDePrioridade = [
        {
            valor: 'URGENTE',
            label: 'Urgente'
        },
        {
            valor: 'PRIORIDADE',
            label: 'Prioridade'
        },
        {
            valor: 'NORMAL',
            label: 'Normal'
        },
    ]
    const opcoesTipoDeConsulta = [
        {
            valor: 'PRIMEIRA_CONSULTA',
            label: '1º Consulta'
        },
        {
            valor: 'RETORNO',
            label: 'Retorno'
        },
    ]

    const getPrioridadeClass = (prioridade: string) => {
        switch (prioridade) {
            case "URGENTE":
                return "bg-red-100 text-red-700 border border-red-200"

            case "PRIORIDADE":
                return "bg-yellow-100 text-yellow-700 border border-yellow-200"

            default:
                return "bg-green-100 text-green-700 border border-green-200"
        }
    }

    useEffect(() => {
        setEspecialidadeEncaminhada('')
    }, [categoriaAtendimento])


    const handleSubmit = async () => {
        if (!pacienteAtual) {
            alert("Selecione um paciente.");
            return;
        }

        if (!prestadorAtual) {
            alert("Selecione o médico solicitante.");
            return;
        }

        try {
            const response = await fetch("/api/atendimento", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    pacienteId: pacienteAtual.id,
                    unidadeDeOrigemId: unidadeDeOrigem,
                    dataDeEntrada,
                    medicoSolicitanteId: prestadorAtual.id,
                    especialidadeDoMedicoSolicitante: especialidadeDoPrestador,
                    categoriaAtendimento,
                    especialidadeId: especialidadeEncaminhada,
                    situacao,
                    tipoDeConsulta:
                        categoriaAtendimento === "CONSULTA"
                            ? tipoDeConsulta
                            : null,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.erro || "Erro ao cadastrar atendimento.");
            }

            console.log("Atendimento cadastrado:", data);

            setVisible(false);

            // limpar formulário aqui
        } catch (error) {
            console.error(error);

            alert(
                error instanceof Error
                    ? error.message
                    : "Erro ao cadastrar atendimento."
            );
        }
    };

    return (
        <div className="p-4 flex flex-col gap-4 font-arimo text-verde-escuro overflow-hidden">
            <div className="flex justify-between">
                <div className="flex items-center gap-2">
                    <FaLaptopMedical className="text-6xl" />
                    <div className="">
                        <h3 className="text-2xl font-bold">Consultas e Exames</h3>
                        <span>Busque, adicione, edite uma nova consulta ou exame.</span>
                    </div>
                </div>
                <button onClick={() => setVisible(true)} className={`rounded-lg p-2 font-bold flex items-center gap-2 h-fit my-auto border border-verde text-verde transition-all duration-300 hover:text-white hover:bg-verde`}>
                    <TiPlus />
                    <p>Nova Consulta/Exame/Cirurgia</p>
                </button>
            </div>

            {/* filtros */}
            <div>
                <div className="grid grid-cols-[160px_160px_200px_1fr_140px] gap-4">
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
                    <InputTexto icone={<MdDriveFileRenameOutline />} id="valor" label="Valor" nome="valor" placeholder="valor..." setValor={setValorDaBusca} valor={valorDaBusca} />
                    <button className="font-bold bg-verde text-white h-fit mt-auto py-2 rounded-lg">Buscar</button>
                </div>
            </div>

            <div>
                <div className="border border-zinc-200 rounded-t-lg">
                    <button onClick={() => setButtonActive('todos')} className={`p-4 font-bold ${buttonActive === 'todos' ? 'text-verde border-b-3 border-verde' : 'text-gray-700'}`}>
                        <p>Todos</p>
                    </button>
                    <button onClick={() => setButtonActive('consultas')} className={`p-4 font-bold ${buttonActive === 'consultas' ? 'text-verde border-b-3 border-verde' : 'text-gray-700'}`}>
                        <p>Consultas</p>
                    </button>
                    <button onClick={() => setButtonActive('exames')} className={`p-4 font-bold ${buttonActive === 'exames' ? 'text-verde border-b-3 border-verde' : 'text-gray-700'}`}>
                        <p>Exames</p>
                    </button>
                    <button onClick={() => setButtonActive('cirurgias')} className={`p-4 font-bold ${buttonActive === 'cirurgias' ? 'text-verde border-b-3 border-verde' : 'text-gray-700'}`}>
                        <p>Cirurgias</p>
                    </button>
                </div>
                <div className="mt-4">
                    <div className="w-full overflow-x-auto border border-zinc-200 rounded-t-lg rounded-b-lg text-sm">
                        <ul className="grid grid-cols-[100px_160px_130px_240px_120px_130px_180px_250px_100px_250px_250px_150px_190px_180px_190px_120px] min-w-max">
                            <li className="p-3 font-bold whitespace-nowrap text-center border border-zinc-200">
                                <p>ID</p>
                            </li>
                            <li className="p-3 font-bold whitespace-nowrap text-center border border-zinc-200">
                                <p>Data da Solicitação</p>
                            </li>
                            <li className="p-3 font-bold whitespace-nowrap text-center border border-zinc-200">
                                <p>Prioridade</p>
                            </li>
                            <li className="p-3 font-bold whitespace-nowrap text-center border border-zinc-200">
                                <p>Paciente</p>
                            </li>
                            <li className="p-3 font-bold whitespace-nowrap text-center border border-zinc-200">
                                <p>Tipo</p>
                            </li>
                            <li className="p-3 font-bold whitespace-nowrap text-center border border-zinc-200">
                                <p>Situação</p>
                            </li>
                            <li className="p-3 font-bold whitespace-nowrap text-center border border-zinc-200">
                                <p>Data de Nascimento</p>
                            </li>
                            <li className="p-3 font-bold whitespace-nowrap text-center border border-zinc-200">
                                <p>Nome da Mãe</p>
                            </li>
                            <li className="p-3 font-bold whitespace-nowrap text-center border border-zinc-200">
                                <p>Idade</p>
                            </li>
                            <li className="p-3 font-bold whitespace-nowrap text-center border border-zinc-200">
                                <p>Profissional Solicitante</p>
                            </li>
                            <li className="p-3 font-bold whitespace-nowrap text-center border border-zinc-200">
                                <p>Especialidade/Procedimento</p>
                            </li>
                            <li className="p-3 font-bold whitespace-nowrap text-center border border-zinc-200">
                                <p>Data de Retorno</p>
                            </li>
                            <li className="p-3 font-bold whitespace-nowrap text-center border border-zinc-200">
                                <p>Unidade de Saúde</p>
                            </li>
                            <li className="p-3 font-bold whitespace-nowrap text-center border border-zinc-200">
                                <p>Data da Realização</p>
                            </li>
                            <li className="p-3 font-bold whitespace-nowrap text-center border border-zinc-200">
                                <p>Local da Realização</p>
                            </li>
                            <li className="p-3 font-bold whitespace-nowrap text-center border border-zinc-200">
                                <p>Ações</p>
                            </li>
                        </ul>
                        <ul className="text-zinc-800">
                            {atendimentos.map((item, i) => {
                                console.log(item)
                                const paciente = pacientes.find(pac => pac.id === item.pacienteId)
                                const medicoSolicitante = prestadores.find(pres => pres.id === item.medicoSolicitanteId)

                                return (
                                    <li key={i}>
                                        <ul className={`
                                                grid grid-cols-[100px_160px_130px_240px_120px_130px_180px_250px_100px_250px_250px_150px_190px_180px_190px_120px] min-w-max
                                                transition-all duration-200 font-semibold
                                                ${item.categoriaAtendimento === 'CONSULTA' ? 'bg-blue-100 hover:bg-blue-200' : ''}
                                                ${item.categoriaAtendimento === 'PROCEDIMENTO' ? 'bg-orange-100 hover:bg-orange-200' : ''}
                                                ${item.categoriaAtendimento === 'CIRURGIA' ? 'bg-red-100 hover:bg-red-200' : ''}
                                            `}>
                                            <li className="truncate p-3 text-center border border-zinc-200">
                                                {item.id}
                                            </li>

                                            <li className="truncate p-3 text-center border border-zinc-200 whitespace-nowrap">
                                                {new Date(item.dataDeEntrada)
                                                    .toISOString()
                                                    .split("T")[0]
                                                    .split("-")
                                                    .reverse()
                                                    .join("/")}
                                            </li>

                                            <li className="truncate p-3 text-center border border-zinc-200">
                                                <span
                                                    className={`inline-flex px-3 py-1 rounded-full text-xs font-bold ${getPrioridadeClass(
                                                        item.situacao
                                                    )}`}
                                                >
                                                    {item.situacao}
                                                </span>
                                            </li>

                                            <li className="truncate p-3 border border-zinc-200">
                                                {paciente?.nome}
                                            </li>

                                            <li className="truncate p-3 text-center border border-zinc-200">
                                                {item.categoriaAtendimento}
                                            </li>

                                            <li className="truncate p-3 text-center border border-zinc-200">
                                                Em espera
                                            </li>

                                            <li className="truncate p-3 text-center border border-zinc-200 whitespace-nowrap">
                                                {paciente?.dataDeNascimento
                                                    ? new Date(paciente.dataDeNascimento)
                                                        .toISOString()
                                                        .split("T")[0]
                                                        .split("-")
                                                        .reverse()
                                                        .join("/")
                                                    : "-"}
                                            </li>

                                            <li className="truncate p-3 border border-zinc-200">
                                                {paciente?.nomeDaMae}
                                            </li>

                                            <li className="truncate p-3 text-center border border-zinc-200">
                                                {calcularIdade(paciente?.dataDeNascimento)}
                                                22
                                            </li>

                                            <li className="truncate p-3 border border-zinc-200">
                                                {medicoSolicitante?.nome}
                                            </li>

                                            <li className="truncate p-3 border border-zinc-200">
                                                {medicoSolicitante?.especialidadeId}
                                            </li>

                                            <li className="truncate p-3 text-center border border-zinc-200 whitespace-nowrap">
                                                {/* {item.dataRetorno} */}
                                            </li>

                                            <li className="truncate p-3 border border-zinc-200">
                                                {item.unidadeDeOrigemId}
                                            </li>

                                            <li className="truncate p-3 text-center border border-zinc-200 whitespace-nowrap">
                                                {/* {item.dataRealizacao} */}
                                            </li>

                                            <li className="truncate p-3 border border-zinc-200">
                                                {/* {item.localRealizacao} */}
                                            </li>

                                            <li className="truncate p-3 text-center border border-zinc-200">
                                                <button className="text-verde font-bold">
                                                    Ver
                                                </button>
                                            </li>
                                        </ul>
                                    </li>
                                )
                            })}
                        </ul>
                    </div>
                </div>
            </div>

            {
                <Dialog
                    header={
                        <div>
                            <h2>Nova Consulta Exame Procedimento</h2>
                        </div>
                    }
                    visible={visible}
                    className="max-w-[95%] w-full"
                    onHide={() => {
                        if (!visible) return
                        setVisible(false)
                        setBuscarPaciente('')
                        setPacienteAtual(null)
                    }}
                >
                    <div className="p-4 pb-0">
                        {/* PACIENTE */}
                        <div className="flex flex-col gap-1 relative">
                            <label
                                htmlFor="buscarPaciente"
                                className="font-semibold text-zinc-700"
                            >
                                Paciente *
                            </label>
                            <input
                                id="buscarPaciente"
                                type="text"
                                value={
                                    pacienteAtual
                                        ? pacienteAtual.nome
                                        : buscarPaciente
                                }
                                onChange={(e) => {
                                    setBuscarPaciente(e.target.value)
                                    setPacienteAtual(null)
                                }}
                                placeholder="Digite o nome, CPF ou Cartão SUS..."
                                autoComplete="off"
                                className="
                                    w-full
                                    border border-zinc-300
                                    rounded-lg
                                    px-3 py-2
                                    outline-none
                                    focus:border-verde
                                    focus:ring-1
                                    focus:ring-verde
                                "
                            />
                            {/* RESULTADOS */}
                            {!pacienteAtual &&
                                buscarPaciente.trim() !== '' &&
                                (
                                    <div className="
                                        absolute
                                        top-full
                                        left-0
                                        right-0
                                        z-50
                                        mt-1
                                        bg-white
                                        border
                                        border-zinc-200
                                        rounded-lg
                                        shadow-lg
                                        overflow-hidden
                                    ">
                                        {pacientesFiltrados.length > 0 ? (
                                            pacientesFiltrados.map((paciente) => (
                                                <button
                                                    type="button"
                                                    key={paciente.id}
                                                    onClick={() => {
                                                        setPacienteAtual(paciente)
                                                        setBuscarPaciente('')
                                                    }}
                                                    className="
                                                        w-full
                                                        text-left
                                                        px-4 py-3
                                                        hover:bg-green-50
                                                        border-b
                                                        border-zinc-100
                                                        transition
                                                    "
                                                >
                                                    <p className="font-semibold text-zinc-800">
                                                        {paciente.nome}
                                                    </p>
                                                    <div className="flex gap-4 text-xs text-zinc-500 mt-1">
                                                        <span>
                                                            CPF: {paciente.cpf}
                                                        </span>
                                                        <span>
                                                            CNS: {paciente.cartaoSus}
                                                        </span>
                                                    </div>
                                                </button>
                                            ))
                                        ) : (
                                            <div className="px-4 py-3 text-sm text-zinc-500">
                                                Nenhum paciente encontrado.
                                            </div>
                                        )}

                                    </div>
                                )
                            }

                        </div>
                        {/* DADOS DO PACIENTE SELECIONADO */}

                        <div className="border border-zinc-200 flex flex-col gap-4 mt-4 p-4 rounded-lg w-full">
                            <div className="flex items-center gap-2 text-xl font-bold">
                                <FaUserPen className="text-3xl" />
                                <h3>Informações do paciente:</h3>
                            </div>
                            <div className="flex justify-between items-start">
                                <ul className="grid grid-cols-2 w-full xl:grid-cols-3">
                                    <li className="flex items-center gap-2">
                                        <span>Nome:</span>
                                        <p>{pacienteAtual?.nome}</p>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span>Sexo:</span>
                                        <p>{pacienteAtual?.sexo}</p>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span>Endereço:</span>
                                        <p>{`${pacienteAtual?.rua}, ${pacienteAtual?.numero} - ${pacienteAtual?.bairro} ${pacienteAtual?.complemento ? (`(${pacienteAtual?.complemento})`) : ''}`}</p>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span>CEP:</span>
                                        <p>{pacienteAtual?.cep}</p>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span>Cidade:</span>
                                        <p>{pacienteAtual?.municipio}</p>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span>CPF:</span>
                                        <p>{pacienteAtual?.cpf}</p>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span>CNS:</span>
                                        <p>{pacienteAtual?.cpfCns}</p>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span>Mãe:</span>
                                        <p>{pacienteAtual?.nomeDaMae}</p>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span>Pai:</span>
                                        <p>{pacienteAtual?.nomeDoPai}</p>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span>Idade:</span>
                                        {/* <p>{pacienteAtual.dataDeNascimento.toLocaleDateString()}</p> */}
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span>Telefone 1:</span>
                                        {/* <p>{pacienteAtual.numero}</p> */}
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span>Telefone 2:</span>
                                        {/* <p>{pacienteAtual.numero}</p> */}
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span>Unidade Solicitante:</span>
                                        <p>{pacienteAtual?.unidadeDeSaude}</p>
                                    </li>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setPacienteAtual(null)
                                            setBuscarPaciente('')
                                        }}
                                        className="
                                                text-red-500
                                                font-bold
                                                hover:text-red-700
                                            "
                                    >
                                        Alterar
                                    </button>
                                </ul>
                            </div>
                        </div>

                        {/* Origem */}
                        <div className="border border-zinc-200 flex flex-col gap-4 mt-4 p-4 rounded-lg w-full">
                            <div className="flex items-center gap-2 text-xl font-bold">
                                <FaUserPen className="text-3xl" />
                                <h3>Origem:</h3>
                            </div>
                            <div className="grid grid-cols-2 gap-4 gap-x-6">
                                {/* Unidade de origem */}
                                <div>
                                    <InputSelect
                                        icone={<AiOutlineSelect />}
                                        id="unidadeDeOrigem"
                                        label="Unidade de Origem"
                                        nome="unidadeDeOrigem"
                                        setValor={setUnidadeDeOrigem}
                                        valor={unidadeDeOrigem}
                                        opcoes={opcoesUnidadesDeOrigem}
                                    />
                                </div>
                                {/* Data de entrada */}
                                <div>
                                    <InputData icone={<HiOutlineCalendarDateRange />} id="dataDeEntrada" label="Data de Entrada" nome="dataDeEntrada" placeholder="Data de Entrada" setValor={setDataDeEntrada} valor={dataDeEntrada} />
                                </div>
                                {/* Prestador */}
                                <div className="flex flex-col gap-1 relative">
                                    <label
                                        htmlFor="buscarPrestador"
                                        className="font-semibold text-zinc-700"
                                    >
                                        Médico Solicitante
                                    </label>
                                    <input
                                        id="buscarPrestador"
                                        type="text"
                                        value={
                                            prestadorAtual
                                                ? prestadorAtual.nome
                                                : buscarPrestador
                                        }
                                        onChange={(e) => {
                                            setBuscarPrestador(e.target.value)
                                            setPrestadorAtual(null)
                                        }}
                                        placeholder="Digite o nome do prestador..."
                                        autoComplete="off"
                                        className="
                                            w-full
                                            border border-zinc-300
                                            rounded-lg
                                            px-3 py-2
                                            outline-none
                                            focus:border-verde
                                            focus:ring-1
                                            focus:ring-verde
                                        "
                                    />
                                    {!prestadorAtual &&
                                        buscarPrestador.trim() !== '' && (
                                            <div
                                                className="
                                                absolute
                                                top-full
                                                left-0
                                                right-0
                                                z-50
                                                mt-1
                                                bg-white
                                                border
                                                border-zinc-200
                                                rounded-lg
                                                shadow-lg
                                                overflow-hidden
                                            "
                                            >
                                                {prestadoresFiltrados.length > 0 ? (
                                                    prestadoresFiltrados.map((prestador) => (
                                                        <button
                                                            type="button"
                                                            key={prestador.id}
                                                            onClick={() => {
                                                                setPrestadorAtual(prestador)
                                                                setBuscarPrestador('')
                                                            }}
                                                            className="
                                                                w-full
                                                                text-left
                                                                px-4 py-3
                                                                hover:bg-green-50
                                                                border-b
                                                                border-zinc-100
                                                                transition
                                                            "
                                                        >
                                                            <p className="font-semibold text-zinc-800">
                                                                {prestador.nome}
                                                            </p>
                                                        </button>
                                                    ))
                                                ) : (
                                                    <div className="px-4 py-3 text-sm text-zinc-500">
                                                        Nenhum prestador encontrado.
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                </div>
                                {/* Especialidade do prestador */}
                                <div className="mt-auto">
                                    <InputSelect
                                        icone={<AiOutlineSelect />}
                                        id="especialidadeDoPrestador"
                                        label="Selecione a Especialidade Do Médico"
                                        nome="especialidadeDoPrestador"
                                        setValor={setEspecialidadeDoPrestador}
                                        valor={especialidadeDoPrestador}
                                        opcoes={opcoesEspecialidade}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Destino */}
                        <div className="border border-zinc-200 flex flex-col gap-4 mt-4 p-4 rounded-lg w-full">
                            <div className="flex items-center gap-2 text-xl font-bold">
                                <FaUserPen className="text-3xl" />
                                <h3>Destino:</h3>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                {/* Categoria de atendimento */}
                                <div>
                                    <InputSelect
                                        icone={<AiOutlineSelect />}
                                        id="categoriaDeAtendimento"
                                        label="Categoria de Atendimento"
                                        nome="categoriaDeAtendimento"
                                        setValor={setCategoriaDeAtendimento}
                                        valor={categoriaAtendimento}
                                        opcoes={opcoesCategoriaDeAtendimento}
                                    />
                                </div>
                                {/* Especialidade encaminhada */}
                                <div>
                                    <InputSelect
                                        icone={<AiOutlineSelect />}
                                        id="especialidadeEncaminhada"
                                        label="Encaminho para especialidade:"
                                        nome="especialidadeEncaminhada"
                                        setValor={setEspecialidadeEncaminhada}
                                        valor={especialidadeEncaminhada}
                                        opcoes={opcoesEspecialidadesFiltradas}
                                    // opcoesEncaminhoProcedimentos
                                    />
                                </div>
                                <div>
                                    <InputSelect
                                        icone={<AiOutlineSelect />}
                                        id="situacao"
                                        label="Situação"
                                        nome="situacao"
                                        setValor={setSituacao}
                                        valor={situacao}
                                        opcoes={opcoesDePrioridade}
                                    />
                                </div>
                                {/* Situação */}
                                <div>
                                    <InputSelect
                                        icone={<AiOutlineSelect />}
                                        id="tipoDeConsulta"
                                        label="Tipo de Consulta"
                                        nome="tipoDeConsulta"
                                        setValor={setTipoDeConsulta}
                                        valor={tipoDeConsulta}
                                        opcoes={opcoesTipoDeConsulta}
                                        disabled={categoriaAtendimento !== 'CONSULTA'}
                                    />
                                </div>
                                {/* Falta data de retorno em caso de ser retorno */}
                            </div>
                        </div>

                        <div className="flex items-center justify-between px-4 mt-4">
                            <div className="relative w-22 h-16">
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
                                    Salvar Atendimento
                                </button>
                            </div>
                        </div>
                    </div>
                </Dialog>
            }
        </div >
    )
}


// const consultasExames = [
//     {
//         id: 108845,
//         dataSolicitacao: "14/08/2026",
//         prioridade: "URGENTE",
//         paciente: "Maria Aparecida Martins",
//         tipo: "CONSULTA",
//         dataNascimento: "01/06/1978",
//         nomeMae: "Maria Aparecida Martins",
//         idade: 48,
//         profissional: "Aurelio Filipaki",
//         especialidadeProcedimento: "Cardiologia - Retorno",
//         dataRetorno: "21/08/2026",
//         unidadeSaude: "Centro de Saúde Municipal",
//         dataRealizacao: "21/08/2026",
//         localRealizacao: "Hospital Municipal",
//     },
//     {
//         id: 108844,
//         dataSolicitacao: "13/08/2026",
//         prioridade: "PRIORIDADE",
//         paciente: "João da Silva",
//         tipo: "EXAME",
//         dataNascimento: "15/03/1965",
//         nomeMae: "Ana Maria da Silva",
//         idade: 61,
//         profissional: "Bruno Belusci",
//         especialidadeProcedimento: "Hemograma Completo",
//         dataRetorno: "-",
//         unidadeSaude: "Centro de Saúde Municipal",
//         dataRealizacao: "25/08/2026",
//         localRealizacao: "Laboratório Municipal",
//     },
//     {
//         id: 108843,
//         dataSolicitacao: "12/08/2026",
//         prioridade: "NORMAL",
//         paciente: "Ana Paula Santos",
//         tipo: "CONSULTA",
//         dataNascimento: "22/11/1990",
//         nomeMae: "Joana Santos",
//         idade: 35,
//         profissional: "Aurelio Filipaki",
//         especialidadeProcedimento: "Cardiologia - Primeira vez",
//         dataRetorno: "12/09/2026",
//         unidadeSaude: "UBS Central",
//         dataRealizacao: "12/09/2026",
//         localRealizacao: "UBS Central",
//     },
//     {
//         id: 208845,
//         dataSolicitacao: "15/08/2026",
//         prioridade: "URGENTE",
//         paciente: "Carlos Eduardo Martins",
//         tipo: "CIRURGIA",
//         dataNascimento: "10/04/1962",
//         nomeMae: "Maria de Lourdes Martins",
//         idade: 64,
//         profissional: "Dr. Rafael Oliveira",
//         especialidadeProcedimento: "Colecistectomia",
//         dataRetorno: "28/08/2026",
//         unidadeSaude: "Centro de Saúde Municipal",
//         dataRealizacao: "05/09/2026",
//         localRealizacao: "Hospital Municipal",
//     },
// ]