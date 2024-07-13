"use client";

import { Button } from "@/components/ui/button";
import { useAction } from "@/hooks/use-action";
import { useProModal } from "@/hooks/use-pro-modal";
import { useState } from "react";
import { toast } from "sonner";

interface SubscriptionButtonProps{
    isPro: boolean;
}

export function SubscriptionButton({isPro}: SubscriptionButtonProps) {
    const [isLoading , setIsLoading] = useState<boolean>(false);
    const proModal = useProModal();
    // const {} = useAction

    const onClick = async () => {
        setIsLoading(true);
        if (isPro) {
            // create function to show them their billing info
            toast.error("You need to show them their billing Info");
        } else {
            proModal.onOpen();
        }
        setIsLoading(false);
    }

    return (
        <Button
            onClick={onClick}
            variant="primary"
            disabled={isLoading}
        >
            {isPro? "Manage subscription" : "Upgrade to pro"}
        </Button>
    )
}