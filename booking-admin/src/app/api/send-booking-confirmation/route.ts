import { NextRequest, NextResponse } from "next/server";
import { sendResendEmail } from "@/utils/emailUtil/sendEmail";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const email = formData.get("email") as string;
  const subject = formData.get("subject") as string;
  const pdfFile = formData.get("pdf") as File;

  if (!email || !pdfFile) {
    return NextResponse.json({ error: "Missing email or PDF" }, { status: 400 });
  }

  // Read PDF as base64
  const arrayBuffer = await pdfFile.arrayBuffer();
  const pdfBase64 = Buffer.from(arrayBuffer).toString("base64");

  const html = `<p>Thank you for your booking at FMMM1 Hotel. Please find your booking confirmation attached.</p>`;

  try {
    await sendResendEmail({
      to: email,
      subject,
      html,
      attachments: [
        {
          filename: pdfFile.name,
          content: pdfBase64,
          contentType: "application/pdf",
        },
      ],
    });
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}
