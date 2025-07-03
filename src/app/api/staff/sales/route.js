import { connectDB } from "@/lib/db";
import Sale from "@/app/models/Sale";

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();
    // Validate required fields in the body here, for example:
    if (!body.product || !body.quantity || !body.price) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400 }
      );
    }

    const newSale = new Sale({
      product: body.product,
      quantity: body.quantity,
      price: body.price,
      date: new Date(),
      // other fields...
    });

    const savedSale = await newSale.save();

    return new Response(JSON.stringify(savedSale), { status: 201 });
  } catch (error) {
    console.error("Error in /api/staff/sales POST:", error);
    return new Response(
      JSON.stringify({
        error: "Internal Server Error",
        details: error.message,
      }),
      { status: 500 }
    );
  }
}
