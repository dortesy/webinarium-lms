import {Resend} from "resend"

const resend = new Resend(process.env.RESNED_API_KEY)


export const sendForgotPasswordEmail = async (email: string, token: string) => {
    const resetLink = `${process.env.NEXT_PUBLIC_SITE_URL}/auth/new-password?token=${token}`;
    await resend.emails.send({
        from: "onboarding@resend.dev",
        to: email,
        subject: "Сброс пароля",
        html: `
            <h1>Сброс пароля</h1>
            <p>Для сброса пароля перейдите по ссылке ниже:</p>
            <a href="${resetLink}">${resetLink}</a>
        `
    })

}
export const sendVerificationEmail = async (email: string, token: string) => {
    const confirmLink = `${process.env.NEXT_PUBLIC_SITE_URL}/auth/new-verification?token=${token}`;
    await resend.emails.send({
        from: "onborading@resend.dev",
        to: email,
        subject: "Подтверждение email",
        html: `
            <h1>Подтвердите ваш email</h1>
            <p>Для подтверждения вашего email перейдите по ссылке ниже:</p>
            <a href="${confirmLink}">${confirmLink}</a>
        `
    })
}