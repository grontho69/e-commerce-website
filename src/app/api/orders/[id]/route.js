import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { auth } from "@/lib/auth";
import { ObjectId } from "mongodb";

export async function GET(req, { params }) {
  try {
    const { id } = await params;
    const db = await getDb();
    const session = await auth();

    if (!session) {
      return NextResponse.json({ message: "Unauthorized: Please log in." }, { status: 401 });
    }
    
    const order = await db.collection("orders").findOne({ _id: new ObjectId(id) });
    
    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    if (session.user.role !== "admin" && order.userEmail !== session.user.email) {
      return NextResponse.json({ message: "Forbidden: You do not own this order." }, { status: 403 });
    }

    return NextResponse.json(order);
  } catch (error) {
    return NextResponse.json({ message: "Failed to fetch order", debug: error.message }, { status: 500 });
  }
}
