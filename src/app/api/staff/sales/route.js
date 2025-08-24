import { connectDB } from "@/lib/mongodb";
import Sale from "@/app/models/Sale";
export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();

    // Validate required fields
    const { productName, quantity, price, staffName } = body;
    if (!productName || !quantity || !price || !staffName) {
      return new Response(
        JSON.stringify({ error: "All fields are required" }),
        { status: 400 }
      );
    }

    const newSale = new Sale({ productName, quantity, price, staffName });
    await newSale.save();

    return new Response(JSON.stringify(newSale), { status: 201 });
  } catch (error) {
    console.error("❌ Error in POST /api/staff/sales:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}

export async function GET() {
  try {
    await connectDB();
    const sales = await Sale.find().sort({ createdAt: -1 });
    return new Response(JSON.stringify(sales), { status: 200 });
  } catch (error) {
    console.error("❌ Error in GET /api/staff/sales:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
