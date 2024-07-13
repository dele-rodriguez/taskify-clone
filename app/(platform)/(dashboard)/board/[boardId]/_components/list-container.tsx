"use client";

import { ListWithCards } from "@/types";
import {DragDropContext , Droppable} from "@hello-pangea/dnd";
import { ListForm } from "./list-form";
import { useEffect, useState } from "react";
import { ListItem } from "./list-item";
import { useAction } from "@/hooks/use-action";
import { updateListOrder } from "@/actions/update-list-order";
import { updateCardOrder } from "@/actions/update-card-order";
import { toast } from "sonner";

interface ListContainerProps {
    data: ListWithCards[];
    boardId: string
}

function reorder<T>(list: T[] , startIndex: number, endIndex: number) {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1)
    result.splice(endIndex , 0 , removed);

    return result;
}

export function ListContainer({data , boardId}: ListContainerProps) {
    const [orderedData , setOrderedData] = useState(data);

    const { execute: executeUpdateListOrder } = useAction(updateListOrder , {
        onSuccess: () => {
            toast.success("List reordered");
        },
        onError: (e) => {
            toast.error(e);
        }
    });

    const { execute: executeUpdateCardOrder } = useAction(updateCardOrder , {
        onSuccess: () => {
            toast.success("Card reordered");
        },
        onError: (e) => {
            toast.error(e);
        }
    });

    useEffect(() => {
        setOrderedData(data);
    } , [data]);

    const onDragEnd = (result: any) => {
        const { destination , source , type} = result

        if(!destination) {
            return;
        }

        // if dropped in the same position?
        if( destination.draggableId === source.draggableId && destination.index === source.index) {
            return;
        }

        // user moves a list
        if (type === "list") {
            const items = reorder(
                orderedData ,
                source.index,
                destination.index,
            ).map((item , i) => ({...item, order: i }));

            setOrderedData(items);

            // TODO: trigger server actions
            executeUpdateListOrder({items , boardId})
        }

        // user moves a card
        if(type === "card") {
            let newOrderedData = [...orderedData];

            //source and destination list
            const sourceList = newOrderedData.find(list => list.id === source.droppableId);
            const destinationList = newOrderedData.find(list => list.id === destination.droppableId);

            if(!sourceList || !destinationList) {
                return;
            }

            // check if cards exists on the source list
            if(!sourceList.cards) {
                sourceList.cards= [];
            }

            // check if card exists on the destination 
            if(!destinationList.cards) {
                destinationList.cards= [];
            }

            // Moving card in the same list
            if(source.droppableId === destination.droppableId) {
                const reorderedCards = reorder(
                    sourceList.cards,
                    source.index,
                    destination.index,
                );

                reorderedCards.forEach((card , i) => {
                    card.order = i;
                });

                sourceList.cards= reorderedCards;

                setOrderedData(newOrderedData);
                // TODO: Trigger server actions
                executeUpdateCardOrder({boardId: boardId , items: reorderedCards });

                // user moves card to another list
            } else {
                // remove card from the source list 
                const [movedCard] = sourceList.cards.splice(source.index , 1);

                // assign the new listId to the moved card
                movedCard.listId = destination.droppableId

                // add card to the destination list
                destinationList.cards.splice(destination.index , 0 , movedCard);

                // update the order of source list after the card has been moved
                sourceList.cards.forEach((card , i) => {
                    card.order = i;
                })

                // update the order of the destination list when the card is being dropped there
                destinationList.cards.forEach((card , i ) => {
                    card.order = i;
                })

                setOrderedData(newOrderedData);
                // TODO: trigger server action
                executeUpdateCardOrder({boardId: boardId , items: destinationList.cards });
            }
        }
    }
    
    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="lists" type="list" direction="horizontal">
                {(provided) => (
                    <ol
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className="flex gap-x-3 h-full" 
                    >
                        {orderedData.map((list , i) => {
                            return(
                                <ListItem 
                                    key={list.id}
                                    index={i}
                                    data={list}
                                />
                            )
                        })}
                        {provided.placeholder}
                        <ListForm />
                        <div  className="flex-shrink-0 w-1"/>
                    </ol>
                )}
            </Droppable>
        </DragDropContext>
    )
}