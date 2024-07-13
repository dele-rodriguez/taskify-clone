"use server";

import { auth } from "@clerk/nextjs/server";
import { InputType , ReturnType } from "./types";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { createSafeAction } from "@/lib/create-safe-action";
import { CreateBoard } from "./schema";
import { createAuditLog } from "@/lib/create-audit-logs";
import { ACTION, ENTITY_TYPE } from "@prisma/client";
import { incrementAvailableCount , hasAvailableCount} from "@/lib/org-limit";
import { checkSubcription } from "@/lib/subscription";

const handler = async (data: InputType): Promise<ReturnType> =>{
    const {userId , orgId } = auth();

    if(!userId || !orgId ) {
        return {
            error: "Umauthorized",
        }
    }

    const canCreate =  await hasAvailableCount();
    const isPro = await checkSubcription();

    if(!canCreate && !isPro) {
        return {
            error: "You have reached your limit of free boards. Please upgrade to create more"
        }
    }

    const { title , image } = data;

    const [
        imageId,
        imageThumbUrl,
        imageFullUrl,
        imageLinkHTML,
        imageUserName
    ] = image.split("|");

    if (!imageId || !imageThumbUrl || !imageFullUrl || !imageLinkHTML || !imageUserName ) {
        return {
            error: "Missing fields. Failed to create board."
        }
    }

    let board;

    try {
        board = await db.board.create({
            data: {
                title,
                orgId,
                imageId,
                imageThumbUrl,
                imageFullUrl,
                imageUserName,
                imageLinkHTML
            }
        });

        if(!isPro) {
            await incrementAvailableCount();
        }

        await createAuditLog({
            entityTitle: board.title,
            entityId: board.id ,
            entityType: ENTITY_TYPE.BOARD ,
            action: ACTION.CREATE,
        })

    } catch (error) {
        return {
            error: "Failed to create"
        }
    }

    revalidatePath(`/board/${board.id}`);
    return { data: board };
}

export const createBoard = createSafeAction(CreateBoard , handler);