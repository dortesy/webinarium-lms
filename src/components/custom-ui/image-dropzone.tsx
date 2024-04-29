import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import React, {ChangeEvent, useRef, memo, useState} from "react";
import {CircleX, CloudUpload, ImageUp} from "lucide-react";
import {MAX_FILE_SIZE} from "@/schemas/courses/course.schema";
import Image from "next/image";
import {useTranslations} from "next-intl";
import { getBase64 } from '@/lib/utils';
import {useController} from "react-hook-form";


interface DropzoneProps
    extends Omit<
        React.InputHTMLAttributes<HTMLInputElement>,
        "value" | "onChange"
    > {
    classNameWrapper?: string;
    className?: string;
    file: File | undefined;
    handleOnDrop: (acceptedFiles: FileList | null) => boolean;
    resetFileInput: React.MutableRefObject<() => void>;
}


const ImageDropzone = React.forwardRef<HTMLDivElement, DropzoneProps>(
    (
        { className, classNameWrapper, handleOnDrop, resetFileInput, file, ...props },
        ref
    ) => {
        console.log('rendering image dropzone')


        const [fileUrl, setFileUrl] = useState<string | null>(file ? file.name : null)
        const [fileName, setFileName] = useState<string | ''>(file ? file.name : '');

        const inputRef = useRef<HTMLInputElement | null>(null);
        //const [base64, setBase64] = useState(file.name);
        const t = useTranslations("EditCourseForm");
        // Function to handle drag over event



        //if file exist show link to it, if does not exist show upload and then show the file
        // how we can do it?
        // 1. check if file exist
        // 2. if exist show the file
        // 3. if does not exist show upload button
        // 4. if file is uploaded show the file
        //But files are different,

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
                if (handleOnDrop(files)) {
                    setFileUrl(URL.createObjectURL(files[0]));
                    setFileName(files[0].name);
                }
            }
        };

        // Function to simulate a click on the file input element
        const handleButtonClick = () => {
            if (inputRef.current) {
                inputRef.current.click();
            }
        };

        const handleRemoveImage = (e: React.MouseEvent<HTMLButtonElement>) => {
            e.stopPropagation();
            e.preventDefault()

            setFileUrl(null);
            setFileName('');
            handleOnDrop(null)
            if (inputRef.current) {
                // console.log(inputRef.current.files[0])
                // inputRef.current.files[0] = null;
                //inputRef.current.
                inputRef.current.value = '';
            }


        }

        const handleOnChange = async (e: ChangeEvent<HTMLInputElement>) => {
            if (e.target.files?.[0]) {
                if (handleOnDrop(e.target.files)) {
                    setFileUrl(URL.createObjectURL(e.target.files[0]));
                    setFileName(e.target.files[0].name);
                }

            }
        }

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
                            <div className="flex flex-col items-center justify-center p-5 space-y-4">
                                {!fileUrl && (
                                    <>
                                        <ImageUp className="w-8 h-8" />
                                        <p className="text-base font-medium text-gray-600">Перетащите изображение сюда или нажмите для загрузки</p>
                                        <p className="text-sm text-gray-500">{t('image.type')}</p>
                                        <p className="text-sm text-gray-500">{t('image.size', {size: MAX_FILE_SIZE / 1024 / 1024})}</p>
                                    </>
                                )}
                                {fileUrl && (
                                    <div className="relative max-w-40 items-center p-3 space-y-4 bg-white shadow-md rounded-lg transition-all duration-300 ease-in-out hover:shadow-lg">
                                        <button
                                            type="button"
                                            onClick={handleRemoveImage}
                                            className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md hover:bg-gray-100 focus:outline-none"
                                        >
                                            <CircleX />
                                        </button>
                                        <div className="w-32 max-h-48 rounded-t-lg overflow-hidden">
                                            <Image
                                                src={fileUrl}
                                                alt={fileName}
                                                placeholder={"empty"}
                                                width={100}
                                                height={100}
                                                className="object-contain w-full"
                                            />
                                        </div>
                                        <p className="text-sm font-medium text-gray-800 truncate w-full px-2 border-t pt-3">{fileName}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                        <Input
                            {...props}
                            value={undefined}
                            ref={inputRef}
                            type="file"
                            className={cn("hidden", className)}
                            onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                handleOnChange(e)
                            }
                        />
                    </div>
                </CardContent>
            </Card>
        );
    }
);

export default memo(ImageDropzone);