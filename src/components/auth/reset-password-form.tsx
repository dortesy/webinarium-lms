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
import { ForgotPasswordSchema } from '@/schemas/auth.schema';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState, useTransition } from 'react';
import { FormError } from '@/components/auth/form-error';
import { FormSuccess } from '@/components/auth/form-success';
import { resetPassword } from '@/actions/auth/reset-password';
import ForgotPasswordAnimation from './animations/forgot-password-animation';
import { useTranslations } from 'next-intl';
import { ROUTES } from '@/config/routes';

export const ResetPasswordForm = () => {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>('');
  const [success, setSuccess] = useState<string | undefined>('');
  const t = useTranslations('ForgotPassword');

  const form = useForm<z.infer<typeof ForgotPasswordSchema>>({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = (values: z.infer<typeof ForgotPasswordSchema>) => {
    setError('');
    setSuccess('');

    startTransition(() => {
      resetPassword(values).then((data: any) => {
        if (data) {
          setError(data.error);
          setSuccess(data.success);
        }
      });
    });
  };

  return (
    <CardWrapper
      headerLabel={t('headerLabel')}
      backButtonHref={ROUTES.AUTH.LOGIN}
      backButtonLabel={t('backButtonLabel')}
      animation={<ForgotPasswordAnimation />}
    >
      <Form {...form}>
        <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('email.label')}</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={isPending}
                    placeholder={t('email.placeholder')}
                    type="email"
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
