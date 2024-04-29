'use client'
import {Course as PrismaCourse} from '@prisma/client';
import {Media} from "@prisma/client";
import {CategoryData} from "@/lib/types/category";
import {useTranslations} from "next-intl";
import React, {Fragment, useCallback, useContext, useEffect, useState, useTransition} from "react";
import {CourseContext} from "@/context/course-context";
import {EditCourseSchema, EditCourseSchemaType, MAX_FILE_SIZE} from "@/schemas/courses/course.schema";
import DOMPurify from "isomorphic-dompurify";
import {Controller, useForm, useFormState} from "react-hook-form";
import * as z from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {CourseLanguageEnum, CourseLevelEnum} from "@/lib/enums/course";
import {EditCourse} from "@/actions/course/edit-course";
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import {Button} from "@/components/ui/button";
import RichEditor from "@/components/rich-editor/rich-editor";
import SearchableSelect from "@/components/custom-ui/searchable-select";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import Dropzone from "@/components/custom-ui/image-dropzone";
import {CircleX, ImageUp} from "lucide-react";
import Image from 'next/image'
import ImageDropzone from "@/components/custom-ui/image-dropzone";
import {FormError} from "@/components/form-error";
import {FormSuccess} from "@/components/form-success";
interface CourseWithMedia extends PrismaCourse {
    image?: Media | null; // Add the image property here
}
interface EditCourseFormProps {
    course: CourseWithMedia;
    categories: CategoryData[];
}
const EditCourseForm = ({ course, categories }: EditCourseFormProps ) => {


    const [isPending, startTransition] = useTransition();
    const [success, setSuccess] = useState<string | undefined>("");
    const [error, setError] = useState<string | undefined>("");


    const t = useTranslations("EditCourseForm");
    const { setCourseTitle } = useContext(CourseContext);


    const defaultValues = {
        id: course.id,
        title: course.title || '',
        description: course.description ? DOMPurify.sanitize(course.description) : '',
        categoryId: course.categoryId || '',
        level: course.level || CourseLevelEnum[0],
        language: course.language || CourseLanguageEnum[0],
        imageId: course.imageId || undefined,
        published: course.published || false,
        creatorId: course.creatorId,
        file: (course.image) ? new File([], course.image.url, {type: "image/png"}) : undefined
    }



    useEffect(() => {
        setCourseTitle(defaultValues.title || "No Title");

    }, [success]);


    const formSchema = EditCourseSchema(t);
    const resetFileInput = React.useRef<() => void>(() => {});




    const {control , watch, reset, register, handleSubmit, setValue, clearErrors } = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues,
    });


    const { isDirty, dirtyFields } = useFormState({ control: control });



    const onSubmit = (values: EditCourseSchemaType) => {
        const formData = new FormData();

        if (values.file) {
            formData.append('image', values.file)
        }


        values.file = undefined;
        startTransition(() => {
            EditCourse(values, formData)
                .then((data) => {
                    if('error' in data){
                        setError(data.error)
                    }
                    if('success' in data){
                        setSuccess(data.success)

                        if(data.course) {
                            reset({
                                ...values,
                                title: data.course.title,
                                imageId: (data.course.imageId) ? data.course.imageId : undefined,
                                file: (data.course.image) ? new File([], data.course.image.url, {type: "image/png"}) : undefined
                            })
                        }
                    }
                })
        })
    }

    useEffect(() => {

        console.log(dirtyFields)
        const handleBeforeUnload = (event: BeforeUnloadEvent) => {
            if (isDirty) {
                event.preventDefault();
                event.stopPropagation();
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            console.log(dirtyFields)
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [isDirty]);

    const handleOnDrop = (acceptedFiles: FileList | null): boolean =>  {
            if (acceptedFiles && acceptedFiles.length > 0) {
                const file = acceptedFiles[0];
                setValue("imageId", '');
                try {
                    formSchema.shape.file.parse(file);
                    setValue('file', file as File);
                    clearErrors('file');
                    //setIsFileInputDirty(true);
                    return true;

                } catch (error) {
                    if (error instanceof z.ZodError) {
                        const errorMessage = error.errors[0].message;
                        setError(errorMessage);
                        return false;
                    } else {
                        console.error('Unknown error occurred during file validation:', error);
                    }
                }
            }
            if (acceptedFiles === null) {
                setValue('file', undefined);
            }
            return false
    }


    return (
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
            <div className="flex-col space-y-2">
                <Label htmlFor="title">{t("title")}</Label>
                <Input
                    {...register("title")}
                    id="title"
                    type="text"
                    disabled={isPending}
                />
            </div>

            <Controller name="description" control={control} render={({field}) => (
                <div className="flex-col space-y-2">
                    <Label htmlFor="description">{t("description")}</Label>
                    <RichEditor value={field.value} name={field.name} onChange={field.onChange} disabled={isPending}/>
                </div>
            )}/>

            <div className="flex flex-wrap -mx-3 mb-2">


                <Controller name="categoryId" control={control} render={({field}) => (
                    <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                        <Label htmlFor="categoryId">{t("category")}</Label>
                        <SearchableSelect
                            items={categories}
                            value={field.value}
                            disabled={isPending}
                            name={field.name}
                            onChange={field.onChange}
                        />
                    </div>
                )}/>


                <Controller name="level"
                            control={control}
                            defaultValue={CourseLevelEnum[0]}
                            render={({field}) => (
                                <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                                    <Label htmlFor="level">{t("level")}</Label>
                                    <Select value={field.value} name={field.name} onValueChange={field.onChange} disabled={isPending}>
                                        <SelectTrigger>
                                            <SelectValue onBlur={field.onBlur} ref={field.ref}/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            {CourseLevelEnum.map((level) => (
                                                <SelectItem key={level} value={level}>
                                                    {t(level)}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}>
                </Controller>

                <Controller name="language" control={control} render={({field}) => (
                    <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                        <Label htmlFor="language">{t("language")}</Label>
                        <Select value={field.value} name={field.name} onValueChange={field.onChange} disabled={isPending}>
                            <SelectTrigger>
                                <SelectValue onBlur={field.onBlur} ref={field.ref}/>
                            </SelectTrigger>
                            <SelectContent>
                                {CourseLanguageEnum.map((language) => (
                                    <SelectItem key={language} value={language}>
                                        {t(language)}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                )}/>


            </div>


            <Controller
                control={control}
                name="file"

                render={({field}) => (
                    <div className="w-full">
                        <Label>Изображение для курса</Label>
                            <ImageDropzone
                                {...field}
                                handleOnDrop={handleOnDrop}
                                resetFileInput={resetFileInput}
                                file={field.value}
                            />
                    </div>
                )}
            />

            <FormError message={error}/>
            <FormSuccess message={success}/>



           <Button className="mt-4" type="submit" disabled={isPending}>Сохранить</Button>
        </form>
);

};

export default EditCourseForm;