'use client'
import {useForm, useFormState, useWatch} from "react-hook-form";
import * as z from "zod";
import {EditCourseSchema, EditCourseSchemaType, MAX_FILE_SIZE} from "@/schemas/courses/course.schema";
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
import React, {startTransition, useCallback, useContext, useEffect, useRef, useState, useTransition} from "react";
import {Button} from "@/components/ui/button";
import {FormError} from "@/components/form-error";
import {FormSuccess} from "@/components/form-success";
import { Course as PrismaCourse, Media } from '@prisma/client';
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
import Dropzone from "@/components/custom-ui/image-dropzone";
import {CircleX, ImageUp} from "lucide-react";
import {Switch} from "@/components/ui/switch";
import {CourseContext} from "@/context/course-context";
import {EditCourse} from "@/actions/course/edit-course";
import DOMPurify from "isomorphic-dompurify";
import {cn} from "@/lib/utils";
import path from "path";
import {getCourseById} from "@/lib/course/course-helper";

interface CourseWithMedia extends PrismaCourse {
    image?: Media | null; // Add the image property here
}
interface EditCourseFormProps {
    initialCourse: CourseWithMedia;
    categories: CategoryData[];
}
export const EditCourseFormOld = ({initialCourse, categories}: EditCourseFormProps) => {
    const [course, setCourse] = useState<CourseWithMedia>(initialCourse);
    const [success, setSuccess] = useState<string | undefined>("");
    const [error, setError] = useState<string | undefined>("");
    //const [isFileInputDirty, setIsFileInputDirty] = useState(false);
    const [isPending, startTransition] = useTransition();
    function updateCourse(course: any) {
        setCourse(course);
    }


    // useEffect(() => {
    //     // This code runs anyway because after form submission happens re-render
    //     console.log('THIS AFFECT RUNS')
    //     setCourseTitle(course.title || "No Title");
    //     form.reset()
    //     if(course.image) {
    //         const imageUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/${course.image.url}`
    //         console.log('fetching image')
    //         fetch(imageUrl).then(res => res.blob())
    //             .then(blob => {
    //                 const fileType = path.extname(imageUrl).replace('.', 'image/');
    //                 let file = new File([blob], course.image?.title!, { type: fileType });
    //                 form.setValue('file', file)
    //             });
    //
    //         //setIsFileInputDirty(false);
    //     }
    // }, [course]);


    const t = useTranslations("EditCourseForm");
    const { setCourseTitle } = useContext(CourseContext);


    const formSchema = EditCourseSchema(t);
    //const resetFileInput = React.useRef<() => void>(() => {});
    const description =  course.description ? DOMPurify.sanitize(course.description) : '';

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            id: course.id,
            title: course.title || '',
            description: description,
            categoryId: course.categoryId || '',
            level: course.level || CourseLevelEnum[0],
            language: course.language || CourseLanguageEnum[0],
            imageId: course.imageId || '',
            published: course.published || false,
            creatorId: course.creatorId,
            file: undefined,
        },
    });

    const {watch, register} = form;


    watch('file')
        //
    //
    //
    //
    // React.useEffect(() => {
    //     const subscription = watch((value, { name, type }) =>
    //         console.log(value, name, type)
    //     )
    //     return () => subscription.unsubscribe()
    // }, [watch])



    // const { isDirty, dirtyFields } = useFormState({ control: form.control });
    //


    //
    //
    //
    // useEffect(() => {
    //     const handleBeforeUnload = (event: BeforeUnloadEvent) => {
    //         if (isDirty || isFileInputDirty) {
    //             event.preventDefault();
    //             event.stopPropagation();
    //         }
    //     };
    //
    //     window.addEventListener('beforeunload', handleBeforeUnload);
    //
    //     return () => {
    //         window.removeEventListener('beforeunload', handleBeforeUnload);
    //     };
    // }, [isDirty, isFileInputDirty]);



    const onSubmit = (values: EditCourseSchemaType) => {

        const formData = new FormData();
        if (values.file) {
            formData.append('image', values.file)
        }

        console.log(values.title)

        values.file = undefined;

        console.log(course.imageId)

        startTransition(() => {
            EditCourse(values, formData)
                .then((data) => {
                    if('error' in data){
                        setError(data.error)
                    }
                    if('success' in data){
                        setSuccess(data.success)
                        //updateCourse(data.course)
                        console.log(course)
                        //setIsFileInputDirty(false);

                    }
                })
        })

    }


    // const renderDropzoneContent = useCallback((file: File | undefined) => {
    //
    //     console.log('rendering dropzone content')
    //     const handleRemoveImage = (e: React.MouseEvent<HTMLButtonElement>) => {
    //         e.stopPropagation();
    //         e.preventDefault()
    //
    //         //setIsFileInputDirty(true);
    //         form.setValue("file", undefined);
    //         form.setValue("imageId", '');
    //         //resetFileInput.current();
    //
    //     };
    //
    //     return (
    //         <div className="flex flex-col items-center justify-center p-5 space-y-4">
    //             {!file && (
    //                 <>
    //                     <ImageUp className="w-8 h-8" />
    //                     <p className="text-base font-medium text-gray-600">Перетащите изображение сюда или нажмите для загрузки</p>
    //                     <p className="text-sm text-gray-500">{t('image.type')}</p>
    //                     <p className="text-sm text-gray-500">{t('image.size', {size: MAX_FILE_SIZE / 1024 / 1024})}</p>
    //                 </>
    //             )}
    //             {file && (
    //                 <div className="relative sm:w-2/3 md:w-1/2 lg:w-1/3 flex flex-col items-center p-3 space-y-4 bg-white shadow-md rounded-lg transition-all duration-300 ease-in-out hover:shadow-lg">
    //                     <button
    //                         type="button"
    //                         onClick={handleRemoveImage}
    //                         className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md hover:bg-gray-100 focus:outline-none"
    //                     >
    //                         <CircleX />
    //                     </button>
    //                     <div className="w-full max-h-48 rounded-t-lg overflow-hidden">
    //                         <Image
    //                             src={URL.createObjectURL(file)}
    //                             alt={file.name}
    //                             width={100}
    //                             height={100}
    //                             className="object-contain w-full"
    //                         />
    //                     </div>
    //                     <p className="text-sm font-medium text-gray-800 truncate w-full px-2 border-t pt-3">{file.name}</p>
    //                 </div>
    //             )}
    //         </div>
    //     );
    // }, []);



    const handleOnDrop =  useCallback((acceptedFiles: FileList | null) =>  {
        if (acceptedFiles && acceptedFiles.length > 0) {
            const file = acceptedFiles[0];
            form.setValue("imageId", '');
            try {
                formSchema.shape.file.parse(file);
                form.setValue('file', file as File);
                form.clearErrors('file');
                //setIsFileInputDirty(true);

            } catch (error) {
                if (error instanceof z.ZodError) {
                    const errorMessage = error.errors[0].message;
                    form.setError('file', {
                        message: errorMessage
                    });
                } else {
                    console.error('Unknown error occurred during file validation:', error);
                }
            }
        }
    }, []
    )


    return (

        <Form {...form}>
            <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)} encType="multipart/form-data" >

                <FormField
                    name="title"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Название курса</FormLabel>
                            <FormControl>
                                <Input
                                    type="text"
                                    {...register('title')}
                                />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}>
                </FormField>

                <FormField
                    name="description"
                    control={form.control}
                    render={({field}) => (
                        <FormItem className={isPending ? 'opacity-50 cursor-not-allowed' : ''}>
                            <FormLabel>Описание курса</FormLabel>
                            <FormControl>
                                <RichEditor
                                    name={field.name}
                                />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}>
                </FormField>

                <Separator/>

                <div className="flex flex-wrap -mx-3 mb-2">

                    <FormField name="categoryId" control={form.control} render={({field}) => (
                        <FormItem className={cn("w-full md:w-1/3 px-3 mb-6 md:mb-0", isPending ? 'opacity-50 cursor-not-allowed pointer-events-none' : '')}>
                            <FormLabel>Категория</FormLabel>
                            <SearchableSelect
                                items={categories}
                                placeholder="Выбрать"
                                name="categoryId"

                            />
                        </FormItem>)}>
                    </FormField>


                    <FormField
                        control={form.control}
                        name="level"
                        render={({field}) => (
                            <FormItem className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                                <FormLabel>Уровень сложности</FormLabel>
                                <FormControl>
                                    <Select defaultValue={CourseLevelEnum[0]} disabled={isPending}>
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
                                    <Select defaultValue={CourseLanguageEnum[0]} disabled={isPending}>
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
                    name="file"
                    render={({field}) => (
                        <FormItem className="w-full">
                            <FormLabel>Изображение для курса</FormLabel>
                            <FormControl>
                                <Dropzone
                                    {...field}
                                    //children={renderDropzoneContent(field.value)}
                                    handleOnDrop={handleOnDrop}
                                    //resetFileInput={resetFileInput}
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
                                        disabled={isPending}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                </div>

                <FormError message={error}/>
                <FormSuccess message={success}/>

                <Button className="mt-4" type="submit" disabled={isPending}>Сохранить</Button>
            </form>
        </Form>

    )
}