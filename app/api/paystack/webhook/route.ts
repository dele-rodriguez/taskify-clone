import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { db } from '@/lib/db';
import axios from 'axios';

// Function to verify Paystack signature
const verifyPaystackSignature = (req: NextRequest, secret: string, rawBody: string): boolean => {
  const hash = crypto.createHmac('sha512', secret).update(rawBody).digest('hex');
  return hash === req.headers.get('x-paystack-signature');
};

// POST handler for the webhook
export async function POST(req: NextRequest) {
  let latestSubscription;
  // Read the raw body
  let rawBody: string;
  try {
    rawBody = await req.text();
  } catch (err) {
    console.error('Error reading raw body:', err);
    return NextResponse.json({ error: 'Unable to read request body' }, { status: 400 });
  }

  // Verify Paystack signature
  const secret = process.env.PAYSTACK_TEST_SECRET_KEY as string;
  if (!verifyPaystackSignature(req, secret, rawBody)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  // get the event
  const event = JSON.parse(rawBody);
  const paymentData = event.data;
  // console.log(event);

  const orgId = event?.data.metadata.organizationId
  if(!orgId) {
    console.log("organization Id is missing");
    return new NextResponse('organizationId is required' , {status: 400});
  }

  try {
    const response = await fetch('https://api.paystack.co/subscription', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${secret}`,
        'Content-Type': 'application/json',
      },
    });

    const subscriptionList = await response.json();
    if (!subscriptionList.status) {
      console.error('Error fetching subscription list:', subscriptionList.message);
      return NextResponse.json({ error: subscriptionList.message }, { status: 500 });
    }

    const customerSubscriptions = subscriptionList.data.filter(
      (sub: any) => sub.customer.customer_code === paymentData.customer.customer_code
    );
    if (customerSubscriptions.length === 0) {
      console.error('No subscriptions found for the customer');
      return NextResponse.json({ error: 'No subscriptions found for the customer' }, { status: 404 });
    }
    latestSubscription = customerSubscriptions[0]; // Assuming we take the first matching subscription
  } catch (e) {
    console.error('Error fetching subscription details:', e);
  }

  // console.log(latestSubscription);

  if(event.event === 'subscription.create') {
    // console.log("Subscription created");
    // console.log(paymentData);
    try{
      await db.orgSubscription.create({
        data:{
          orgId: paymentData.metadata.organizationId,
          paystackCustomerId: paymentData.customer.id,
          paystackCustomerCode: paymentData.customer.customer_code,
          paystackSubscriptionId: paymentData.subscription_code,
          paystackPlanId: paymentData.plan.id,
          paystackCurrentPeriodEnd: new Date(paymentData.next_payment_date),
          invoiceLimit: paymentData.invoice_limit,
        }
      })
    } catch(e) {
      console.log(e);
    }
  } else if(event.event === 'charge.success') {
    // console.log(paymentData);
    const userSubscription = await db.orgSubscription.findUnique({
        where: {orgId},
    })
    if(userSubscription) {
        // console.log('user is already subscribed');
        await db.orgSubscription.update({
          where: {orgId},
          data: {
            paystackCurrentPeriodEnd: latestSubscription.next_payment_date,
            invoiceLimit: latestSubscription.invoice_limit
          }
        })
    } else {
        await db.orgSubscription.create({
          data: {
            orgId: paymentData.metadata.organizationId,
            paystackCustomerId: paymentData.customer.id,
            paystackCustomerCode: latestSubscription.customer.customer_code,
            paystackSubscriptionId: latestSubscription.subscription_code,
            paystackPlanId: latestSubscription.plan.id,
            paystackCurrentPeriodEnd: new Date(latestSubscription.next_payment_date),
            invoiceLimit: latestSubscription.invoice_limit
          }
        });
    }
    // console.log('Subscription data stored successfully');
  } else if (event.event === 'invoice.update') {
    await db.orgSubscription.update({
      where: {
        paystackSubscriptionId: paymentData.customer.id,
      },
      data: {
        paystackPlanId: paymentData.plan.id,
        paystackCurrentPeriodEnd: new Date(paymentData.subscription.next_payment_date),
      }
    })
  }

  // Respond with a 200 OK status
  return NextResponse.json({ message: 'Webhook received' }, { status: 200 });
}

// New configuration for disabling body parsing by Next.js
// export const routeSegmentConfig = {
//   api: {
//     bodyParser: false,
//   }, 
// };
// I don't Know why the push did not work