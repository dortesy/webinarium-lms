import { CategoryData } from '@/lib/types/category';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

interface CategoriesMobileProps {
  categories: CategoryData[];
}

const CategoriesMobile = ({ categories }: CategoriesMobileProps) => {
  return (
    categories.length > 0 && (
      <div>
        {categories.map((category) => (
          <Accordion key={category.value} type={'single'} collapsible>
            <AccordionItem value={category.value} className="text-left">
              <AccordionTrigger className="text-gray-800">
                {category.label}
              </AccordionTrigger>

              <AccordionContent>
                {category.children!.map((child) => (
                  <AccordionItem
                    key={child.value}
                    value={child.value}
                    className="border-b-0 text-left"
                  >
                    <a
                      href="#"
                      className="flex justify-between mb-4 text-gray-500 font-light ml-2"
                    >
                      {child.label}
                    </a>
                  </AccordionItem>
                ))}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        ))}
      </div>
    )
  );
};

export default CategoriesMobile;
