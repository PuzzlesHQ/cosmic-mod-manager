import type { Prisma } from "@prisma-client";
import prisma from "~/services/prisma";

export function GetSession_Unique<T extends Prisma.SessionFindUniqueArgs>(
    args: Prisma.SelectSubset<T, Prisma.SessionFindUniqueArgs>,
) {
    return prisma.session.findUnique(args);
}

export function GetSession_First<T extends Prisma.SessionFindFirstArgs>(
    args: Prisma.SelectSubset<T, Prisma.SessionFindFirstArgs>,
) {
    return prisma.session.findFirst(args);
}

export function GetManySessions<T extends Prisma.SessionFindManyArgs>(args: Prisma.SelectSubset<T, Prisma.SessionFindManyArgs>) {
    return prisma.session.findMany(args);
}

export function CreateSession<T extends Prisma.SessionCreateArgs>(args: Prisma.SelectSubset<T, Prisma.SessionCreateArgs>) {
    return prisma.session.create(args);
}

export function UpdateSession<T extends Prisma.SessionUpdateArgs>(args: Prisma.SelectSubset<T, Prisma.SessionUpdateArgs>) {
    return prisma.session.update(args);
}

export function DeleteSession<T extends Prisma.SessionDeleteArgs>(args: Prisma.SelectSubset<T, Prisma.SessionDeleteArgs>) {
    return prisma.session.delete(args);
}

export function DeleteManySessions<T extends Prisma.SessionDeleteManyArgs>(
    args: Prisma.SelectSubset<T, Prisma.SessionDeleteManyArgs>,
) {
    return prisma.session.deleteMany(args);
}
