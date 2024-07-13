"use client";

import { List } from "@prisma/client";
import { ElementRef, useRef, useState } from "react";
import { useEventListener, useOnClickOutside } from "usehooks-ts";
import { FormInput } from "@/components/form/form-input";
import { useAction } from "@/hooks/use-action";
import { updateList } from "@/actions/update-list";
import { toast } from "sonner";
import { ListOptions } from "./list-options";

interface ListHeaderProps {
    data: List;
    onAddCard: () => void;
}

export function ListHeader({data , onAddCard}: ListHeaderProps) {
    const [title , setTitle] = useState(data.title);
    const [isEditing , setIsEditing] = useState<boolean>(false);
    const formRef = useRef<ElementRef<"form">>(null);
    const inputRef = useRef<ElementRef<"input">>(null);

    const enableEditting = () => {
        setIsEditing(true);
        setTimeout(() => {
            inputRef.current?.focus();
        });
    };

    const disableEditting = () => {
        setIsEditing(false);
    }

    const { execute , fieldErrors } = useAction(updateList , {
        onSuccess: (data) => {
            toast.success(`List renamed to "${data.title}"`);
            setTitle(data.title);
            disableEditting();
        },
        onError: (e) => {
            toast.error(e);
        }
    });

    const handleSubmit = (formData: FormData) => {
        const title = formData.get("title") as string;
        const id = formData.get("id") as string;
        const boardId = formData.get("boardId") as string;

        if(title === data.title) {
            return disableEditting();
        } else {
            execute({title , id , boardId,});
        }
    }

    const onBlur = () => {
        console.log("I got blurred");
        formRef.current?.requestSubmit();
    }

    const onKeyDown = (e: KeyboardEvent) => {
        if(e.key === "Escape") {
            formRef.current?.requestSubmit();
            disableEditting();
        }
    }

    useEventListener("keydown" , onKeyDown);
    useOnClickOutside(formRef , disableEditting);


    return (
        <div className={isEditing ? "py-2" : "pt-2 px-2 text-sm font-semibold flex justify-between items-start gap-x-2" }>
            {isEditing? (
                <form
                    ref={formRef}
                    action={handleSubmit}
                    className=" w-full text-sm px-2.5 py-1 h-7 font-medium"
                >
                    <input hidden id="id" name="id" value={data.id} />
                    <input hidden id="boardId" name="boardId" value={data.boardId} />
                    <FormInput 
                        ref={inputRef}
                        onBlur={onBlur}
                        id="title"
                        errors={fieldErrors}
                        placeholder="Edit list title..."
                        defaultValue={title}
                        className=" text-sm px-[7px] h-7 font-medium border-transparent hover:border-input focus:border-input transition truncate bg-transparent focus:bg-white"
                    />
                    <button type="submit" hidden />
                </form>
            ) : (
                <div onClick={enableEditting} className=" w-full text-sm px-2.5 py-1 h-7 font-medium border-transparent cursor-pointer">
                    {title}
                </div>
            )}
            <ListOptions
                onAddCard={onAddCard}
                data={data}
            />
        </div>
    )
}