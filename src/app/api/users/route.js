import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
// import User from '@/models/User';
import User from '@/app/models/User';

export async function GET() {
  try {
    await dbConnect();
    const users = await User.find();
    return NextResponse.json(users);
  } catch (error) {
    console.error('❌ Error fetching users:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
