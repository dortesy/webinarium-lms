export const ROUTES = {
    HOME: '/',
    TEACHER: {
        MAIN: '/dashboard/teacher',
        PROFILE: '/dashboard/teacher/profile',
        COURSES: '/dashboard/teacher/courses',
        COURSE: {
            DETAILS: (courseId: string | undefined) => `/dashboard/teacher/courses/${courseId}/details`,
            PRICING: (courseId: string | undefined) => `/dashboard/teacher/courses/${courseId}/pricing`,
            OUTLINE: (courseId: string | undefined) => `/dashboard/teacher/courses/${courseId}/outline`,
        }
    }
};