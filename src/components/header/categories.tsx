import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { getAllCategories } from '@/lib/category/category-helper';
import { ChevronDown } from 'lucide-react';

const Categories = async () => {
  const categories = await getAllCategories()
  console.log(categories)
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="dark:text-white">Категории <ChevronDown /></Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="start">

        <DropdownMenuGroup>
          <DropdownMenuSub>
            {categories.map((category) => (
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>{category.label}</DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    {category.children.map((child) => (
                      <DropdownMenuItem>{child.label}</DropdownMenuItem>
                    ))}
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
            ))}
          </DropdownMenuSub>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}


export default Categories