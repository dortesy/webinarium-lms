import {v4 as uuidv4} from 'uuid';
import {getVerificationTokenByEmail} from "@/lib/auth/auth-helper";
import {db} from "@/lib/db";



export const generatePasswordResetToken = async (email: string) => {
    const token = uuidv4();
    const expires = new Date(new Date().getTime() + 3600 * 1000);
    const existingToken = await getVerificationTokenByEmail(email);
    if(existingToken) {
        await db.passwordResetToken.delete({
            where: {
                id: existingToken.id
            }
        })
    }

    return db.passwordResetToken.create({
        data: {
            email,
            token,
            expires
        }
    });

}
export const generateVerificationToken = async (email: string) => {
    const token = uuidv4();
    const expires = new Date(new Date().getTime() + 3600 * 1000);
    const existingToken = await getVerificationTokenByEmail(email);
    if(existingToken) {
        await db.verificationToken.delete({
            where: {
                id: existingToken.id
            }
        })
    }

    return db.verificationToken.create({
        data: {
            email,
            token,
            expires
        }
    });
}


