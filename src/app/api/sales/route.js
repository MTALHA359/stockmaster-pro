import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Product from "@/app/models/Product";
import Sale from "@/app/models/Sale";

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

    // Save Sale
    const newSale = new Sale({
      productId,
      sku,
      quantity,
      salePrice
    });
    await newSale.save();

    // Update stock
    product.stock -= quantity;
    await product.save();

    return NextResponse.json({ success: true, sale: newSale }, { status: 201 });
  } catch (error) {
    console.error("Sale API Error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
