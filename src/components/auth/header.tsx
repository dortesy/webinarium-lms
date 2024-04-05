import {Roboto_Slab} from "next/font/google";

import { cn } from "@/lib/utils";

const font = Roboto_Slab({
    subsets: ["cyrillic"],
    weight: ["600"],
});

interface HeaderProps {
    label: string;
};

export const Header = ({
                           label,
                       }: HeaderProps) => {
    return (
        <div className="w-full flex flex-col gap-y-4 items-center justify-center">
            <h1 className={cn(
                "text-3xl font-semibold",
                font.className,
            )}>
                {label}
            </h1>

        </div>
    );
};