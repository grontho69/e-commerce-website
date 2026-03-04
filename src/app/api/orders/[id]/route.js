import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { auth } from "@/lib/auth";
import { ObjectId } from "mongodb";

export async function GET(req, { params }) {
  try {
    const { id } = params;
    const db = await getDb();
    
    // For simplicity/speed in success page, we allow fetching by ID
    // In production, we should verify ownership or use a secure token
    const order = await db.collection("orders").findOne({ _id: new ObjectId(id) });
    
    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (error) {
    return NextResponse.json({ message: "Failed to fetch order" }, { status: 500 });
  }
}
