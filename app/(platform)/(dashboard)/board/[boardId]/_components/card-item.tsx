"use client";

import { Card } from "@prisma/client";
import { Draggable } from "@hello-pangea/dnd";
import { useCardModal } from "@/hooks/use-card-modal";

interface CardItemProps {
    data: Card;
    index: number;
}

export function CardItem({data , index}: CardItemProps) {
    const CardModal = useCardModal();

    console.log(data.id);

    return(
        <Draggable draggableId={data.id} index={index}>
            {(provided) => (
                <div
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    ref={provided.innerRef}
                    role="button" 
                    onClick={() => CardModal.onOpen(data.id)}
                    className="truncate border-2 border-transparent hover:border-black py-2 px-3 text-sm bg-white rounded-sm shadow-sm"
                >
                    {data.title}
                </div>
            )}
        </Draggable>
    )
}