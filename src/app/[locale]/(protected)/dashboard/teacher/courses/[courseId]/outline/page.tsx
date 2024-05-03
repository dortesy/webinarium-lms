import {useTranslations} from 'next-intl';

export default function CourseOutlinePage() {
  const t = useTranslations('CourseOutlinePage');

  return (
      <div>
          <h2 className="text-4xl font-extrabold dark:text-white">{t('pageTitle')}</h2>
          <p className="my-4 text-sm text-gray-500">{t('pageDescription')}</p>

      </div>
  );
}


// 0. If the course has no sections, show a message - 'No sections added yet', with a button to add a section
// 1. Creating a button that creates section of course
// 2. It would be a dialog (pop up) box with these field - 'Section Name (title)', 'Description', 'Add Section' button
// 3. After section is added, we should re-render the page with the new section and button to add lesson to this section
// 4. If more than two section we need to add drag and drop functionality to reorder the sections
// 5. Add remove section button and re-render the page after section is removed


/**
 *  How page should render
 *  We are checking if the course has sections in it, then we are looping through the section and rendering them
 *  if there are no sections we are showing a message 'No sections added yet' with a button to add a section
 *  if there are sections we are showing a button to add a new section
 *  if there are more than two sections we are showing a drag and drop functionality to reorder the sections
 *  if there are sections we are showing a remove section button
 *  if there are sections we are showing a button to add a lesson to this section
 *  Add a lesson would be a dialog box with these fields:
 *  - Lesson Name (title)
 *  - Description
 *  - Video URL (We need to add functionality to upload video)
 *  - Duration (in seconds, would be calculated automatically)
 *  - Position (We need to add functionality to reorder the lessons)
 *
 *
 * **/


/**
 * Server functions
 * 1. We need to create a function to get all the sections of a course
 * 2. We need to create a function to add a section to a course
 * 3. We need to create a function to remove a section from a course
 * 4. We need to create a function to update a section of a course
 * 5. We need to create a function to get all the lessons of a section
 * 6. We need to create a function to add a lesson to a section
 * 7. We need to create a function to remove a lesson from a section
 * 8. We need to create a function to update a lesson of a section
 * 9. We need to create a function to reorder the sections
 * 10. We need to create a function to reorder the lessons
 *
 * ? We need to implement the drag and drop functionality to reorder the sections and lessons
 * ? Change position type from number to double, if no section or lessons are present, position should be 1
 *
 *
 *
 */