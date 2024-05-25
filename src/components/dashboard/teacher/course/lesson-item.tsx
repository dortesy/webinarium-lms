import { Lesson } from "@prisma/client";
import LessonDialog from "./dialog/lesson-dialog";
import { FilePenLine, Trash2 } from "lucide-react";
import DeleteDialog from "./dialog/delete-dialog";

interface LessonItemProps {
  lesson: Lesson;
  index: number;
}

const LessonItem = ({ lesson, index }: LessonItemProps) => {
  return (
    <div className="flex justify-between items-center p-4 border-b hover:bg-gray-50 transition duration-200">
      <div className="flex items-center gap-4">
        <div className="text-lg font-bold">{index + 1}</div>
        <div>
          <h3 className="text-sm">{lesson.title}</h3>
          <p className="text-sm text-gray-600">{lesson.description}</p>
        </div>
      </div>
      <div className="flex gap-3">
        <LessonDialog
          dialogTrigger={<FilePenLine className="cursor-pointer" width={16} height={16} strokeWidth={1} />}
          dialogDescription={lesson.description}
          dialogFooterButton="Редактировать урок"
          onSubmit={() => {}}
        />
        <DeleteDialog
          dialogTrigger={<Trash2 className="cursor-pointer"  width={16} height={16} strokeWidth={1} />}
          dialogDescription="Вы уверены, что хотите удалить урок?"
          removeData={() => {}}
        />
      </div>
    </div>
  );
};

LessonItem.displayName = 'LessonItem';

export default LessonItem;