'use client'

import * as z from "zod"
import {RegisterSchema} from "@/schemas/auth.schema";
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {CardWrapper} from "@/components/auth/card-wrapper";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {useState} from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { trpc } from "@/server/client";
import { RoleId } from '@/lib/enums/user';
import {FormError} from "@/components/form-error";
import {FormSuccess} from "@/components/form-success";

export const RegisterForm = () => {
    const [error, setError] = useState<string | undefined>("");
    const [success, setSuccess] = useState<string | undefined>("");
    const mutation = trpc.authRouter.createUser.useMutation();

    const form = useForm<z.infer<typeof RegisterSchema>>({
        resolver: zodResolver(RegisterSchema),
        defaultValues: {
            email: "",
            password: "",
        }
    })


    const onSubmit = (values: z.infer<typeof RegisterSchema>) => {
        setError("");
        setSuccess("");
        mutation.mutate(values, {

            onSuccess: (data: any) => {
                setError(data.error)
                setSuccess(data.success)
            },
            onError: (error) => {
                setError(error.message);
            }
        });

    };

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
                                    disabled={mutation.isPending}
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
                                <Input {...field} placeholder="******" type="password" disabled={mutation.isPending} />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}>
                    </FormField>


                    <FormError message={error}/>
                    <FormSuccess message={success}/>

                    <Button disabled={mutation.isPending} className="w-full" type="submit">Отправить</Button>
                </form>
            </Form>

        </CardWrapper>
    )
}