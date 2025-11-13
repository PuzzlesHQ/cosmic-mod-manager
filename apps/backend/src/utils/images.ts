import { FileType } from "@app/utils/types";
import type { BunFile } from "bun";
import sharp from "sharp";

interface ResizeProps {
    width?: number;
    height?: number;
    fit?: keyof sharp.FitEnum;
    kernel?: keyof sharp.KernelEnum;
    withoutEnlargement?: sharp.ResizeOptions["withoutEnlargement"];
}

export async function resizeImageToWebp(file: File | BunFile, inputFileType: FileType, props: ResizeProps): Promise<File> {
    let defaultKernel: ResizeProps["kernel"] = sharp.kernel.nearest;
    const isAnimated = [FileType.GIF, FileType.WEBP].includes(inputFileType);

    const imgBuffer = await file.arrayBuffer();
    const sharpInstance = sharp(imgBuffer, { animated: isAnimated });

    const metadata = await sharpInstance.metadata();
    // Don't use nearest neighbor for large images
    if ((metadata.width || 0) > 256 && (metadata.height || 0) > 256) defaultKernel = sharp.kernel.lanczos3;

    const resizedImgBuffer = await sharpInstance
        .resize({
            width: props.width,
            height: props.height,
            fit: props.fit,
            kernel: props.kernel || defaultKernel,
            withoutEnlargement: props.withoutEnlargement === true,
            background: {
                r: 0,
                g: 0,
                b: 0,
                alpha: 0,
            },
        })
        .webp()
        .toArray();
    return new File(resizedImgBuffer, "__resized-webp-img__");
}

export async function ConvertToWebp(file: File | BunFile, inputFileType: FileType, quality = 85) {
    const isAnimated = [FileType.GIF, FileType.WEBP].includes(inputFileType);

    const imgBuffer = await file.arrayBuffer();
    const sharpInstance = sharp(imgBuffer, { animated: isAnimated });

    const resizedImgBuffer = await sharpInstance.webp({ quality: quality }).toArray();
    return new File(resizedImgBuffer, "__webp-img__");
}

export async function getAverageColor(file: File) {
    try {
        const buffer = await file.arrayBuffer();
        const { data } = await sharp(buffer).resize(1, 1).raw().toBuffer({ resolveWithObject: true });

        const hexColor = rgbToHex(data[0], data[1], data[2]);
        return hexColor;
    } catch (err) {
        console.error("Error processing image: ", file.name, "\n", err);
        return null;
    }
}

function rgbToHex(r: number, g: number, b: number) {
    const hexCode = ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    return `#${hexCode}`;
}
