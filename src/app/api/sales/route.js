import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Product from "@/app/models/Product";
import Sale from "@/app/models/Sale";

// ===== GET: Get sales analytics =====
export async function GET() {
  await connectDB();

  try {
    const sales = await Sale.find({}).sort({ date: -1 }).lean();

    // Top-selling products by total quantity sold
    const productMap = {};
    sales.forEach(({ product, quantity }) => {
      if (!productMap[product]) productMap[product] = 0;
      productMap[product] += quantity;
    });

    const topProducts = Object.entries(productMap)
      .map(([product, totalQuantity]) => ({ product, totalQuantity }))
      .sort((a, b) => b.totalQuantity - a.totalQuantity)
      .slice(0, 5);

    const totalSalesCount = sales.length;
    const totalRevenue = sales.reduce(
      (acc, sale) => acc + sale.price * sale.quantity,
      0
    );
    const totalQuantitySold = sales.reduce(
      (acc, sale) => acc + sale.quantity,
      0
    );

    return NextResponse.json(
      {
        sales,
        topProducts,
        totalSalesCount,
        totalRevenue,
        totalQuantitySold,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET /api/sales error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ===== POST: Create new sale and update stock =====
export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();
    const { productId, sku, quantity, salePrice } = body;

    if (!productId || !sku || !quantity || !salePrice) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    if (product.stock < quantity) {
      return NextResponse.json({ error: "Not enough stock" }, { status: 400 });
    }

    const newSale = new Sale({
      productId,
      product: product.name, // to reference name in GET
      sku,
      quantity,
      price: salePrice,
      date: new Date(),
    });

    await newSale.save();

    product.stock -= quantity;
    await product.save();

    return NextResponse.json({ success: true, sale: newSale }, { status: 201 });
  } catch (error) {
    console.error("POST /api/sales error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
