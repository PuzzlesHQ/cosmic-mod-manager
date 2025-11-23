import type { Prisma } from "@prisma-client";
import prisma from "~/services/prisma";
import { Delete_ProjectCache_All } from "./project_item";

export async function CreateGalleryItem<T extends Prisma.GalleryItemCreateArgs>(
    args: Prisma.SelectSubset<T, Prisma.GalleryItemCreateArgs>,
) {
    const data = await prisma.galleryItem.create(args);
    await Delete_ProjectCache_All(data.projectId);
    return data;
}

export async function UpdateGalleryItem<T extends Prisma.GalleryItemUpdateArgs>(
    args: Prisma.SelectSubset<T, Prisma.GalleryItemUpdateArgs>,
) {
    const data = await prisma.galleryItem.update(args);
    await Delete_ProjectCache_All(data.projectId);
    return data;
}

export async function DeleteGalleryItem<T extends Prisma.GalleryItemDeleteArgs>(
    args: Prisma.SelectSubset<T, Prisma.GalleryItemDeleteArgs>,
) {
    const data = await prisma.galleryItem.delete(args);
    await Delete_ProjectCache_All(data.projectId);
    return data;
}

export async function Delete_ManyGalleryItems<T extends Prisma.GalleryItemDeleteManyArgs>(
    args: Prisma.SelectSubset<T, Prisma.GalleryItemDeleteManyArgs>,
    projectId: string,
) {
    const data = await prisma.galleryItem.deleteMany(args);
    await Delete_ProjectCache_All(projectId);
    return data;
}
