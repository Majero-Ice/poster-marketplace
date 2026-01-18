import { ProductForm } from "@/features/admin/product-form";

export default function NewProductPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Add New Product</h1>
        <p className="text-muted-foreground mt-2">Create a new poster for your marketplace</p>
      </div>

      <div className="max-w-3xl">
        <ProductForm />
      </div>
    </div>
  );
}
