import * as z from "zod";

export const CreateCourseSchema = z.object({
        title: z.string().min(6, {  message: "Название курса должно быть не менее 6 символов",}),


});