import type { Prisma } from "@prisma-client";
import prisma from "~/services/prisma";

export function GetUserConfirmation<T extends Prisma.UserConfirmationFindUniqueArgs>(
    args: Prisma.SelectSubset<T, Prisma.UserConfirmationFindUniqueArgs>,
) {
    return prisma.userConfirmation.findUnique(args);
}

export function UpdateUserConfirmation<T extends Prisma.UserConfirmationUpdateArgs>(
    args: Prisma.SelectSubset<T, Prisma.UserConfirmationUpdateArgs>,
) {
    return prisma.userConfirmation.update(args);
}

export function DeleteUserConfirmation<T extends Prisma.UserConfirmationDeleteArgs>(
    args: Prisma.SelectSubset<T, Prisma.UserConfirmationDeleteArgs>,
) {
    return prisma.userConfirmation.delete(args);
}

export function DeleteManyUserConfirmations<T extends Prisma.UserConfirmationDeleteManyArgs>(
    args: Prisma.SelectSubset<T, Prisma.UserConfirmationDeleteManyArgs>,
) {
    return prisma.userConfirmation.deleteMany(args);
}
