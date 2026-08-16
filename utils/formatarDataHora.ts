export default function formatarDataHora(data: Date) {
    return data.toLocaleDateString("pt-BR", {
        day: "numeric",
        month: "long",
        year: "numeric",
    }) + ", às " + data.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    });
}