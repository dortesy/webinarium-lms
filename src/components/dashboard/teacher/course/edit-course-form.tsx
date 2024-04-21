'use client'
import {useForm} from "react-hook-form";
import * as z from "zod";
import {EditCourseSchema, MAX_FILE_SIZE} from "@/schemas/courses/course.schema";
import {zodResolver} from "@hookform/resolvers/zod";
import {
    Form,
    FormControl, FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import React, {useEffect, useRef, useState, useTransition} from "react";
import {Button} from "@/components/ui/button";
import {FormError} from "@/components/form-error";
import {FormSuccess} from "@/components/form-success";
import { Course as PrismaCourse } from '@prisma/client';
import SearchableSelect  from "@/components/custom-ui/searchable-select";

import { CategoryData } from "@/lib/types/category";
import RichEditor from "@/components/rich-editor/rich-editor";
import {CourseLanguageEnum,  CourseLevelEnum} from "@/lib/enums/course";
import {Separator} from "@/components/ui/separator";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {useTranslations} from "next-intl";
import Image from 'next/image'
import '@uppy/core/dist/style.min.css';
import '@uppy/drag-drop/dist/style.min.css';
import Dropzone from "@/components/ui/dropzone";
import {CircleX, ImageUp} from "lucide-react";
import {Switch} from "@/components/ui/switch";
import {validateFileType} from "@/lib/validation/validation";
interface EditCourseFormProps {
    course: PrismaCourse;
    categories: CategoryData[];
}
export const EditCourseForm = ({course, categories} : EditCourseFormProps) => {
    const [error, setError] = useState<string | undefined>("");
    const [success, setSuccess] = useState<string | undefined>("");
    const t = useTranslations("EditCourseForm");

    const formSchema = EditCourseSchema(t);


    const resetFileInput = React.useRef<() => void>(() => {});

    if (!course) {
        return <div>Course not found</div>
    }

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: course.title || '',
            description: course.description || '',
            categoryId: course.categoryId || '',
            level: course.level || CourseLevelEnum[0],
            language: course.language || CourseLanguageEnum[0],
            image: undefined,
            published: course.published || false,
        }
    });

    const onSubmit = (values: any) => {
        console.log(values);
    }


    const renderDropzoneContent = () => {
        const image = form.watch("image");

        const handleRemoveImage = (e: React.MouseEvent<HTMLButtonElement>) => {
            e.stopPropagation();
            e.preventDefault()
            form.setValue("image", undefined);
            resetFileInput.current();

        };

        return (
            <div className="flex flex-col items-center justify-center p-5 space-y-4">
                {!image && (
                    <>
                        <ImageUp className="w-8 h-8" />
                        <p className="text-base font-medium text-gray-600">Перетащите изображение сюда или нажмите для загрузки</p>
                        <p className="text-sm text-gray-500">{t('image.type')}</p>
                        <p className="text-sm text-gray-500">{t('image.size', {size: MAX_FILE_SIZE / 1024 / 1024})}</p>
                    </>
                )}
                {image && (
                    <div className="relative sm:w-2/3 md:w-1/2 lg:w-1/3 flex flex-col items-center p-3 space-y-4 bg-white shadow-md rounded-lg transition-all duration-300 ease-in-out hover:shadow-lg">
                        <button
                            type="button"
                            onClick={handleRemoveImage}
                            className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md hover:bg-gray-100 focus:outline-none"
                        >
                            <CircleX />
                        </button>
                        <div className="w-full max-h-48 rounded-t-lg overflow-hidden">
                            <Image
                                src={URL.createObjectURL(image)}
                                alt={image.name}
                                width={100}
                                height={100}
                                className="object-contain w-full"
                            />
                        </div>
                        <p className="text-sm font-medium text-gray-800 truncate w-full px-2 border-t pt-3">{image.name}</p>
                    </div>
                )}
            </div>
        );
    };



    function handleOnDrop(acceptedFiles: FileList | null) {
        console.log(acceptedFiles);

        if (acceptedFiles && acceptedFiles.length > 0) {
            const file = acceptedFiles[0];

            try {
                formSchema.shape.image.parse(file);
                form.setValue('image', file);
                form.clearErrors('image');
            } catch (error) {
                if (error instanceof z.ZodError) {
                    const errorMessage = error.errors[0].message;
                    form.setError('image', {
                        message: errorMessage
                    });
                } else {
                    console.error('Unknown error occurred during file validation:', error);
                }
            }
        }
    }


    return (

        <Form {...form}>
            <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                    control={form.control}
                    name="title"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Название курса</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    placeholder={course.title ?? 'Название курса'}
                                    type="text"
                                />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}>
                </FormField>

                <FormField
                    name="description"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Описание курса</FormLabel>
                            <FormControl>
                                <RichEditor
                                    name={field.name}
                                    control={form.control}
                                />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}>
                </FormField>

                <Separator/>

                <div className="flex flex-wrap -mx-3 mb-2">

                    <FormItem className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                        <FormLabel>Категория</FormLabel>
                        <SearchableSelect
                            items={categories}
                            placeholder="Выбрать"
                            name="categoryId"
                            control={form.control}
                        />
                    </FormItem>


                    <FormField
                        control={form.control}
                        name="level"
                        render={({field}) => (
                            <FormItem className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                                <FormLabel>Уровень сложности</FormLabel>
                                <FormControl>
                                    <Select defaultValue={CourseLevelEnum[0]}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Выберите уровень сложности"/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            {CourseLevelEnum.map((level) => (
                                                <SelectItem key={level} value={level}>
                                                    {t(level)}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}>
                    </FormField>


                    <FormField
                        control={form.control}
                        name="language"
                        render={({field}) => (
                            <FormItem className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                                <FormLabel>Язык</FormLabel>
                                <FormControl>
                                    <Select defaultValue={CourseLanguageEnum[0]}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Выберите язык"/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            {CourseLanguageEnum.map((language) => (
                                                <SelectItem key={language} value={language}>
                                                    {t(language)}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}>
                    </FormField>
                </div>

                <FormField
                    control={form.control}
                    name="image"
                    render={({field}) => (
                        <FormItem className="w-full">
                            <FormLabel>Изображение для курса</FormLabel>
                            <FormControl>
                                <Dropzone
                                    {...field}
                                    children={renderDropzoneContent()}
                                    handleOnDrop={handleOnDrop}
                                    resetFileInput={resetFileInput}
                                />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />


                    <div className="space-y-4">
                        <FormField
                            control={form.control}
                            name="published"
                            render={({field}) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                    <div className="space-y-0.5">
                                        <FormLabel className="text-base">
                                            Опубликовать
                                        </FormLabel>
                                        <FormDescription>
                                            После публикации курс будет доступен для всех пользователей
                                        </FormDescription>
                                    </div>
                                    <FormControl>
                                        <Switch
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                    </div>



                        <FormError message={error}/>
                        <FormSuccess message={success}/>

                        <Button className="mt-4" type="submit">Сохранить</Button>
            </form>
        </Form>

)
}

