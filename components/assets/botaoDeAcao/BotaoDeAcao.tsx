interface BotaoDeAcaoProps {
    icone: React.ReactElement;
    classe: string;
    onClick?: () => void;
}

export default function BotaoDeAcao({
    icone,
    classe,
    onClick,
}: BotaoDeAcaoProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`w-[40px] h-[40px] flex justify-center items-center rounded-lg text-xl transition-all border border-zinc-800 duration-300 cursor-pointer ${classe}`}
        >
            {icone}
        </button>
    );
}