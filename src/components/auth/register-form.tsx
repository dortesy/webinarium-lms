'use client'

import * as z from "zod"
import {LoginSchema, RegisterSchema} from "@/schemas/auth.schema";
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {CardWrapper} from "@/components/auth/card-wrapper";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {useState, useTransition} from "react";
import {FormError} from "@/components/form-error";
import {FormSuccess} from "@/components/form-success";
import {Registration} from "@/actions/auth/registration";

export const RegisterForm = () => {
    const [error, setError] = useState<string | undefined>("");
    const [success, setSuccess] = useState<string | undefined>("");
    const [isPending, startTransition] = useTransition();

    const form = useForm<z.infer<typeof RegisterSchema>>({
        resolver: zodResolver(RegisterSchema),
        defaultValues: {
            email: "",
            password: "",
        }
    })


    const onSubmit = (values: z.infer<typeof LoginSchema>) => {
        setError('')
        setSuccess('')

        startTransition(() => {
            Registration(values)
                .then((data) => {
                    if('error' in data){
                        setError(data.error)
                    }
                    if('success' in data){
                        setSuccess(data.success)
                    }
                })
        })
    }

    return (
        <CardWrapper headerLabel={'Регистрация'} backButtonLabel={'Уже есть аккаунт? Войти'}
                     backButtonHref={'/auth/login'} showSocial>
            <Form {...form}>
                <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
                    <FormField control={form.control} name="email" render={({field}) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    placeholder="E-mail"
                                    type="email"
                                    disabled={isPending}
                                />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}>
                    </FormField>

                    <FormField control={form.control} name="password" render={({field}) => (
                        <FormItem>
                            <FormLabel>Пароль</FormLabel>
                            <FormControl>
                                <Input {...field} placeholder="******" type="password" disabled={isPending} />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}>
                    </FormField>


                    <FormError message={error}/>
                    <FormSuccess message={success}/>

                    <Button disabled={isPending} className="w-full" type="submit">Отправить</Button>
                </form>
            </Form>

        </CardWrapper>
    )
}