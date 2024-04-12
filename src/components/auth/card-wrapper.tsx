"use client";

import {
    Card,
    CardContent,
    CardFooter,
    CardHeader
} from "@/components/ui/card";
import { Header } from "@/components/auth/header";
import { BackButton } from "@/components/auth/back-button";
import {Social} from "@/components/auth/social";
import {ReactNode} from "react";

interface CardWrapperProps {
    children: ReactNode;
    headerLabel: string;
    backButtonLabel: string;
    backButtonHref: string;
    showSocial?: boolean;
}


export const CardWrapper = ({
                                children,
                                headerLabel,
                                backButtonLabel,
                                backButtonHref,
                                showSocial
                            }: CardWrapperProps) => {
    return (
        <div className="flex-1 flex flex-col items-center justify-center">
            <div>
            <Card className="w-[400px]">
                <CardHeader>
                    <Header label={headerLabel} />
                </CardHeader>
                <CardContent>
                    {children}
                </CardContent>
                {showSocial && (
                    <CardFooter>
                        <Social />
                    </CardFooter>
                )}

                <CardFooter>
                    <BackButton href={backButtonHref} label={backButtonLabel} />
                </CardFooter>
            </Card>
            </div>
        </div>
    );
};
