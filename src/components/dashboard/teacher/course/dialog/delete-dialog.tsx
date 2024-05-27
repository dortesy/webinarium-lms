'use client'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import React from "react";

interface DeleteDialogProps {
    dialogTrigger: React.ReactNode | string;
    dialogDescription: string;
    removeData: () => void;
}

const DeleteDialog = ({dialogTrigger, dialogDescription, removeData}: DeleteDialogProps) => {
    console.log('rendered delete dialog')
    return (
        <Dialog>
            <DialogTrigger asChild>{dialogTrigger}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Подтвердите ваше действие</DialogTitle>
                    <DialogDescription className="flex flex-col gap-y-6 ">
                        {dialogDescription}
                    </DialogDescription>

                    <div className="flex gap-x-4  pt-8">
                        <Button variant="destructive" onClick={removeData}>Удалить</Button>
                        <DialogTrigger asChild><Button variant="outline">Отмена</Button></DialogTrigger>
                    </div>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );

}

// <Dialog>
//     <DialogTrigger>Удалить</DialogTrigger>
//     <DialogContent>
//         <DialogHeader>
//             <DialogTitle>Вы уверены, что хотите удалить курс?</DialogTitle>
//             <DialogDescription  className="flex flex-col gap-y-6 ">
//                 Это действие нельзя отменить. Это навсегда удалит ваш курс и все данные курса с наших серверов.
//                 <div className="flex gap-x-2">
//                     <Button variant="destructive" onClick={removeData}>Удалить</Button>
//                     <DialogTrigger asChild><Button variant="outline">Отмена</Button></DialogTrigger>
//                 </div>
//             </DialogDescription>
//         </DialogHeader>
//     </DialogContent>
// </Dialog>

export default DeleteDialog