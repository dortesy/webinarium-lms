"use server"


import {db } from "@/lib/db";
import {getUserByEmail, getVerificationToken} from "@/lib/auth/auth-helper";

export const newVerification = async (token: string) => {
    const existingToken = await getVerificationToken(token);

    if(!existingToken) {
        return {error: "Токен не найден"};
    }

    const hasTokenExpired = new Date() > existingToken.expires;

    if(hasTokenExpired) {
        return {error: "Токен истек"};
    }

    const existingUser = await getUserByEmail(existingToken.email);

    if(!existingUser) {
        return {error: "Email не найден"};
    }

    await db.user.update({
        where: {id: existingUser.id},
        data: {
            emailVerified: new Date(),
            email: existingToken.email
        },
    })

    await db.verificationToken.delete({
        where: {id: existingToken.id}
    });

    return {success: "Email успешно подтвержден"}

}