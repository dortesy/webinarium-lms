
import { Course, Lesson, Media, Section } from '@prisma/client';

export interface CourseWithImage extends Course {
    image: Media | null;
}

export interface LessonWithVideo extends Lesson {
    video: Media | null;
    isNew?: boolean;
}

export interface SectionWithLessons extends Section {
    lessons: LessonWithVideo[];
}

