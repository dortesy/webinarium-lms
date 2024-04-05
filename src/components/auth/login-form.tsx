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
import {LoginSchema} from "@/schemas";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {useState, useTransition} from "react";
import {login} from "@/actions/login";
import {FormError} from "@/components/form-error";
import {FormSuccess} from "@/components/form-success";
const Login = () => {


    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string|undefined>("");
    const [success, setSuccess] = useState<string|undefined>("");

    const form = useForm<z.infer<typeof LoginSchema>>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = (values: z.infer<typeof LoginSchema>) => {
        setError('')
        setSuccess('')

        startTransition(() => {
            login(values).then((data) => {
                if (data && 'error' in data) {
                    setError(data.error)
                } else {
                    setSuccess('Вы успешно вошли, перенаправляем вас...')
                }
            })
        })
    }

    return (
        <CardWrapper
        headerLabel="Вход"
        backButtonHref="/auth/register"
        backButtonLabel="Нет аккаунта? Зарегистрироваться"
        showSocial
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

                    <FormField control={form.control} name="password" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Пароль</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    disabled={isPending}
                                    placeholder="******"
                                    type="password"
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
                        Вход
                    </Button>


                </form>
            </Form>

        </CardWrapper>
    )
}

export default Login