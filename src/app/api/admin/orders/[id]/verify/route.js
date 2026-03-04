import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { auth } from "@/lib/auth";
import { ObjectId } from "mongodb";

export async function PATCH(req, { params }) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const { action } = await req.json(); // verify or reject
    const db = await getDb();

    let update = {};
    if (action === "verify") {
      update = {
        $set: {
          paymentStatus: "paid",
          status: "placed",
          verifiedBy: session.user.email,
          verifiedAt: new Date(),
        }
      };
    } else if (action === "reject") {
      update = {
        $set: {
          paymentStatus: "rejected",
          status: "payment_failed",
          verifiedBy: session.user.email,
          verifiedAt: new Date(),
        }
      };
    } else {
      return NextResponse.json({ message: "Invalid action" }, { status: 400 });
    }

    const result = await db.collection("orders").updateOne(
      { _id: new ObjectId(id) },
      update
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ message: `Order successfully ${action}ed` });
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
