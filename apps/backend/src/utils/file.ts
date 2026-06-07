import type { BunFile, SupportedCryptoAlgorithms } from "bun";

export async function createHashFromBuffer(fileBuffer: ArrayBuffer, algorithm: SupportedCryptoAlgorithms = "sha256") {
    const hash = Bun.CryptoHasher.hash(algorithm, fileBuffer).toString("hex");
    return hash;
}

export async function createHashFromFile(file: File | BunFile, algorithm: SupportedCryptoAlgorithms) {
    const fileBuffer = await file.arrayBuffer();
    return await createHashFromBuffer(fileBuffer, algorithm);
}

export async function getImageFromHttpUrl(url: string) {
    try {
        // Just to check if the URL is valid
        new URL(url);

        const response = await fetch(url);
        const blob = await response.blob();
        const mime = blob.type;
        if (!mime.startsWith("image/")) return null;

        const extension = mime.split("/")[1] || "png";

        return new File([blob], `avatar.${extension}`, { type: blob.type });
    } catch (error) {
        console.error(`Error while fetching image from URL: ${url} \n`, error);
        return null;
    }
}
