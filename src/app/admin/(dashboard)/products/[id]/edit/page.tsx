import { notFound } from "next/navigation";
import { prisma } from "@/shared/lib/prisma";
import { ProductForm } from "@/features/admin/product-form";

async function getProduct(id: string) {
  return await prisma.poster.findUnique({
    where: { id },
  });
}

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    notFound();
  }

  return (
    <div className="p-8">
      <div className="mb-8 max-w-5xl">
        <h1 className="text-3xl font-bold">Edit Product</h1>
        <p className="text-muted-foreground mt-2">Update product information</p>
      </div>

      <div className="max-w-5xl">
        <ProductForm poster={product} isEdit />
      </div>
    </div>
  );
}
