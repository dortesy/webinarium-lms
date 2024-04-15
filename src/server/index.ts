import {authRouter} from "./routers/auth.router";
import {helloRouter} from "@/server/routers/hello"
import { router } from "./trpc";
import {CourseRouter} from "@/server/routers/teacher/course.router";

export const appRouter = router({
    hello: helloRouter,
    authRouter: authRouter,
    courseRouter: CourseRouter
});

export type AppRouter = typeof appRouter;