
import { Lesson, Media, Section } from "@prisma/client";

export interface LessonWithVideo extends Lesson {
    video: Media | null;
    isNew?: boolean;
}

export interface SectionWithLessons extends Section {
    lessons: LessonWithVideo[];
}

