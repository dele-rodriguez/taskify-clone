import { z } from "zod";
import { Card } from "@prisma/client";
import { ActionState } from "@/lib/create-safe-action";
import { UpdateCardTitle } from "./schema";

export type InputType = z.infer<typeof UpdateCardTitle>;
export type ReturnType = ActionState<InputType, Card>;