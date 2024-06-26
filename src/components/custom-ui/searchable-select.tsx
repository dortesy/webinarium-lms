'use client'
import * as React from "react";
import { useForm, useController, UseControllerProps } from "react-hook-form";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Button} from "@/components/ui/button";
import {Check, ChevronsUpDown} from "lucide-react";
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList} from "@/components/ui/command";
import {cn} from "@/lib/utils";
import { CategoryData } from "@/lib/types/category";



interface SearchableSelectProps extends UseControllerProps {
    items: CategoryData[];
    placeholder?: string;
    value: string | "";
    disabled?: boolean;
    onChange: (newValue: string) => void;
}

const SearchableSelect = React.memo(({
                               items,
                               placeholder = "Выбрать",
                               value, disabled, onChange
                           }: SearchableSelectProps) => {



    const [open, setOpen] = React.useState(false)
    const findItemByValue = (items: CategoryData[], value: string): string | undefined => {
        for (const item of items) {
            if (item.value === value) {
                return item.label;
            }

            if (item.children) {
                const childResult = findItemByValue(item.children, value);
                if (childResult) {
                    return childResult;
                }
            }
        }
    };

    return (

        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    disabled={disabled}
                    role="combobox"
                    className={cn(
                        "w-full justify-between min-w-full relative",
                        !value && "text-muted-foreground"
                    )}
                >
                    <span className="truncate mr-4">
                    {value ? findItemByValue(items, value) || placeholder : placeholder}
                    </span>
                     <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50 absolute right-2"/>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
                <Command>
                    <CommandInput placeholder="Поиск..." />
                    <CommandList>
                        <CommandEmpty>Ничего не найдено</CommandEmpty>
                        {items.map((item) => (
                            <CommandGroup heading={item.label} key={item.value}>

                                {item.children?.map((childItem) => (
                                    <CommandItem
                                        className="cursor-pointer"
                                        value={childItem.label}
                                        key={childItem.value}
                                        onSelect={() => {onChange(childItem.value); setOpen(false);}}
                                    >
                                        <Check
                                            className={cn(
                                                "mr-2 h-4 w-4",
                                                childItem.value == value ? "opacity-100" : "opacity-0"
                                            )}
                                        />
                                        {childItem.label}
                                    </CommandItem>
                                ))}

                          </CommandGroup>

                        ))}
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>


    );
})

SearchableSelect.displayName = 'SearchableSelect';
export default SearchableSelect