import { Separator } from "@/components/ui/separator";
import Info from "../_components/info";
import { ActivityList } from "./_components/activitylist";
import { Suspense } from "react";
import { checkSubcription } from "@/lib/subscription";

export default async function ActivityPage() {
    const isPro = await checkSubcription();

    return (
        <div className="w-full">
            <Info isPro={isPro} />
            <Separator className="my-2"/>
            <Suspense fallback={<ActivityList.Skeleton />}>
                <ActivityList />
            </Suspense>
        </div>
    )
}