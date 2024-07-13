import { Board } from "@prisma/client";
import { BoardTitleForm } from "./board-title-form";
import { BoardOptions } from "./board-options";

interface BoardNavbarProps {
    data: Board;
}

export async function BoardNavbar({data}: BoardNavbarProps) {
    return (
        <div className="w-full h-12 z-40 bg-black/50 fixed flex items-center px-6 gap-x-4 text-white">
            <BoardTitleForm data={data} />
            <div className="ml-auto">
                <BoardOptions id={data.id} />
            </div>
        </div>
    )
}