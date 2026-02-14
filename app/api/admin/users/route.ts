import { NextResponse } from "next/server";
import { deleteUserAction } from "@/features/admin/users/actions/user";

export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const { userId, email } = body || {};

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    const result = await deleteUserAction(userId, email);
    if (result?.error) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("/api/admin/users DELETE error", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
