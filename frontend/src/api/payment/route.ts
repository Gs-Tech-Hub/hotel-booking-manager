import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
const PAYSTACK_VERIFY_URL = "https://api.paystack.co/transaction/verify/";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const reference = searchParams.get("reference");

    if (!reference) {
      return NextResponse.json({ error: "Reference is required" }, { status: 400 });
    }

    // Call Paystack API to verify payment
    const response = await axios.get(`${PAYSTACK_VERIFY_URL}${reference}`, {
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
      },
    });

    const transactionData = response.data.data;

    if (transactionData.status === "success") {
      // Generate Booking ID (you can save this to a database)
      const bookingId = `BOOKING_${transactionData.reference}`;

      return NextResponse.json({
        status: "success",
        bookingId,
        reference: transactionData.reference,
        email: transactionData.customer.email,
        amount: transactionData.amount,
        paymentMethod: transactionData.channel,
        transactionDate: transactionData.transaction_date,
      });
    }

    return NextResponse.json({ error: "Payment verification failed" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.response?.data || "Payment verification failed" }, { status: 500 });
  }
}
