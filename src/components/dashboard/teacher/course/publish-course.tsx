"use client";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

const PublishCourse = () => {
    return ( 
    <div className="flex items-center space-x-2 bg-green-200 p-2 rounded-md">
    <Switch id="publish-course" />
    <Label htmlFor="publish-course" className="text-sm cursor-pointer">Опубликовать курс</Label>
  </div>
  );
};

export default PublishCourse;