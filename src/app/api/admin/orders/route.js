import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { auth } from "@/lib/auth";

export async function GET(req) {
  try {
    const session = await auth();
    
    // Security check: must be admin
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    
    const db = await getDb();
    let query = {};
    if (status && status !== "all") {
      query.status = status;
    }

    const orders = await db.collection("orders")
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();
      
    return NextResponse.json(orders);
  } catch (error) {
    console.error("Admin fetch orders error:", error);
    return NextResponse.json({ message: "Failed to fetch orders" }, { status: 500 });
  }
}
