import dbConnect from '@/lib/dbConnect';
import Sale from '@/models/Sale';

export async function GET() {
  try {
    await dbConnect();
    const sales = await Sale.find({});
    return Response.json(sales);
  } catch (error) {
    return Response.json({ error: 'Failed to fetch sales' }, { status: 500 });
  }
}
