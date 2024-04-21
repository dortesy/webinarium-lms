import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import React, { ChangeEvent, useRef } from "react";
import {CloudUpload} from "lucide-react";

interface DropzoneProps
    extends Omit<
        React.InputHTMLAttributes<HTMLInputElement>,
        "value" | "onChange"
    > {
    classNameWrapper?: string;
    className?: string;
    children: string | React.ReactNode;
    handleOnDrop: (acceptedFiles: FileList | null) => void
    resetFileInput: React.MutableRefObject<() => void>;
}


const Dropzone = React.forwardRef<HTMLDivElement, DropzoneProps>(
    (
        { className, classNameWrapper, children, handleOnDrop, resetFileInput, ...props },
        ref
    ) => {
        const inputRef = useRef<HTMLInputElement | null>(null);
        // Function to handle drag over event


        React.useEffect(() => {
            resetFileInput.current = () => {
                if (inputRef.current) {
                    inputRef.current.value = "";
                }
            };
        }, [resetFileInput]);

        const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
            e.preventDefault();
            e.stopPropagation();
            handleOnDrop(null);
        };

        // Function to handle drop event
        const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
            e.preventDefault();
            e.stopPropagation();
            const { files } = e.dataTransfer;
            if (inputRef.current) {
                inputRef.current.files = files;
                handleOnDrop(files);
            }
        };

        // Function to simulate a click on the file input element
        const handleButtonClick = () => {
            if (inputRef.current) {
                inputRef.current.click();
            }
        };
        return (
            <Card
                ref={ref}
                className={cn(
                    `border-2 border-dashed bg-muted hover:cursor-pointer hover:border-muted-foreground/50`,
                    classNameWrapper
                )}
            >
                <CardContent
                    className="flex flex-col space-y-2 px-2 py-4 text-xs"
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    onClick={handleButtonClick}
                >
                    <div className="flex  text-muted-foreground">
                        <div className="flex flex-col gap-4 w-full">
                          {children}
                        </div>
                        <Input
                            {...props}
                            value={undefined}
                            ref={inputRef}
                            type="file"
                            className={cn("hidden", className)}
                            onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                handleOnDrop(e.target.files)
                            }
                        />
                    </div>
                </CardContent>
            </Card>
        );
    }
);

export default Dropzone;