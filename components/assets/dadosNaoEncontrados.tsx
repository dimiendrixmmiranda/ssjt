import Image from "next/image";

export default function DadosNaoEncontrados() {
    return (
        <div className="border border-verde-escuro rounded-lg h-full p-4 flex flex-col justify-center items-center gap-2">
            <div className="relative w-[250px] h-[250px]">
                <Image alt="Imagem" src={"/lupa.png"} fill className="object-cover" />
            </div>
            <h3 className="text-verde-escuro text-3xl font-bold">Pesquise para visualizar os resultados</h3>
            <span className="text-zinc-400">Use os filtros acima e clique em Buscar para encontrar consultas, exames ou cirurgias.</span>
            <div className="grid grid-cols-3 w-fit mt-3">
                <div className="flex flex-col items-center justify-center relative">
                    <div className="z-20 bg-white rounded-full border border-verde-escuro text-verde-escuro w-10 h-10 flex justify-center items-center font-black">
                        <p>1</p>
                    </div>
                    <span>Escolha o tipo de busca</span>
                    <div className="absolute left-[50%] top-[25%] z-10 w-full bg-verde-escuro h-1" />
                </div>
                <div className="flex flex-col items-center justify-center relative">
                    <div className="z-20 bg-white rounded-full border border-verde-escuro text-verde-escuro w-10 h-10 flex justify-center items-center font-black">
                        <p>2</p>
                    </div>
                    <span>Informe o valor</span>
                    <div className="absolute left-[50%] top-[25%] z-10 w-full bg-verde-escuro h-1" />
                </div>
                <div className="flex flex-col items-center justify-center relative">
                    <div className="z-20 bg-white rounded-full border border-verde-escuro text-verde-escuro w-10 h-10 flex justify-center items-center font-black">
                        <p>3</p>
                    </div>
                    <span>Clique em buscar</span>
                </div>
            </div>
        </div>
    )
}