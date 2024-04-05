import { PrismaClient } from '@prisma/client';
import { RoleId } from '@/enums/roleId';

const prismaClient = new PrismaClient();

async function main() {
    const roles = [
        { id: RoleId.USER, name: 'user' },
        { id: RoleId.ADMIN, name: 'admin' },
        { id: RoleId.AUTHOR, name: 'author' },
    ];

    for (const role of roles) {
        await prismaClient.role.upsert({
            where: { id: role.id },
            update: {},
            create: role,
        });
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prismaClient.$disconnect();
    });