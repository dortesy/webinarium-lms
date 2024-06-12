export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  TEACHER: {
    PROFILE: '/dashboard/teacher/profile',
    COURSES: '/dashboard/teacher/courses',
    ADD_COURSE: '/dashboard/teacher/courses/add',
    SETTINGS: '/dashboard/teacher/settings',
    NOTIFICATIONS: '/dashboard/teacher/notifications',
    HELP: '/dashboard/teacher/help',
    COURSE: {
      DETAILS: (courseId: string | undefined) =>
        `/dashboard/teacher/courses/${courseId}/details`,
      PRICING: (courseId: string | undefined) =>
        `/dashboard/teacher/courses/${courseId}/pricing`,
      OUTLINE: (courseId: string | undefined) =>
        `/dashboard/teacher/courses/${courseId}/outline`,
      GOALS: (courseId: string | undefined) =>
        `/dashboard/teacher/courses/${courseId}/goals`,
    },
  },
};
