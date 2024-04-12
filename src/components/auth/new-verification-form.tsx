"use client"
import { CardWrapper } from "@/components/auth/card-wrapper";
import {BeatLoader} from "react-spinners";
import {useSearchParams} from "next/navigation";
import {useCallback, useEffect, useState} from "react";
import {newVerification} from "@/actions/new-verification";
import {FormError} from "@/components/form-error";
import {FormSuccess} from "@/components/form-success";
export const NewVerificationForm = () => {
    const [error, setError] = useState<string | undefined>();
    const [success, setSuccess] = useState<string | undefined>();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");



    const onSubmit = useCallback(() => {
        console.log(token)
        if (!token) {
            console.log(token)
            setError("Токен не найден")
            return;
        }
        newVerification(token).then((data) => {
            if (data.error) {
                setError(data.error)
                return;
            }
            if (data.success) {
                setError(data.success)
            }
        }).catch((error) => {
            setError("Что-то пошло не так")
        })
    }, [token])

    useEffect(() => {
        onSubmit()
    }, [onSubmit])
    return (
        <CardWrapper headerLabel="Верификация E-mail адреса" backButtonLabel="Назад к форме входа" backButtonHref="/auth/login">
            <div className="flex items-center w-full justify-center">
                {!error && !success && (<BeatLoader  />)}
                {error && (
                    <FormError message={error} />
                )}
                {!error && (
                    <FormSuccess message={success} />
                )}
            </div>
        </CardWrapper>
    )
}