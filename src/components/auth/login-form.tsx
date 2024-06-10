'use client';
import { CardWrapper } from '@/components/auth/card-wrapper';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { LoginSchema } from '@/schemas/auth.schema';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState, useTransition } from 'react';
import { login } from '@/actions/auth/login';
import { FormError } from '@/components/form-error';
import { FormSuccess } from '@/components/form-success';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import LoginAnimation from './animations/login-animation';

const Login = () => {
  const searchParams = useSearchParams();
  const urlError =
    searchParams.get('error') === 'OAuthAccountNotLinked'
      ? 'E-mail уже используются в других источниках входа'
      : '';
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>('');
  const [success, setSuccess] = useState<string | undefined>('');

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    setError('');
    setSuccess('');

    startTransition(() => {
      login(values).then((data: any) => {
        if (data) {
          setError(data.error);
          setSuccess(data.success);
        }
      });
    });
  };

  return (
    <CardWrapper
      headerLabel="Вход"
      backButtonHref="/auth/register"
      backButtonLabel="Нет аккаунта? Зарегистрироваться"
      showSocial
      animation=<LoginAnimation />
    >
      <Form {...form}>
        <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
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
            )}
          ></FormField>

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
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
                <Button
                  className="px-0  font-normal"
                  variant="link"
                  size="sm"
                  asChild
                >
                  <Link href="/auth/reset-password">Забыли пароль?</Link>
                </Button>
                <FormMessage />
              </FormItem>
            )}
          ></FormField>

          <FormError message={error || urlError} />
          <FormSuccess message={success} />

          <Button disabled={isPending} type="submit" className="w-full">
            Вход
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};

export default Login;

