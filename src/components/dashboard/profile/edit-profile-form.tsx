'use client';

import {
  UserProfileSchema,
  UserProfileSchemaType,
} from '@/schemas/profile.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { User } from '@prisma/client';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import RichEditor from '@/components/rich-editor/rich-editor';
import ImageDropzone from '@/components/custom-ui/image-dropzone';
import { useRef, useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { EditProfile } from '@/actions/course/edit-profile';
import { FormError } from '@/components/form-error';
import { FormSuccess } from '@/components/form-success';
import { useSession } from 'next-auth/react';
export const EditProfileForm = ({ user }: { user: User }) => {
  const t = useTranslations('ProfileForm');
  const formSchema = UserProfileSchema(t);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const session = useSession();
  console.log(session);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: user.id,
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      bio: user.bio || '',
      telegram: user.telegram || '',
      phone: user.phone || '',
      website: user.website || '',
      instagram: user.instagram || '',
      facebook: user.facebook || '',
      youtube: user.youtube || '',
      file: user.image
        ? new File([], user.image, { type: 'image/png' })
        : undefined,
    },
  });

  const resetFileInput = useRef<() => void>(() => {});

  const onSubmit = (values: UserProfileSchemaType) => {
    const formData = new FormData();

    if (values.file) {
      formData.append('file', values.file);
    }

    values.file = undefined;
    startTransition(() => {
      EditProfile(values, formData).then((data) => {
        if (Array.isArray(data.error)) {
          // Handle the case where data.error is a ZodIssue[]
          const errorMessages = data.error
            .map((issue) => issue.message)
            .join(', ');
          setError(errorMessages);
        } else {
          setSuccess(data.success || null);
          console.log(data);
          session.update(data.user);
        }
      });
    });
  };

  const handleOnDrop = (acceptedFiles: FileList | null): boolean => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      try {
        formSchema.shape.file.parse(file);
        form.setValue('file', file as File);
        form.clearErrors('file');
        return true;
      } catch (error) {
        if (error instanceof z.ZodError) {
          const errorMessage = error.errors[0].message;
          form.setError('file', { message: errorMessage });
          return false;
        } else {
          console.error(
            'Unknown error occurred during file validation:',
            error,
          );
        }
      }
    }
    if (acceptedFiles === null) {
      form.setValue('file', undefined);
    }
    return false;
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex flex-wrap -mx-3 mb-2">
          <FormField
            name="firstName"
            render={({ field }) => (
              <FormItem className="w-full md:w-1/2 px-3 mb-2">
                <FormLabel>{t('firstName')}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="lastName"
            render={({ field }) => (
              <FormItem className="w-full md:w-1/2 px-3 mb-2">
                <FormLabel>{t('lastName')}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('bio')}</FormLabel>
              <FormControl>
                <RichEditor {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <h2 className="text-xl font-bold mb-2 mt-4">{t('social')}</h2>

        <div className="flex flex-wrap -mx-3 mb-6 mt-4 ">
          <FormField
            name="phone"
            render={({ field }) => (
              <FormItem className="w-full md:w-1/3 px-3 mb-2">
                <FormLabel>{t('phone')}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="telegram"
            render={({ field }) => (
              <FormItem className="w-full md:w-1/3 px-3 mb-2">
                <FormLabel>{t('telegram')}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="website"
            render={({ field }) => (
              <FormItem className="w-full md:w-1/3 px-3 mb-2">
                <FormLabel>{t('website')}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="instagram"
            render={({ field }) => (
              <FormItem className="w-full md:w-1/3 px-3 mb-2">
                <FormLabel>{t('instagram')}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="facebook"
            render={({ field }) => (
              <FormItem className="w-full md:w-1/3 px-3 mb-2">
                <FormLabel>{t('facebook')}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="youtube"
            render={({ field }) => (
              <FormItem className="w-full md:w-1/3 px-3 mb-2">
                <FormLabel>{t('youtube')}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          name="file"
          render={({ field }) => (
            <FormItem className="w-full md:w-1/3 mb-8">
              <FormLabel>{t('imageLabel')}</FormLabel>
              <FormControl>
                <ImageDropzone
                  {...field}
                  handleOnDrop={handleOnDrop}
                  resetFileInput={resetFileInput}
                  file={field.value}
                  id="file"
                  t={t}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormError message={error || undefined} />
        <FormSuccess message={success || undefined} />

        <Button className="mt-4" type="submit" disabled={isPending}>
          {t('save')}
        </Button>
      </form>
    </Form>
  );
};
