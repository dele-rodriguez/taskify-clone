import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { notFound, redirect } from "next/navigation";
import { BoardNavbar } from "./_components/board-navbar";

export async function generateMetadata({
    params
}: {params: {boardId: string;}}) {
    const { orgId } = auth();

    if(!orgId) {
        return {
            title: "Board"
        };
    }

    const board = await db.board.findUnique({
        where: {
            id: params.boardId,
            orgId
        }
    });

    return {
        title: board?.title || "Board",
    }
}


async function BoardIdLAyout({children , params}: {children: React.ReactNode; params:{boardId: string;}}) {
    const { orgId } = auth();
    
    if(!orgId) {
        redirect("/select-org");
    }

    const board = await db.board.findUnique({
        where: {
            id: params.boardId,
            orgId,
        },
    })

    if(!board) {
        notFound();
    }

    return(
        <div
            style={{backgroundImage: `url(${board.imageFullUrl})`}}
            className="relative h-full bg-no-repeat bg-cover bg-center pt-12"
        >
            <BoardNavbar data={board} />
            <main className="mt-11">
                {children}
            </main>
        </div>
    )
}

export default BoardIdLAyout;