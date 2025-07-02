import connectToDB from "@/lib/mongodb";
import Product from "@/app/models/Product";
export async function POST(request) {
  try {
    const body = await request.json();
    const { name, sku, quantity, price } = body;

    if (!name || !sku || !quantity || !price) {
      return new Response(JSON.stringify({ error: "Missing fields" }), {
        status: 400,
      });
    }

    await connectToDB();

    // Check if SKU exists
    const existing = await Product.findOne({ sku });
    if (existing) {
      return new Response(JSON.stringify({ error: "SKU already exists" }), {
        status: 409,
      });
    }

    const product = new Product({ name, sku, quantity, price });
    await product.save();

    return new Response(JSON.stringify(product), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
    });
  }
}

export async function GET() {
  try {
    await connectToDB();
    const products = await Product.find({}).sort({ createdAt: -1 });
    return new Response(JSON.stringify(products), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
    });
  }
}
