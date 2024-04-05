
import "next-auth";
import {PrismaAdapter} from "@auth/prisma-adapter";

declare module "@auth/core/adapters" {
    interface AdapterUser {
        roleId: number;
    }
}


declare module "next-auth" {
    interface User {
        roleId: number;
    }
}

