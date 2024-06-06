'use client'
import Image from 'next/image';
import { CourseWithImage } from '@/lib/types/course';
import { Badge } from '@/components/ui/badge';
import { useTranslations } from 'next-intl';
import { Rating } from '@/components/custom-ui/rating';
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
        <div className="h-full flex-col shadow-[rgba(17,_17,_26,_0.1)_0px_0px_16px] rounded-lg relative border border-transparent hover:shadow-[rgba(7,_65,_210,_0.15)_0px_9px_30px] hover:border-[rgba(7,_65,_210,_0.15)] transition-all">
          <a href={`courses/${course.id}/`} className="absolute left-0 top-0 w-full h-full z-10"></a>
          <div className="relative h-[180px] shadow-[rgba(17,_17,_26,_0.1)_0px_0px_16px] rounded-t-lg">
            <Image src={course.image!.url} alt={course.title}
                   fill
                   sizes="(max-width: 640px) 100vw,
                          (max-width: 768px) 50vw,
                          (max-width: 1024px) 33vw,
                          (max-width: 1280px) 25vw,
                          (max-width: 1536px) 20vw,
                          20vw"
                   style={{objectFit:"cover"}}
                   className="shadow-[rgba(17,_17,_26,_0.1)_0px_0px_16px]
                   rounded-t-lg"
            />
            {/*<Badge className={`${colorVariants[level!]} absolute top-3 left-3`}>{levelText}</Badge>*/}
          </div>

          <div className="p-4">
            <Rating
              rating={4.2}
              totalStars={5}
              size={16}
              variant="yellow"
              className="h-1"
              showText={true}
              disabled={true}
            />
            <h2 className="font-semibold text-sm mt-4 line-clamp-2">{course.title}</h2>

            <div className="text-sm font-light text-gray-400 mt-4">{course.creator.firstName} {course.creator.lastName}</div>


          </div>

        </div>
    )
}

export default CourseCatalogItem;