import { ProductForm } from "@/features/admin/product-form";

export default function NewProductPage() {
  return (
    <div className="p-8">
      <div className="mb-8 max-w-5xl">
        <h1 className="text-3xl font-bold">Add New Product</h1>
        <p className="text-muted-foreground mt-2">Create a new poster for your marketplace</p>
      </div>

      <div className="max-w-5xl">
        <ProductForm />
      </div>
    </div>
  );
}
