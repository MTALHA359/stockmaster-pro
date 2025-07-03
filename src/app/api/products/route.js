import { NextResponse } from 'next/server';
import connectToDB from '@/lib/mongodb';
import Product from '@/app/models/Product';

// CREATE new product
export async function POST(request) {
  try {
    const body = await request.json();
    const { name, sku, stock, purchasePrice, salePrice, category, barcode } = body;

    if (!name || !sku || !stock || !salePrice) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await connectToDB();

    // Check if SKU exists
    const existing = await Product.findOne({ sku });
    if (existing) {
      return NextResponse.json({ error: "SKU already exists" }, { status: 409 });
    }

    const newProduct = new Product({ name, sku, stock, purchasePrice, salePrice, category, barcode });
    await newProduct.save();

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error("❌ Error in POST /api/products:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// GET all products
export async function GET() {
  try {
    await connectToDB();
    const products = await Product.find({}).sort({ createdAt: -1 });
    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.error("❌ Error in GET /api/products:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

