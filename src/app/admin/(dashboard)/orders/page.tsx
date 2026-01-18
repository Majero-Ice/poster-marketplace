import { prisma } from "@/shared/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { formatPrice } from "@/shared/lib/formatPrice";
import { Badge } from "@/shared/ui/badge";

async function getOrders() {
  return await prisma.purchase.findMany({
    include: {
      poster: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

export default async function AdminOrdersPage() {
  const orders = await getOrders();

  const totalRevenue = orders.reduce(
    (sum, order) => sum + order.priceAtPurchase * order.quantity,
    0
  );

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Orders</h1>
        <p className="text-muted-foreground mt-2">View all customer purchases</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{orders.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{formatPrice(totalRevenue)}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          {orders.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No orders yet
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 text-muted-foreground">Order ID</th>
                    <th className="text-left py-3 px-4 text-muted-foreground">Product</th>
                    <th className="text-left py-3 px-4 text-muted-foreground">Customer</th>
                    <th className="text-left py-3 px-4 text-muted-foreground">Quantity</th>
                    <th className="text-left py-3 px-4 text-muted-foreground">Amount</th>
                    <th className="text-left py-3 px-4 text-muted-foreground">Status</th>
                    <th className="text-left py-3 px-4 text-muted-foreground">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className="border-b hover:bg-accent">
                      <td className="py-4 px-4">
                        <code className="text-xs bg-muted px-2 py-1 rounded">
                          {order.id.slice(0, 8)}
                        </code>
                      </td>
                      <td className="py-4 px-4">
                        <div className="font-medium">{order.poster.title}</div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-sm text-muted-foreground">{order.customerEmail}</div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-sm text-muted-foreground">{order.quantity}</div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="font-medium">
                          {formatPrice(order.priceAtPurchase * order.quantity)}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        {order.downloadedAt ? (
                          <Badge variant="secondary">Downloaded</Badge>
                        ) : (
                          <Badge>Pending</Badge>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-sm text-muted-foreground">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
