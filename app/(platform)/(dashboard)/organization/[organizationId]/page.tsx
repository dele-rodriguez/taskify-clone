import { Suspense } from "react";
// import { checkSubcription } from "@/lib/subscription";

async function OrganizationIdPage() {
    // const isPro = await checkSubcription();
    console.log("Page accessed");

    return (
        <div className="w-full mb-20">
            {/* <Info isPro = {isPro} /> */}
            {/* <Separator className="my-4" /> */}
            <div className="px-2 md:px-4">
                {/* <Suspense fallback={<BoardList.Skeleton />}>
                    {/* <BoardList /> */}
                {/* </Suspense> */}
                <div>
                    Organization Page
                </div>
            </div>
        </div>
    )
}

export default OrganizationIdPage;