
import { Course, Lesson, Media, Section, User } from '@prisma/client';

export interface CourseWithImage extends Course {
    image: Media | null;
    creator: User
}

export interface LessonWithVideo extends Lesson {
    video: Media | null;
    isNew?: boolean;
}

export interface SectionWithLessons extends Section {
    lessons: LessonWithVideo[];
}

