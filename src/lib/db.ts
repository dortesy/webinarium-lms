import {PrismaClient} from "@prisma/client";


declare global {
    var  prisma: PrismaClient|undefined
}

export const db = globalThis.prisma || new PrismaClient({ log: ['query', 'info', 'warn', 'error'],});

if (process.env.NODE_ENV !== "production" && !global.prisma) globalThis.prisma = db