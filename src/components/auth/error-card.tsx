import { CardWrapper } from '@/components/auth/card-wrapper';
import { ExclamationTriangleIcon } from '@radix-ui/react-icons';
import ErrorCardAnimation from '@/components/auth/animations/error-card-animation';

export const ErrorCard = () => {
  return (
    <CardWrapper
      headerLabel="Произошла ошибка"
      backButtonLabel="Вернуться на страницу входа"
      backButtonHref="/auth/login"
      animation={<ErrorCardAnimation />}
    >
      <div className="w-full flex justify-center items-center">
        <ExclamationTriangleIcon className="w-20 h-20 text-red-500" />
      </div>
    </CardWrapper>
  );
};
