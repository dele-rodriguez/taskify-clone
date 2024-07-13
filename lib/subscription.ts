import {auth} from "@clerk/nextjs/server";

import {db} from "@/lib/db";

const DAY_IN_MS = 86_400_000;

export const checkSubcription = async () => {
    const {orgId} = auth();

    if(!orgId) {
        return false;
    }

    const orgsubcription = await db.orgSubscription.findUnique({
        where: {
            orgId ,
        },
        select: {
            paystackCurrentPeriodEnd: true,
            paystackCustomerId: true,
            paystackPlanId: true,
            paystackSubscriptionId: true,
            paystackCustomerCode: true,
        },
    });

    if(!orgsubcription) {
        return false;
    }

    const isValid = orgsubcription.paystackCustomerId && orgsubcription.paystackCurrentPeriodEnd?.getTime()! + DAY_IN_MS > Date.now()

    return !!isValid;
};