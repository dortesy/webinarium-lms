import { router, teacherProcedure } from "@/server/trpc";
import { CreateCourseSchema } from "@/schemas/courses/course.schema";
import { db } from "@/lib/db";
import slugify from "slugify";
import { TRPCError } from "@trpc/server";
import * as z from "zod";
export const CourseRouter = router({
    createCourse: teacherProcedure
        .input(CreateCourseSchema)
        .mutation(async ({ ctx, input }) => {
            const { title } = input;

            if (!title) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Course title is required",
                });
            }

            const slug = slugify(title, { lower: true });

            const existingCourse = await db.course.findFirst({
                where: {
                    slug: slug,
                    creatorId: ctx.session.user.id,
                },
            });

            if (existingCourse) {
                return {error: 'Курс с таким названием уже существует'};
            }

            try {
                const course = await db.course.create({
                    data: {
                        title: title.trim(),
                        slug: slug,
                        creator: { connect: { id: ctx.session.user.id } },
                        status: 'DRAFT',
                    },
                });

                return {success: 'Курс создан', courseId: course.id};
            } catch (error) {
                console.error("Error creating course:", error);
                return {error: 'Произошла ошибка при создании курса'};
            }
        }),

    getCourseById: teacherProcedure.input(z.object({ courseId: z.string().min(1) })).query(async ({ ctx, input }) => {

        const { courseId } = input;

        if (!courseId) {
            throw new TRPCError({
                code: "BAD_REQUEST",
                message: "Курс не найден",
            });
        }

        const course = await db.course.findUnique({
            where: {
                id: courseId,
                creatorId: ctx.session.user.id
            },
        });

        if (!course) {
            throw new TRPCError({
                code: "NOT_FOUND",
                message: "У вас нет доступа к этому курсу",
            });
        }


        return course;
    }),
});