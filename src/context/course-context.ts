import {createContext} from 'react';



export const CourseContext = createContext<{
    courseTitle: string;
    setCourseTitle: (title: string) => void;
}>({
    courseTitle: "",
    setCourseTitle: () => {}
});
