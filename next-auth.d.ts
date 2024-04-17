
import "next-auth";

declare module "@auth/core/adapters" {
    interface AdapterUser {
        roleId: number;
        isVerified: boolean;
    }
}


declare module "next-auth" {
    interface User {
        roleId: number;
        isVerified: boolean;
    }
}

