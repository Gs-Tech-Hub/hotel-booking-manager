// app/api/auth/logout/route.ts
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const options = {
    path: "/",
    secure: true,
    sameSite: "strict" as const,
  };

  (await cookies()).delete("jwt");
  (await cookies()).delete("auth");
  (await cookies()).delete("userRole");
  (await cookies()).delete("userName");
  (await cookies()).delete("userEmail");

  return NextResponse.json({ message: "Logged out" });
}
