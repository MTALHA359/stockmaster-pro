import { connectDB } from "@/lib/db";
import Purchase from "@/app/models/Purchase";
export async function GET() {
  await connectDB();

  try {
    const purchases = await Purchase.find({}).sort({ date: -1 });
    return new Response(JSON.stringify(purchases), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
}

export async function POST(req) {
  await connectDB();
  const data = await req.json();

  if (!data.product || !data.quantity || !data.price) {
    return new Response(
      JSON.stringify({ error: "Product, quantity and price are required" }),
      { status: 400 }
    );
  }

  try {
    const purchase = await Purchase.create({
      product: data.product,
      quantity: Number(data.quantity),
      price: Number(data.price),
      shopName: data.shopName || "",
      address: data.address || "",
      contact: data.contact || "",
      date: data.date ? new Date(data.date) : new Date(),
    });

    return new Response(JSON.stringify(purchase), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
