// src/app/api/staff/sales/route.js
import { connectDB } from "@/lib/db";
import Sale from "@/app/models/Sale";

export async function POST(req) {
  await connectDB();
  const body = await req.json();

  try {
    const newSale = await Sale.create(body);
    return new Response(JSON.stringify(newSale), { status: 201 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
}

export async function GET() {
  await connectDB();

  try {
    const sales = await Sale.find().sort({ date: -1 });
    return new Response(JSON.stringify(sales), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
}
