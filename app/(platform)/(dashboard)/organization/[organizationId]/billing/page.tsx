import { checkSubcription } from "@/lib/subscription"
import Info from "../_components/info";
import { Separator } from "@/components/ui/separator";
import { SubscriptionButton } from "../_components/subscription-button";

async function BillingPage () {
    const isPro = await checkSubcription();

    return (
        <div className="w-full">
            <Info isPro={isPro} />
            <Separator className="my-2"/>
            <SubscriptionButton isPro={isPro} />
        </div>
    )
}

export default BillingPage;