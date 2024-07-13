"use client"; 

import { Button } from "@/components/ui/button";
import { ListWrapper } from "./list-wrapper";
import { Plus, X } from "lucide-react";
import { ElementRef, useRef, useState } from "react";
import { useEventListener, useOnClickOutside } from "usehooks-ts";
import { FormInput } from "@/components/form/form-input";
import { useParams, useRouter } from "next/navigation";
import { FormSubmit } from "@/components/form/form-submit";
import { useAction } from "@/hooks/use-action";
import { createList } from "@/actions/create-list";
import { toast } from "sonner";

export function ListForm() {
    const router = useRouter();
    const [isEditing , setIsEditing] = useState<boolean>(false);
    const formRef = useRef<ElementRef<"form">>(null);
    const inputRef = useRef<ElementRef<"input">>(null);
    const params = useParams();

    const enableEditting = () => {
        setIsEditing(true);
        setTimeout(() => {
            inputRef.current?.focus();
        });
    };

    const disableEditting = () => {
        setIsEditing(false);
    }

    const { execute , fieldErrors} = useAction(createList, {
        onSuccess: (data) => {
            toast.success(`List "${data.title}" created`);
            disableEditting();
            router.refresh();
        },
        onError: (e) => {
            toast.error(e);
        }
    })

    const onSubmit = (formData: FormData) => {
        const title = formData.get("title") as string;
        const boardId = formData.get("boardId") as string;
        execute({
            title ,
            boardId,
        })
    }

    const onKeyDown = (e: KeyboardEvent) => {
        if(e.key === "Escape") {
            disableEditting();
        }
    }

    useEventListener("keydown" , onKeyDown);
    useOnClickOutside(formRef , disableEditting);

    if(isEditing) {
        return(
            <ListWrapper>
                <form
                    action={onSubmit}
                    ref={formRef}
                    className="w-full p-3 rounded-md bg-white space-y-4 shadow-md"
                >
                    <FormInput 
                        ref={inputRef}
                        id="title"
                        errors={fieldErrors}
                        className="text-sm px-2 py-1 h-7 font-medium border-transparent hover:border-input focus:border-input transition"
                        placeholder="Enter list title"
                    />
                    <input
                        className="hidden"
                        value={params.boardId}
                        name="boardId"
                    />
                    <div className="flex items-center gap-x-1">
                        <FormSubmit>
                            Add list
                        </FormSubmit>
                        <Button
                            onClick={disableEditting}
                            size="sm"
                            variant="ghost"
                        >
                            <X className="h-5 w-5" />
                        </Button>
                    </div>
                </form>
            </ListWrapper>
        )
    }

    return (
        <ListWrapper>
            <Button
                onClick={enableEditting}
                className="text-black w-full h-full rounded-md bg-white/80 hover:bg-white/50 transition p-3 flex items-center font-medium text-sm justify-start"
            >
                <Plus className="h-4 w-4 mr-2"/> Add a list
            </Button>
        </ListWrapper>
    )
}