'use server'
import { UserProfileSchema, UserProfileSchemaType } from "@/schemas/profile.schema";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import { getTranslations } from "next-intl/server";
import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';
import { UploadImage, UploadImageToProfile } from "@/lib/media/upload-image";
import { deleteFile } from "@/lib/media/delete-file";

export const EditProfile = async (values: UserProfileSchemaType, formData: FormData) => {
    const t = await getTranslations("ProfileForm");
    const userProfileSchema = UserProfileSchema(t);
    const validatedFields = userProfileSchema.safeParse(values);

    if (!validatedFields.success) {
        return { error: validatedFields.error.errors };
    }

    const { id, firstName, lastName, bio, telegram, phone, website, instagram, facebook, youtube, image } = values;
    const user = await currentUser();

    if (!user || user.id !== id) {
        return { error: "Unauthorized access" };
    }


    const window = new JSDOM('').window;
    const sanitizedBio = DOMPurify(window).sanitize(bio ?? '');


    const validatedImage = formData.get('file') ? userProfileSchema.shape.file.parse(formData.get('file')) as File : null;

    let uploadedImage = null;

    if (validatedImage && validatedImage.size > 0) {
        uploadedImage = await UploadImageToProfile(user.id, validatedImage);
    }
    if (!validatedImage && image) {
        deleteFile(image)
    }


    try {
        const updatedUser = await db.user.update({
            where: { id: id },
            data: {
                firstName,
                lastName,
                image: uploadedImage ?? image,
                bio: sanitizedBio,
                telegram,
                phone,
                website,
                instagram,
                facebook,
                youtube
            }
        });
        return { success: t('success'), user: updatedUser };
    } catch (error) {
        console.error("Error updating profile:", error);
        return { error: t('errors.errorUpdate') };
    }
}