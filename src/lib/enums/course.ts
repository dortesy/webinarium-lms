export const CourseStatusEnum = ['DRAFT', 'PUBLISHED', 'ARCHIVED'] as const;
export type CourseStatus = typeof CourseStatusEnum[number];
export const CourseLevelEnum = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'] as const;
export type CourseLevel = typeof CourseLevelEnum[number];
export const CourseLanguageEnum = ['RU', 'UZ'] as const;
export type CourseLanguage = typeof CourseLanguageEnum[number];