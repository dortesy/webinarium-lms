'use client'
import {useForm} from "react-hook-form";
import * as z from "zod";
import {CreateCourseSchema} from "@/schemas/courses/course.schema";
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
import {useState, useTransition} from "react";
import {Button} from "@/components/ui/button";
import {RegisterSchema} from "@/schemas/auth.schema";
import {trpc} from "@/server/client";
import {FormError} from "@/components/form-error";
import {FormSuccess} from "@/components/form-success";
import {redirect} from "next/navigation";
import { revalidatePath } from 'next/cache'
import { useRouter } from 'next/navigation'

export const AddCourseForm = () => {
    const [error, setError] = useState<string | undefined>("");
    const [success, setSuccess] = useState<string | undefined>("");
    const mutation = trpc.courseRouter.createCourse.useMutation();
    const router = useRouter()

    const form = useForm<z.infer<typeof CreateCourseSchema>>({
        resolver: zodResolver(CreateCourseSchema),
        defaultValues: {
            title: ''
        }
    });

    const onSubmit = (values: z.infer<typeof CreateCourseSchema>) => {
        setError("");
        setSuccess("");
        mutation.mutate(values, {

            onSuccess: (data) => {
                if('error' in data) { setError(data.error)}

                if('success' in data) {
                    setSuccess(data.success)
                    router.push(`/dashboard/teacher/courses/${data.courseId}/`)
                }
            },
            onError: (error) => {
                if (error instanceof Error &&  error.message == 'UNAUTHORIZED') {
                    setError('Для добавление курса вы должны пройти верификацию аккаунта');
                }
            }
        });
    }



    return (

        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="title"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Название курса</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    disabled={mutation.isPending}
                                    placeholder="Пример: Как печь пирожки с капустой (5 секретов от деревенской бабушки)"
                                    type="text"
                                />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />

                <FormError message={error}/>
                <FormSuccess message={success}/>

                <Button className="mt-4" type="submit" disabled={mutation.isPending}>Продолжить</Button>
            </form>
        </Form>

    )
}

