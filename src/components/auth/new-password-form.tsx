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
import { NewPasswordSchema } from '@/schemas/auth.schema';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState, useTransition } from 'react';
import { FormError } from '@/components/auth/form-error';
import { FormSuccess } from '@/components/auth/form-success';
import { newPassword } from '@/actions/auth/new-password';
import { useSearchParams } from 'next/navigation';
import { DEFAULT_LOGIN_REDIRECT } from '@/routes';
import NewPasswordAnimation from './animations/new-password-animation';
import { ROUTES } from '@/config/routes';
import { useTranslations } from 'next-intl';

export const NewPasswordForm = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const t = useTranslations('NewPasswordForm');
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>('');
  const [success, setSuccess] = useState<string | undefined>('');

  const form = useForm<z.infer<typeof NewPasswordSchema>>({
    resolver: zodResolver(NewPasswordSchema),
    defaultValues: {
      password: '',
    },
  });

  const onSubmit = (values: z.infer<typeof NewPasswordSchema>) => {
    setError('');
    setSuccess('');

    startTransition(() => {
      newPassword(values, token).then((data: any) => {
        if (data) {
          setError(data.error);
          setSuccess(data.success);
          if (data.success) {
            setTimeout(() => {
              window.location.href = DEFAULT_LOGIN_REDIRECT;
            }, 3000);
          }
        }
      });
    });
  };

  return (
    <CardWrapper
      headerLabel={t('headerLabel')}
      backButtonHref={ROUTES.AUTH.LOGIN}
      backButtonLabel={t('backButtonLabel')}
      animation={<NewPasswordAnimation />}
    >
      <Form {...form}>
        <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('password.label')}</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={isPending}
                    placeholder={t('password.placeholder')}
                    type="password"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          ></FormField>

          <FormError message={error} />
          <FormSuccess message={success} />

          <Button disabled={isPending} type="submit" className="w-full">
            {t('submitButton')}
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};
