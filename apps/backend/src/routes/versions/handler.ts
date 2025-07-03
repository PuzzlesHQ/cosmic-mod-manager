import type { ProjectVersionData } from "@app/utils/types/api";
import { VERSION_SELECT } from "~/db/version_item";
import { getFilesFromId } from "~/routes/project/queries/file";
import { formatVersionData } from "~/routes/project/version/controllers/utils";
import prisma from "~/services/prisma";
import { HTTP_STATUS, invalidReqestResponseData, notFoundResponseData } from "~/utils/http";

export async function getVersionsData(ids: string[]) {
    const emptyRes = { data: [], status: HTTP_STATUS.OK };
    if (!ids.length) return emptyRes;

    const versions = await prisma.version.findMany({
        where: {
            id: {
                in: ids,
            },
        },
        select: VERSION_SELECT,
    });
    if (!versions?.length) return emptyRes;

    // Get all the filesData for each version
    const idsList = [];
    for (const v of versions) {
        for (const file of v.files) {
            idsList.push(file.fileId);
        }
    }
    const versionFilesMap = await getFilesFromId(idsList);
    const formattedList: ProjectVersionData[] = [];

    for (const v of versions) {
        formattedList.push(formatVersionData(v, versionFilesMap));
    }

    return {
        data: formattedList,
        status: HTTP_STATUS.OK,
    };
}

export async function getVersionById(id: string) {
    if (!id) return invalidReqestResponseData("No version id provided!");

    const version = await getVersionsData([id]);
    if (!version.data.length) return notFoundResponseData("Version not found");

    return {
        data: version.data[0],
        status: HTTP_STATUS.OK,
    };
}
