import { auth } from "@clerk/nextjs/server";
import { currentUser } from "@clerk/nextjs/server";
import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const {orgId , userId} = auth();
    const user = await currentUser();
    const email = user?.emailAddresses[0].emailAddress;


    if(!userId || !orgId ) {
        return new NextResponse("Unauthorized" , {status: 401});
    }

    if(req.method !== "POST") {
        return new NextResponse("Only Post requests are allowed" , {status: 405});
    } 

    try {
        const response = await axios.post(
            "https://api.paystack.co/transaction/initialize" , 
            {
                email: email,
                plan:   process.env.PAYSTACK_PLAN_CODE,
                amount: "200000",
                metadata: {organizationId: orgId},
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.PAYSTACK_TEST_SECRET_KEY}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        if (response.data.status) {
            return NextResponse.json({ checkout_url: response.data.data.authorization_url });
        } else {
            console.log("No response");
            return new NextResponse(`message: ${response.data.message}` , {status: 400})
        }
    }   catch(e) {
        console.error('Error initializing Paystack transaction:', e);
        return new NextResponse("Internal error" , {status: 500});
    }
}