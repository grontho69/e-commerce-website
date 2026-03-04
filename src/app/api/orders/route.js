import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { auth } from "@/lib/auth";

export async function POST(req) {
  try {
    const db = await getDb();
    const session = await auth();
    
    if (!session) {
      return NextResponse.json({ message: "Unauthorized: Please log in to complete purchase." }, { status: 401 });
    }

    const data = await req.json();

    const { paymentMethod, paymentDetails, ...rest } = data;

    const orderStatus = paymentMethod === "cod" ? "placed" : "pending_verification";
    const paymentStatus = paymentMethod === "cod" ? "pending" : "pending_verification";

    const result = await db.collection("orders").insertOne({
      ...rest,
      paymentMethod,
      paymentDetails: paymentMethod === "cod" ? null : paymentDetails,
      userEmail: session.user.email,
      status: orderStatus,
      paymentStatus: paymentStatus,
      createdAt: new Date(),
    });

    return NextResponse.json({ _id: result.insertedId.toString(), ...data }, { status: 201 });
  } catch (error) {
    console.error("Order creation error:", error);
    return NextResponse.json({ message: "Failed to create order" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const db = await getDb();
    const session = await auth();
    
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const orders = await db.collection("orders")
      .find({ userEmail: session.user.email })
      .sort({ createdAt: -1 })
      .toArray();
      
    return NextResponse.json(orders);
  } catch (error) {
    return NextResponse.json({ message: "Failed to fetch orders" }, { status: 500 });
  }
}
