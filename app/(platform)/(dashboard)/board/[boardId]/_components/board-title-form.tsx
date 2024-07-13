"use client";

import { FormInput } from "@/components/form/form-input";
import { Button } from "@/components/ui/button";
import { Board } from "@prisma/client";
import { ElementRef, useRef, useState } from "react";
import { updateBoard} from "@/actions/update-board";
import { useAction } from "@/hooks/use-action";
import { toast } from "sonner";


interface BoardTitleFormProps {
    data: Board;
}

export function BoardTitleForm({data}: BoardTitleFormProps) {
    const {execute} = useAction(updateBoard, {
        onSuccess: (data) => {
            toast.success(`Board "${data.title}" updated!`);
            setTitle(data.title);
            disableEditing();
        },
        onError: (error) => {
            toast.error(error);
        }
    })

    const formRef = useRef<ElementRef<"form">>(null);
    const inputRef = useRef<ElementRef<"input">>(null);
    const [isEditing , setIsEditing] = useState<boolean>();
    const [ title , setTitle ] = useState<string>(data.title);

    const enableEditing = () => {
        setIsEditing(true);
        setTimeout(() => {
            inputRef.current?.focus();
            inputRef.current?.select();
        })
    }

    const disableEditing= () => {
        setIsEditing(false);
    }

    const onSubmit = (formData: FormData) => {
        const title = formData.get("title") as string;
        console.log(`I am submitted : ${title}`);

        execute({
            title,
            id: data.id
        });
    }

    const onBlur = () => {
        formRef.current?.requestSubmit();
    }

    if(isEditing) {
        return (
            <form action={onSubmit} ref={formRef} className="flex items-center gap-x-2">
                <FormInput 
                    ref={inputRef}
                    id="title"
                    onBlur={() => {}}
                    defaultValue={title}
                    className="text-lg font-bold px-[7px] bg-transparent focus-visible:outline-none focus-visible:ring-transparent border-none"
                />
            </form>
        )
    }

    return (
        <Button
            onClick={enableEditing}
            variant="transparent"
            className="font-bold text-lg h-auto w-auto p-1 px-2"
        >
            {title}
        </Button>
    )
}