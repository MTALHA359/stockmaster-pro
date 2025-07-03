import { connectDB } from "@/lib/db";
import Sale from "@/app/models/Sale";
import Product from "@/app/models/Product";

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();

    const { items } = body; // items = [{ productId, quantity, price }, ...]

    if (!items || !Array.isArray(items) || items.length === 0) {
      return new Response(JSON.stringify({ error: "No items to sell" }), {
        status: 400,
      });
    }

    // Validate stock availability for each product
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return new Response(
          JSON.stringify({ error: `Product not found: ${item.productId}` }),
          { status: 400 }
        );
      }
      if (product.stock < item.quantity) {
        return new Response(
          JSON.stringify({ error: `Insufficient stock for ${product.name}` }),
          { status: 400 }
        );
      }
    }

    // Deduct stock for each product
    const bulkOps = items.map((item) => ({
      updateOne: {
        filter: { _id: item.productId },
        update: { $inc: { stock: -item.quantity } },
      },
    }));

    await Product.bulkWrite(bulkOps);

    // Save the sale
    const newSale = new Sale({
      items,
      date: new Date(),
      total: items.reduce((sum, i) => sum + i.price * i.quantity, 0),
      // add managerId or other info if needed
    });

    const savedSale = await newSale.save();

    return new Response(JSON.stringify(savedSale), { status: 201 });
  } catch (error) {
    console.error("Error in /api/manager/sales POST:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}
