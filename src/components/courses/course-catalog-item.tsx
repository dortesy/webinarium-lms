'use client'
import Image from 'next/image';
import { CourseWithImage } from '@/lib/types/course';
import { Badge } from '@/components/ui/badge';
import { useTranslations } from 'next-intl';
interface CourseCatalogItemProps {
  course: CourseWithImage
}

const CourseCatalogItem = ({course}: CourseCatalogItemProps) => {
    const t = useTranslations('ENUM');
    const level = course.level;
    const levelText = t(`CourseLevel.${level!}`);

    const colorVariants = {
        BEGINNER: 'bg-green-800',
        INTERMEDIATE: 'bg-orange-700',
        ADVANCED: 'bg-red-600',
    }
    return (
        <div className="h-full bg-white flex-col shadow-[rgba(17,_17,_26,_0.1)_0px_0px_16px] rounded-lg">
          <div className="relative h-[180px] shadow-[rgba(17,_17,_26,_0.1)_0px_0px_16px] rounded-t-lg">
            <Image src={course.image!.url} alt={course.title}   fill
                   style={{objectFit:"cover"}} className="shadow-[rgba(17,_17,_26,_0.1)_0px_0px_16px] rounded-t-lg"
            />
          </div>

          <div className="p-4">
            <Badge className={colorVariants[level!]}>{levelText}</Badge>
            <h2 className="font-semibold text-sm mt-4">{course.title}</h2>
          </div>
        </div>
    )
}

export default CourseCatalogItem;