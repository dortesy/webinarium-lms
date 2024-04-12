'use client'
import {CardWrapper} from "@/components/auth/card-wrapper";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {ForgotPasswordSchema, LoginSchema} from "@/schemas/auth";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {useState, useTransition} from "react";
import {FormError} from "@/components/form-error";
import {FormSuccess} from "@/components/form-success";
import {resetPassword} from "@/actions/reset-password";

export const ResetPasswordForm = () => {
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string|undefined>("");
    const [success, setSuccess] = useState<string|undefined>("");

    const form = useForm<z.infer<typeof ForgotPasswordSchema>>({
        resolver: zodResolver(ForgotPasswordSchema),
        defaultValues: {
            email: "",
        },
    });

    const onSubmit = (values: z.infer<typeof ForgotPasswordSchema>) => {
        setError('')
        setSuccess('')

        console.log(values)

        startTransition(() => {
            resetPassword(values)
                .then((data: any) => {
                    if(data) {
                        setError(data.error)
                        setSuccess(data.success)
                    }
                })
        })
    }

    return (
        <CardWrapper
            headerLabel="Восстановление пароля"
            backButtonHref="/auth/login"
            backButtonLabel="Вернуться на страницу входа"
        >
            <Form {...form}>
                <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
                    <FormField control={form.control} name="email" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    disabled={isPending}
                                    placeholder="john.doe@example.com"
                                    type="email"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}></FormField>



                    <FormError message={error}/>
                    <FormSuccess message={success}/>

                    <Button
                        disabled={isPending}
                        type="submit"
                        className="w-full"
                    >
                       Отправить
                    </Button>


                </form>
            </Form>

        </CardWrapper>
    )
}

