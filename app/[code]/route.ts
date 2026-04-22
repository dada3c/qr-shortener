import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/firebase-admin";

export const dynamic = "force-dynamic";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;
  const db = getDb();
  const doc = await db.collection("urls").doc(code).get();

  if (!doc.exists) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const { originalUrl } = doc.data() as { originalUrl: string };

  // increment clicks in background
  doc.ref.update({ clicks: (doc.data()?.clicks ?? 0) + 1 });

  return NextResponse.redirect(originalUrl, 301);
}
