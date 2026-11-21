import BwipJs from "bwip-js/browser"

export function gerarCodigoDeBarras(texto: string): string {
    const canvas = document.createElement("canvas")

    BwipJs.toCanvas(canvas, {
        bcid: "code128",
        text: texto,
        scale: 2,
        height: 12,
        includetext: false,
        textxalign: "center",
        textsize: 8,
    })

    return canvas.toDataURL("image/png")
}
