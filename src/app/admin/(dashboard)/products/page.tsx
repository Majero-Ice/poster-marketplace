import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/shared/lib/prisma";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { formatPrice } from "@/shared/lib/formatPrice";
import { Plus, Edit } from "lucide-react";
import { DeleteProductButton } from "@/features/admin/delete-product";

async function getProducts() {
  return await prisma.poster.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export default async function AdminProductsPage() {
  const products = await getProducts();

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Products</h1>
          <p className="text-muted-foreground mt-2">Manage your poster catalog</p>
        </div>
        <Link href="/admin/products/new">
          <Button className="hover:bg-neutral-900 active:scale-95 group">
            <Plus size={20} className="mr-2" />
            Add Product
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Products ({products.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {products.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No products yet. Add your first product to get started.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 text-muted-foreground">Product</th>
                    <th className="text-left py-3 px-4 text-muted-foreground">Category</th>
                    <th className="text-left py-3 px-4 text-muted-foreground">Price</th>
                    <th className="text-left py-3 px-4 text-muted-foreground">Status</th>
                    <th className="text-right py-3 px-4 text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id} className="border-b hover:bg-accent">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-16 h-16 flex-shrink-0 rounded overflow-hidden bg-muted">
                            <Image
                              src={product.imageUrl}
                              alt={product.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="font-medium truncate">{product.title}</div>
                            <div className="text-sm text-muted-foreground line-clamp-2">
                              {product.description}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-sm text-muted-foreground">
                          {product.category || "Uncategorized"}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="font-medium">
                          {formatPrice(product.price)}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        {product.isActive ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-900/30 text-green-400 border border-green-800">
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground border">
                            Inactive
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex justify-end gap-2">
                          <Link href={`/admin/products/${product.id}/edit`}>
                            <Button className="hover:bg-neutral-900 active:scale-95 group" size="sm">
                              <Edit size={16} />
                            </Button>
                          </Link>
                          <DeleteProductButton
                            productId={product.id}
                            productTitle={product.title}
                          />
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
