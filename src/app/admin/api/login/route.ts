import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { password } = await req.json();

  if (password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set("auth", process.env.AUTH_SECRET!, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });
  return response;
}
