'use client'
import InputEmail from "@/components/assets/inputs/InputEmail";
import InputSelect from "@/components/assets/inputs/InputSelect";
import InputTexto from "@/components/assets/inputs/InputTexto";
import { useLocaisDeAtendimento } from "@/hooks/useLocaisDeAtendimento";
import { useState } from "react";
import { FaListCheck, FaMagnifyingGlass, FaMagnifyingGlassPlus, FaRegBuilding } from "react-icons/fa6";
import { MdDriveFileRenameOutline, MdSave } from "react-icons/md";
import { PiBroomFill } from "react-icons/pi";
import { Paginator, PaginatorPageChangeEvent } from "primereact/paginator"
import { TiUserDelete } from "react-icons/ti";
import { RiDeleteBin5Line } from "react-icons/ri";
import { BiSolidEdit } from "react-icons/bi";
import { Dialog } from "primereact/dialog";
import { useDialog } from "@/context/DialogContext";
import { Local } from "@/app/generated/prisma/client";
import Link from "next/link";
import { TbPhoneCallFilled } from "react-icons/tb";
import { opcoesDeSituacao, opcoesRede, opcoesTipoDoLocal } from "@/lib/opcoesDeDados";

export default function Page() {
    const { locais, buscarLocais } = useLocaisDeAtendimento()
    const { abrirDialog } = useDialog()

    const [editar, setEditar] = useState(false);
    const [localEditanto, setLocalEditanto] = useState<number | null>(null)

    const [nome, setNome] = useState('')
    const [tipoDoLocal, setTipoDoLocal] = useState('')
    const [rede, setRede] = useState('')
    const [situacao, setSituacao] = useState('')

    const [cidade, setCidade] = useState('')
    const [cep, setCep] = useState('')
    const [uf, setUf] = useState('')

    const [buscandoCep, setBuscandoCep] = useState(false)
    const [erroCep, setErroCep] = useState('')

    const [rua, setRua] = useState('')
    const [numero, setNumero] = useState('')
    const [bairro, setBairro] = useState('')
    const [complemento, setComplemento] = useState('')

    const [telefone1, setTelefone1] = useState('')
    const [telefone2, setTelefone2] = useState('')
    const [email, setEmail] = useState('')

    const [first, setFirst] = useState(0)
    const [rows] = useState(5)

    const [buscarLocal, setBuscarLocal] = useState('')
    const [filtroCidade, setFiltroCidade] = useState('')

    const buscarCidadePorCep = async () => {
        const cepLimpo = cep.replace(/\D/g, '')

        if (cepLimpo.length !== 8) {
            setErroCep('')
            setCidade('')
            setUf('')
            return
        }

        try {
            setBuscandoCep(true)
            setErroCep('')

            const resposta = await fetch(
                `https://viacep.com.br/ws/${cepLimpo}/json/`
            )

            const dados = await resposta.json()

            if (dados.erro) {
                setCidade('')
                setUf('')
                setErroCep('CEP não encontrado.')
                return
            }

            setCidade(dados.localidade)
            setUf(dados.uf)
            setCep(dados.cep)

        } catch (error) {
            console.error("Erro ao buscar CEP:", error)
            setErroCep('Não foi possível consultar o CEP.')
        } finally {
            setBuscandoCep(false)
        }
    }

    const limparFormulario = () => {
        setNome('')
        setTipoDoLocal('')
        setSituacao('')
        setCidade('')
        setCep('')
        setUf('')
        setRua('')
        setNumero('')
        setBairro('')
        setComplemento('')
        setTelefone1('')
        setTelefone2('')
        setEmail('')
    }

    const onSubmitSalvarLocal = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault()
        const editando = localEditanto !== null

        const dados = {
            nome,
            tipo: tipoDoLocal,
            rede,
            ativo: situacao === "ATIVO",
            cidade,
            cep,
            uf,
            rua,
            numero,
            bairro,
            complemento,
            telefone1,
            telefone2,
            email,
        }

        try {
            const resposta = await fetch(
                editando
                    ? `/api/localDeAtendimento/${localEditanto}`
                    : "/api/localDeAtendimento",
                {
                    method: editando ? "PUT" : "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(dados),
                }
            )

            const resultado = await resposta.json()

            if (!resposta.ok) {
                console.error(resultado.erro)
                return
            }

            abrirDialog({
                title: "Cadastro realizado",
                message: "O local foi cadastrado com sucesso.",
            })
            setEditar(false)
            setLocalEditanto(null)
            limparFormulario()
            await buscarLocais()

        } catch (error) {
            console.error("Erro ao salvar local:", error)
        }
    }

    const formulario = () => {
        return (
            <form className="flex flex-col gap-2" onSubmit={onSubmitSalvarLocal}>
                <div className="grid grid-cols-2 gap-4">
                    <InputTexto icone={<MdDriveFileRenameOutline />} id="nome" label="Nome" nome="nome" placeholder="Digite o nome da especialidade ou procedimento" setValor={setNome} valor={nome} />
                    <InputSelect icone={<FaMagnifyingGlass />} id="situacao" label="Situação" nome="situcao" setValor={setSituacao} valor={situacao} opcoes={opcoesDeSituacao} />
                    <div className="col-span-2 grid grid-cols-2 gap-4">
                        <InputSelect icone={<FaMagnifyingGlass />} id="tipoDoLocal" label="Tipo do Local" nome="tipoDoLocal" setValor={setTipoDoLocal} valor={tipoDoLocal} opcoes={opcoesTipoDoLocal} />
                        <InputSelect icone={<FaMagnifyingGlass />} id="rede" label="Tipo de Reede" nome="rede" setValor={setRede} valor={rede} opcoes={opcoesRede} />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="grid grid-cols-2 col-span-2 gap-4">
                        <InputTexto
                            icone={<MdDriveFileRenameOutline />}
                            id="cidade"
                            label="Cidade"
                            nome="cidade"
                            placeholder="Digite a cidade"
                            setValor={setCidade}
                            valor={cidade}
                            onBlur={buscarCidadePorCep}
                        />

                        <InputTexto
                            icone={<MdDriveFileRenameOutline />}
                            id="cep"
                            label="CEP"
                            nome="cep"
                            placeholder="Digite o CEP"
                            setValor={setCep}
                            valor={cep}
                            onBlur={buscarCidadePorCep}
                        />
                    </div>
                    {buscandoCep && (
                        <div className="mt-2 p-3 rounded-lg bg-gray-100 col-span-2">
                            <span className="text-gray-600">
                                Consultando CEP...
                            </span>
                        </div>
                    )}
                    {erroCep && (
                        <div className="mt-2 p-3 rounded-lg bg-red-100 text-red-600 col-span-2">
                            {erroCep}
                        </div>
                    )}
                    {cidade && uf && !buscandoCep && (
                        <div className="mt-2 p-4 rounded-lg border border-verde bg-green-50 col-span-2">
                            <p className="font-bold text-verde mb-2">
                                Localização encontrada
                            </p>
                            <div className="grid grid-cols-3 gap-2 text-sm">
                                <div className="flex items-center gap-1">
                                    <span className="font-bold">Cidade:</span>
                                    <p>{cidade}</p>
                                </div>

                                <div className="flex items-center gap-1">
                                    <span className="font-bold">UF:</span>
                                    <p>{uf}</p>
                                </div>
                                <div className="flex items-center gap-1">
                                    <span className="font-bold">CEP:</span>
                                    <p>{cep}</p>
                                </div>
                            </div>
                        </div>
                    )}
                    <InputTexto icone={<MdDriveFileRenameOutline />} id="rua" label="Rua" nome="rua" placeholder="EX: Rua das Hortencias" setValor={setRua} valor={rua} />
                    <InputTexto icone={<MdDriveFileRenameOutline />} id="numero" label="Número" nome="numero" placeholder="EX:123" setValor={setNumero} valor={numero} />
                    <InputTexto icone={<MdDriveFileRenameOutline />} id="bairro" label="Bairro" nome="bairro" placeholder="EX:123" setValor={setBairro} valor={bairro} />
                    <InputTexto icone={<MdDriveFileRenameOutline />} id="complemento" label="Complemento" nome="complemento" placeholder="EX:123" setValor={setComplemento} valor={complemento} />
                </div>

                <div className="col-span-2 grid grid-cols-3 gap-4">
                    <InputTexto icone={<MdDriveFileRenameOutline />} id="telefone1" label="Telefone 1" nome="telefone1" placeholder="EX: telefone1 das Hortencias" setValor={setTelefone1} valor={telefone1} />
                    <InputTexto icone={<MdDriveFileRenameOutline />} id="telefone2" label="Telefone 2" nome="telefone2" placeholder="EX: telefone2 das Hortencias" setValor={setTelefone2} valor={telefone2} />
                    <InputEmail icone={<MdDriveFileRenameOutline />} id="email" label="Email" nome="email" placeholder="EX: email das Hortencias" setValor={setEmail} valor={email} />
                </div>



                <div className="grid grid-cols-2 gap-2 w-fit ml-auto mt-2">
                    <button
                        onClick={(e) => {
                            e.preventDefault()
                            limparFormulario()
                        }}
                        className="bg-red-500 text-white font-bold text-lg px-4 py-2 rounded-lg flex items-center gap-2 text-shadow-[1px_1px_2px_black]"
                    >
                        <div>
                            <PiBroomFill />
                        </div>
                        <p>Limpar</p>
                    </button>
                    <button type="submit" className="bg-verde text-white font-bold text-lg px-4 py-2 rounded-lg flex items-center gap-2 text-shadow-[1px_1px_2px_black]">
                        <div>
                            <MdSave />
                        </div>
                        <p>Salvar</p>
                    </button>
                </div>
            </form>
        )
    }

    const editarLocal = (local: typeof locais[number]) => {
        setLocalEditanto(local.id)
        setNome(local.nome)
        setTipoDoLocal(local.tipo)
        setRede(local.rede || '')
        setSituacao('ATIVO')
        setCidade(local.cidade)
        setCep(local.cep)
        setUf(local.uf)
        setRua(local.rua)
        setNumero(local.numero)
        setBairro(local.bairro)
        setComplemento(local.complemento || '')
        setTelefone1(local.telefone1)
        setTelefone2(local.telefone2 || '')
        setEmail(local.email || '')
        setEditar(true)
    }

    const removerLocal = async (local: Local) => {
        abrirDialog({
            title: "Remover local",
            message: `Deseja realmente remover o local "${local.nome}"? Essa ação não poderá ser desfeita.`,
            confirmText: "Remover",
            cancelText: "Cancelar",

            onConfirm: async () => {
                try {
                    const response = await fetch(`/api/localDeAtendimento/${local.id}`, {
                        method: "DELETE",
                    })

                    const data = await response.json()

                    if (!response.ok) {
                        throw new Error(
                            data.erro ||
                            data.error ||
                            "Erro ao remover local."
                        )
                    }

                    // Atualiza a lista automaticamente
                    await buscarLocais()

                    abrirDialog({
                        title: "Local removido",
                        message: "O local foi removido com sucesso."
                    })

                } catch (error) {
                    console.error(
                        "Erro ao remover local:",
                        error
                    )

                    abrirDialog({
                        title: "Erro",
                        message:
                            error instanceof Error
                                ? error.message
                                : "Erro ao remover local."
                    })
                }
            }
        })
    }
    
    const locaisFiltrados = locais.filter((local) => {
        const correspondeCidade =
            !filtroCidade ||
            local.cidade
                .toLowerCase()
                .includes(filtroCidade.toLowerCase())

        const correspondeNome =
            !buscarLocal ||
            local.nome
                .toLowerCase()
                .includes(buscarLocal.toLowerCase())

        return (
            correspondeCidade &&
            correspondeNome
        )
    })

    const locaisPaginados = locaisFiltrados.slice(
        first,
        first + rows
    )

    return (
        <div className="p-6">
            <div className="mb-4 flex items-center gap-2">
                <div className="text-5xl">
                    <FaRegBuilding />
                </div>
                <div>
                    <h3 className="text-2xl font-bold">Locais de Atendimento</h3>
                    <span>Gerencie os locais de atendimento cadastrados no sistema.</span>
                </div>
            </div>
            <div className="flex flex-col gap-6">
                <div className="shadow-[0px_0px_2px_1px_var(--verde-escuro)] rounded-lg p-4 flex flex-col gap-3">
                    {formulario()}
                </div>
                <div className="shadow-[0px_0px_2px_1px_var(--verde-escuro)] rounded-lg p-4 flex flex-col gap-3">
                    <div className="flex items-center gap-2 text-xl font-bold text-verde">
                        <FaListCheck />
                        <h2>Cadastro Existentes</h2>
                    </div>
                    {/* filtros */}
                    <div className="grid grid-cols-3 gap-3">
                        <div className="col-span-2">
                            <InputTexto
                                icone={<MdDriveFileRenameOutline />}
                                id="buscarLocal"
                                label="Buscar local"
                                nome="buscarLocal"
                                placeholder="Digite o nome do local..."
                                setValor={setBuscarLocal}
                                valor={buscarLocal}
                            />
                        </div>
                        <InputTexto
                            icone={<MdDriveFileRenameOutline />}
                            id="filtroCidade"
                            label="Cidade"
                            nome="filtroCidade"
                            placeholder="Digite a cidade..."
                            setValor={setFiltroCidade}
                            valor={filtroCidade}
                        />
                    </div>
                    {/* Tabela */}
                    <div className="flex flex-col">
                        <div>
                            <ul className="grid grid-cols-[1fr_230px_200px_100px_150px] w-full font-bold border-b p-3">
                                <li>
                                    <p>Nome</p>
                                </li>
                                <li className="flex items-center justify-center text-center">
                                    <p>Endereço</p>
                                </li>
                                <li className="flex items-center justify-center text-center">
                                    <p>Contato</p>
                                </li>
                                <li className="flex items-center justify-center text-center">
                                    <p>Status</p>
                                </li>
                                <li className="flex items-center justify-center text-center">
                                    <p>Ações</p>
                                </li>
                            </ul>
                        </div>
                        <div>
                            {
                                locaisPaginados.length > 0 ? (
                                    <ul className="flex flex-col gap-2">
                                        {
                                            locaisPaginados.map((local, i) => {
                                                return (
                                                    <li key={i} className="grid grid-cols-[1fr_230px_200px_100px_150px] w-full border-b items-center p-3">
                                                        <div>
                                                            <p>{local.nome}</p>
                                                        </div>
                                                        <div className="flex items-center justify-center text-center">
                                                            <p>{`${local.rua}, ${local.numero} - ${local.cidade} (${local.uf})`}</p>
                                                        </div>

                                                        <div className="flex items-center justify-center text-center relative h-full">
                                                            <Link
                                                                href={`https://wa.me/55${local.telefone1.replace(/\D/g, '')}`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="absolute top-0 right-4 duration-300 transition-all hover:text-verde"
                                                            >
                                                                <TbPhoneCallFilled />
                                                            </Link>

                                                            <p className="line-clamp-2">
                                                                {local.telefone1}
                                                            </p>
                                                        </div>
                                                        <div className="flex items-center justify-center text-center">
                                                            <p>{local.ativo ? 'ATIVO' : 'INATIVO'}</p>
                                                        </div>
                                                        <div className="grid grid-cols-3">
                                                            <button className="flex justify-center items-center rounded-full border border-amber-500 text-amber-500 w-8 h-8 mx-auto duration-200 transition-all hover:bg-amber-500 hover:text-white" onClick={() => editarLocal(local)}><BiSolidEdit /></button>
                                                            <button className="flex justify-center items-center rounded-full border border-red-500 text-red-500 w-8 h-8 mx-auto duration-200 transition-all hover:bg-red-500 hover:text-white" onClick={() => removerLocal(local)}><RiDeleteBin5Line /></button>
                                                            <button className="flex justify-center items-center rounded-full border border-purple-600 text-purple-600 w-8 h-8 mx-auto duration-200 transition-all hover:bg-purple-600 hover:text-white"><TiUserDelete /></button>
                                                        </div>
                                                    </li>
                                                )
                                            })
                                        }
                                    </ul>
                                ) : (
                                    <div className="flex justify-center items-center text-2xl mt-6 mb-4">
                                        <h4 className="font-bold">Sem especialidades cadastradas</h4>
                                    </div>
                                )
                            }
                        </div>
                        <div className="grid grid-cols-[300px_1fr] mt-1 -mb-2">
                            <p className="my-auto">Mostrando 1 a 5 de 5 registros</p>
                            <Paginator
                                first={first}
                                rows={rows}
                                totalRecords={locais.length}
                                onPageChange={(event: PaginatorPageChangeEvent) => {
                                    setFirst(event.first)
                                }}
                                className="my-auto"
                            />
                        </div>
                    </div>
                </div>
            </div>
            <Dialog header="Editar Especialidade" visible={editar} style={{ width: '50vw' }} onHide={() => setEditar(false)}>
                {formulario()}
            </Dialog>
        </div>
    )
}