"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Card, CardContent } from "@/shared/ui/card";
import Image from "next/image";
import { toast } from "sonner";

type Poster = {
  id: string;
  title: string;
  description: string | null;
  price: number;
  category: string | null;
  imageUrl: string;
  fileUrl: string;
};

type ProductFormProps = {
  poster?: Poster;
  isEdit?: boolean;
};

export function ProductForm({ poster, isEdit = false }: ProductFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(
    poster?.imageUrl || null
  );

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      
      const priceValue = formData.get("priceInDollars") as string;
      const priceInCents = Math.round(parseFloat(priceValue) * 100);
      formData.set("price", priceInCents.toString());
      formData.delete("priceInDollars");

      const url = isEdit
        ? `/api/admin/products/${poster?.id}`
        : "/api/admin/products";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save product");
      }

      toast.success(
        isEdit
          ? "Product updated successfully!"
          : "Product created successfully!"
      );
      
      router.push("/admin/products");
      router.refresh();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardContent className="pt-6 space-y-6">
          {error && (
            <div className="bg-destructive/10 border border-destructive/50 text-destructive px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              name="title"
              defaultValue={poster?.title}
              required
              placeholder="Starry Night"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              name="description"
              defaultValue={poster?.description || ""}
              className="w-full min-h-32 px-3 py-2 border bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="A beautiful poster of..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="priceInDollars">Price (USD) *</Label>
              <Input
                id="priceInDollars"
                name="priceInDollars"
                type="number"
                step="0.01"
                min="0"
                defaultValue={poster ? (poster.price / 100).toFixed(2) : ""}
                required
                placeholder="19.99"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                name="category"
                defaultValue={poster?.category || ""}
                placeholder="Classic Art"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">
              Product Image * {isEdit && "(leave empty to keep current)"}
            </Label>
            <Input
              id="image"
              name="image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              required={!isEdit}
            />
            {imagePreview && (
              <div className="mt-4 relative w-48 h-48 rounded-lg overflow-hidden border">
                <Image
                  src={imagePreview}
                  alt="Preview"
                  fill
                  className="object-cover"
                />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="file">
              Downloadable File * {isEdit && "(leave empty to keep current)"}
            </Label>
            <Input
              id="file"
              name="file"
              type="file"
              required={!isEdit}
            />
            <p className="text-sm text-muted-foreground">
              High-resolution version for customer download
            </p>
          </div>

          <div className="flex gap-4 pt-4 ">
            <Button className="hover:bg-neutral-900 active:scale-95 group" type="submit" disabled={isLoading}>
              {isLoading
                ? "Saving..."
                : isEdit
                ? "Update Product"
                : "Create Product"}
            </Button>
            <Button
              className="hover:bg-neutral-900 active:scale-95 group"
              type="button"
              onClick={() => router.push("/admin/products")}
            >
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
