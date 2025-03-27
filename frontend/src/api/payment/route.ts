import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const {
      transaction_id,
      status,
      amount,
      email,
      bookingStore, // pass this from frontend in the request
    } = data;

    // Save payment to Strapi
    const paymentResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_TOKEN}`,
      },
      body: JSON.stringify({
        data: {
          transaction_id,
          status,
          amount,
          email,
        },
      }),
    });

    const paymentData = await paymentResponse.json();
    const paymentId = paymentData?.data?.id;

    // Update booking with payment info and bookingStore data
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/boookings?/${bookingStore.bookingId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_TOKEN}`,
      },
      body: JSON.stringify({
        data: {
          checkin: bookingStore.checkIn,
          checkout: bookingStore.checkOut,
          customer: bookingStore.customerId || null,
          payment: paymentId || null,
          food_item: bookingStore.foodItemId || null,
          room: bookingStore.roomId,
          restaurant: bookingStore.restaurantId || null,
          bar_and_club: bookingStore.barAndClubId || null,
        },
      }),
    });

    return NextResponse.json({ message: "Payment and booking update saved." });
  } catch (error) {
    console.error("Error in payment route:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
