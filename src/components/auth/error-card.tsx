import {Header} from "@/components/auth/header";
import {BackButton} from "@/components/auth/back-button";
import {CardWrapper} from "@/components/auth/card-wrapper";
import {ExclamationTriangleIcon} from "@radix-ui/react-icons";


export const ErrorCard = () => {
    return (
        <CardWrapper headerLabel="Произошла ошибка" backButtonLabel="Вернуться на страницу входа" backButtonHref="/auth/login">
            <div className="w-full flex justify-center items-center">
                <ExclamationTriangleIcon className="w-20 h-20 text-red-500"/>
            </div>
        </CardWrapper>
    )
}