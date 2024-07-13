"use client";

import { Popover , PopoverClose, PopoverContent , PopoverTrigger } from "@/components/ui/popover";
import { useAction } from "@/hooks/use-action";
import { FormInput } from "./form-input";
import { FormSubmit } from "./form-submit";
import { Button } from "../ui/button";
import { X } from "lucide-react";
import { ElementRef, useRef, useState } from "react";
import { createBoard } from "@/actions/create-board";
import { toast } from "sonner";
import { FormPicker } from "./form-picker";
import { useRouter } from "next/navigation";
import { useProModal } from "@/hooks/use-pro-modal";



interface FormPopOverProps {
    children: React.ReactNode;
    side?: "left" | "right" | "top" | "bottom";
    align?: "start" | "center" | "end";
    sideOffset?: number;
}

export function FormPopOver({children , side= "bottom" , align ,sideOffset= 0}: FormPopOverProps) {
    const promodal = useProModal();
    const router = useRouter();
    const closeRef = useRef<ElementRef<"button">>(null);
    const [FormPopOverValue , setFormPopOverValue] = useState("");
    const {execute , fieldErrors} = useAction(createBoard , {
        onSuccess: (data) => {
            setFormPopOverValue("");
            toast.success("Board created");
            closeRef.current?.click();
            router.push(`/board/${data.id}`);
        }, 
        onError: (error) => {
            console.error({error});
            toast.error(error);
            promodal.onOpen();
        }
    });

    const onSubmit = (formData: FormData) => {
        const title = formData.get("title") as string;
        const image = formData.get("image") as string;

        execute({ title , image });
    }

    return (
        <Popover>
            <PopoverTrigger>
                {children}
            </PopoverTrigger>
            <PopoverContent
                align={align}
                sideOffset={sideOffset}
                side={side}
                className="w-80 pt-3"
            >
                <div className="text-sm font-medium text-center text-neutral-600 pb-4">
                    Create Board
                </div>
                <PopoverClose ref={closeRef} asChild>
                    <Button className="h-auto w-auto p-2 absolute top-2 right-2 text-neutral-600"
                        variant="ghost"
                    >
                        <X className="h-4 w-4"/>
                    </Button>
                </PopoverClose>
                <form action={onSubmit}>
                    <div className="space-y-4">
                        <FormPicker 
                            id="image"
                            errors={fieldErrors}
                        />
                        <FormInput
                            id="title"
                            label="Board title"
                            type="text"
                            errors={fieldErrors}
                            value={FormPopOverValue}
                            setValue={setFormPopOverValue}
                        />
                    </div>
                    <FormSubmit className="w-full mt-2">
                        create
                    </FormSubmit>
                </form>
            </PopoverContent>
        </Popover>
    )
}