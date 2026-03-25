import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { auth } from "@/lib/auth";
import { ObjectId } from "mongodb";

const DEFAULT_MESSAGES = {
  pending: "Order received and is awaiting confirmation.",
  confirmed: "Order has been confirmed and is ready to be processed.",
  processing: "Your items are being picked and packed in our facility.",
  shipped: "Your order has been shipped and is on its way.",
  out_for_delivery: "Your package is out for delivery today.",
  delivered: "Your order has been successfully delivered.",
};

export async function PATCH(req, { params }) {
  try {
    const session = await auth();

    // Ensure session and Admin Role
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const { status, message } = await req.json();

    if (!status || !Object.keys(DEFAULT_MESSAGES).includes(status)) {
      return NextResponse.json({ message: "Invalid status provided." }, { status: 400 });
    }

    const db = await getDb();
    const timelineEntry = {
      status,
      message: message || DEFAULT_MESSAGES[status],
      timestamp: new Date(),
      isSystem: !message,
    };

    const updateFilter = { _id: new ObjectId(id) };
    const updateActions = {
      $set: {
        status: status,
      },
      $push: {
        timeline: {
          $each: [timelineEntry],
          $position: 0 // Optional: push to front if you want latest first, or push to end. I will push to end, so remove $position.
        }
      }
    };

    const result = await db.collection("orders").updateOne(updateFilter, {
      $set: { status },
      $push: { timeline: timelineEntry }
    });

    if (result.matchedCount === 0) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Order status successfully updated", timelineEntry }, { status: 200 });

  } catch (error) {
    console.error("Admin Order Update Error:", error);
    return NextResponse.json({ message: "Internal server error", debug: error.message }, { status: 500 });
  }
}
