'use client';
import { CardWrapper } from '@/components/auth/card-wrapper';
import { BeatLoader } from 'react-spinners';
import { useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { newVerification } from '@/actions/auth/new-verification';
import { FormError } from '@/components/auth/form-error';
import { FormSuccess } from '@/components/auth/form-success';
import VerificationAnimation from './animations/verification-animation';
import { ROUTES } from '@/config/routes';
import { useTranslations } from 'next-intl';

export const NewVerificationForm = () => {
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const t = useTranslations('VerificationForm');

  const onSubmit = useCallback(() => {
    if (!token) {
      setError(t('messages.tokenNotFound'));
      return;
    }
    newVerification(token)
      .then((data) => {
        if (data.error) {
          setError(data.error);
          return;
        }
        if (data.success) {
          setSuccess(data.success);
        }
      })
      .catch(() => {
        setError(t('messages.genericError'));
      });
  }, [token, t]);

  useEffect(() => {
    onSubmit();
  }, [onSubmit]);

  return (
    <CardWrapper
      headerLabel={t('headerLabel')}
      backButtonLabel={t('backButtonLabel')}
      backButtonHref={ROUTES.AUTH.LOGIN}
      animation={<VerificationAnimation />}
    >
      <div className="flex items-center w-full justify-center">
        {!error && !success && <BeatLoader />}
        {error && <FormError message={error} />}
        {!error && <FormSuccess message={success} />}
      </div>
    </CardWrapper>
  );
};

export default NewVerificationForm;
