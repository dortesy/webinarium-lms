import { Lesson, Media, Section } from "@prisma/client";

export interface LessonWithVideo extends Lesson {
    video: Media | null;
}

export interface SectionWithLessons extends Section {
    lessons: LessonWithVideo[];
}

