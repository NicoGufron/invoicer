import { jsPDF } from "jspdf";

const FONTS = [
    { file: "PlusJakartaSans-Regular.ttf", family: "Jakarta", style : "normal" },
    { file: "PlusJakartaSans-Bold.ttf", family: "Jakarta", style : "bold" },
    { file: "PlusJakartaSans-SemiBold.ttf", family: "Jakarta", style : "semibold" },
    { file: "GeistMono-Bold.ttf", family: "Geist Mono", style : "bold" },
    { file: "GeistMono-Regular.ttf", family: "Geist Mono", style : "normal" },
    { file: "GeistMono-SemiBold.ttf", family: "Geist Mono", style : "semibold" }

];

const fontCache = new Map<string, string>();

async function toBase64(url: string) : Promise<string> {
    const blob = await (await fetch(url)).blob();
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve((reader.result as string).split(",")[1]);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
}

export async function registerFonts(pdf: jsPDF) {
    for (const f of FONTS) {
        if (!fontCache.has(f.file)) {
            fontCache.set(f.file, await toBase64(`/fonts/${f.file}`));
        }
        pdf.addFileToVFS(f.file, fontCache.get(f.file)!);
        pdf.addFont(f.file, f.family, f.style);
    }
}