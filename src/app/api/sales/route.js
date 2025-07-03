import { connectDB } from "@/lib/db";
import Sale from "@/app/models/Sale";
export async function GET() {
  await connectDB();

  try {
    const sales = await Sale.find({}).sort({ date: -1 }).lean();

    // Calculate top-selling products by total quantity sold
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

    return new Response(
      JSON.stringify({
        sales,
        topProducts,
        totalSalesCount,
        totalRevenue,
        totalQuantitySold,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
