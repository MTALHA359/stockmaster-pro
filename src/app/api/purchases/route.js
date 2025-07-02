// src/app/api/purchases/route.js
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Purchase from '@/app/models/Purchase';

export async function GET() {
  try {
    await dbConnect();
    const purchases = await Purchase.find();
    return NextResponse.json(purchases);
  } catch (error) {
    console.error('❌ Error fetching purchases:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
