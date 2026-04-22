import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getDb } from "@/lib/firebase-admin";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = getDb();
  const snapshot = await db.collection("urls").orderBy("createdAt", "desc").get();
  const urls = snapshot.docs.map((doc) => ({
    code: doc.id,
    originalUrl: doc.data().originalUrl,
    clicks: doc.data().clicks,
    createdAt: doc.data().createdAt?.toDate?.()?.toISOString() ?? null,
  }));

  return NextResponse.json({ urls });
}
