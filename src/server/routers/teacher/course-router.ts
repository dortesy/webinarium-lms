import {router, teacherProcedure} from "@/server/trpc";
import {CreateCourseSchema} from "@/schemas/courses/create-course";
import {db} from "@/lib/db";
import slugify from "slugify";

export const CourseRouter = router({
    createCourse: teacherProcedure.input(CreateCourseSchema).mutation(async ({ctx, input}) => {
        const { title } = input;
        const slug = slugify(title, {lower: true});


        const existingCourse = await db.course.findFirst({
            where: {
                slug: slug
            }
        });

        if (existingCourse) {
            return {error: 'Курс с таким названием уже существует'}
        }

        const course = await db.course.create({
            data: {
                title: title,
                slug: slug,
                creator: { connect: { id: ctx.session.user.id } }
            }
        });

        return {success: 'Курс создан', courseId: course.id}
    })
})