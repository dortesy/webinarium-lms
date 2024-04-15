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


    const categories = [
        {
            name: 'Разработка',
            slug: 'razrabotka',
            children: [
                { name: 'Web-разработка', slug: 'web-razrabotka' },
                { name: 'Мобильная разработка', slug: 'mobilnaya-razrabotka' },
                { name: 'Программирование', slug: 'programmirovanie' },
                { name: 'Базы данных', slug: 'bazy-dannyh' },
            ],
        },
        {
            name: 'Бизнес',
            slug: 'biznes',
            children: [
                { name: 'Предпринимательство', slug: 'predprinimatelstvo' },
                { name: 'Менеджмент', slug: 'menedzhment' },
                { name: 'Финансы и бухгалтерский учет', slug: 'finansy-i-buhgalterskij-uchet' },
            ],
        },
        {
            name: 'Дизайн',
            slug: 'dizajn',
            children: [
                { name: 'Веб-дизайн', slug: 'veb-dizajn' },
                { name: 'Графический дизайн', slug: 'graficheskij-dizajn' },
                { name: 'Дизайн интерьера', slug: 'dizajn-interera' },
            ],
        },
        // Добавьте другие категории и подкатегории
    ];

    for (const category of categories) {
        const createdCategory = await prismaClient.category.create({
            data: {
                name: category.name,
                slug: category.slug,
            },
        });

        for (const child of category.children) {
            await prismaClient.category.create({
                data: {
                    name: child.name,
                    slug: child.slug,
                    parentId: createdCategory.id,
                },
            });
        }
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