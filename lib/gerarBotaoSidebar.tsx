import Link from "next/link";

export default function GerarBotaoSidebar(
    icone: React.ReactNode,
    titulo: string,
    url: string,
    i: number,
    ativo: boolean
) {
    return (
        <li
            key={i}
            className={`
                duration-200 transition-all rounded-lg
                ${ativo
                    ? "bg-white text-verde-escuro"
                    : "text-white hover:bg-verde"
                }
            `}
        >
            <Link
                href={url}
                className="flex items-center gap-2 text-lg font-bold w-full p-2 rounded-lg transition-all duration-300 cursor-pointer"
            >
                <div>{icone}</div>
                <p>{titulo}</p>
            </Link>
        </li>
    );
}