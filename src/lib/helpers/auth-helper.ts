import {db} from "@/lib/db";

export const getUserByEmail = async (email: string) => {
    try {
        return await db.user.findUnique({ where: {email: email }});
    } catch {
        return null;
    }
}


export const getUserById = async (id: string) => {
    try {
        return await db.user.findUnique({ where: {id: id }});
    } catch {
        return null;
    }
}


//Verification Token
export const getVerificationToken = async (token: string) => {
    try {
        return await db.verificationToken.findUnique({
            where: {
                token: token,
            },
        });
    } catch {
        return null;
    }

}

export const getVerificationTokenByEmail = async (email: string) => {
    try {
        return await db.verificationToken.findFirst({
            where: {
                email: email,
            },
        });
    } catch {
        return null;
    }
}

//Passowrd Reset Token
export const getPasswordResetToken = async (token: string) => {
    try {
        return await db.passwordResetToken.findUnique({
            where: {
                token: token,
            },
        });
    } catch {
        return null;
    }

}