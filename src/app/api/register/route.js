import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    const db = await getDb();
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    const existingUser = await db.collection("users").findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: "User already exists" }, { status: 400 });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    const result = await db.collection("users").insertOne({
      name,
      email,
      password: hashedPassword,
      role: "user",
      createdAt: new Date(),
    });

    return NextResponse.json({ message: "User registered successfully", id: result.insertedId.toString() }, { status: 201 });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ 
      message: "Internal server error", 
      debug: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined 
    }, { status: 500 });
  }
}
