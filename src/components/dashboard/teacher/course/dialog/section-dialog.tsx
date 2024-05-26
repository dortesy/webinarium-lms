'use client'

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogTrigger
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {SectionSchema, SectionSchemaType} from "@/schemas/courses/course.schema";

interface SectionDialogProps {
    dialogTitle: string;
    dialogTrigger: React.ReactNode;
    dialogDescription: React.ReactNode;
    dialogFooterButton: string;
    onSubmit: (values: SectionSchemaType) => void;
    defaultValues?: SectionSchemaType;
}

const SectionDialog = ({ dialogTitle, dialogTrigger, dialogDescription, dialogFooterButton, onSubmit, defaultValues }: SectionDialogProps) => {
    const [open, setOpen] = React.useState(false);
    const t = useTranslations('CourseOutlinePage');
    const formSchema = SectionSchema(t);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: defaultValues || {
            title: "",
            description: "",
        }
    });

    // console.log('rendered section dialog')

    // console.log(form.getValues())

    useEffect(() => {
        form.reset(defaultValues);
    }, [defaultValues, form]);
    

    const handleSubmit = form.handleSubmit((values) => {
        onSubmit(values);
        setOpen(false)
        form.reset()

    });

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{dialogTrigger}</DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{dialogTitle}</DialogTitle>
                    <DialogDescription>
                        {dialogDescription}
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={handleSubmit}>
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('addForm.section.title')}</FormLabel>
                                    <FormControl>
                                        <Input {...field} type="text" />
                                    </FormControl>
                                    <FormDescription />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('addForm.section.description')}</FormLabel>
                                    <FormControl>
                                        <Textarea {...field} />
                                    </FormControl>
                                    <FormDescription />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
                            <Button type="submit">{dialogFooterButton}</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default SectionDialog;
