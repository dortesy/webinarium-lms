'use client'
import {useForm} from "react-hook-form";
import * as z from "zod";
import {EditCourseSchema} from "@/schemas/courses/course.schema";
import {zodResolver} from "@hookform/resolvers/zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {useEffect, useState, useTransition} from "react";
import {Button} from "@/components/ui/button";
import {trpc} from "@/server/client";
import {FormError} from "@/components/form-error";
import {FormSuccess} from "@/components/form-success";
import { Course as PrismaCourse } from '@prisma/client';
import SearchableSelect  from "@/components/custom-ui/searchable-select";

import { CategoryData } from "@/lib/types/category";


interface EditCourseFormProps {
    course: PrismaCourse;
    categories: CategoryData[];
}
export const EditCourseForm = ({course, categories} : EditCourseFormProps) => {
    const [error, setError] = useState<string | undefined>("");
    const [success, setSuccess] = useState<string | undefined>("");
    //const mutation = trpc.courseRouter.createCourse.useMutation();


    if (!course) {
        return <div>Course not found</div>
    }

    const form = useForm<z.infer<typeof EditCourseSchema>>({
        resolver: zodResolver(EditCourseSchema),
        defaultValues: {
            title: course.title || '',
            description: course.description || '',
            categoryId: course.categoryId || '',
        }
    });

    const onSubmit = (values: any) => {
        console.log(values);
    }


    return (

        <Form {...form}>
            <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)} >
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
                    control={form.control}
                    name="description"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Описание курса</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    placeholder={course.description ?? 'Описание курса'}
                                    type="text"
                                />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}>
                </FormField>

                <FormItem className="flex flex-col">
                    <FormLabel>Категория</FormLabel>
                    <SearchableSelect
                        items={categories}
                        placeholder="Выбрать"
                        name="categoryId"
                        control={form.control}
                    />
                </FormItem>



                <FormError message={error}/>
                <FormSuccess message={success}/>

                <Button className="mt-4" type="submit">Сохранить</Button>
            </form>
        </Form>

    )
}

