"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Card, CardContent } from "@/shared/ui/card";
import Image from "next/image";
import { toast } from "sonner";
import { uploadFileToSupabase } from "@/shared/lib/uploadToSupabase";

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
      const maxSize = 20 * 1024 * 1024;
      if (file.size > maxSize) {
        toast.error("Image must be less than 20MB");
        e.target.value = "";
        return;
      }
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
      
      const imageFile = formData.get("image") as File;
      const posterFile = formData.get("file") as File;
      const maxSize = 20 * 1024 * 1024;

      if (imageFile && imageFile.size > 0 && imageFile.size > maxSize) {
        throw new Error("Image file must be less than 20MB");
      }

      if (posterFile && posterFile.size > 0 && posterFile.size > maxSize) {
        throw new Error("Poster file must be less than 20MB");
      }

      let imageUrl = poster?.imageUrl;
      let fileUrl = poster?.fileUrl;

      if (imageFile && imageFile.size > 0) {
        toast.info("Uploading image...");
        const timestamp = Date.now();
        const title = formData.get("title") as string;
        const slug = title.toLowerCase().replace(/\s+/g, "-");
        const imageExt = imageFile.name.split(".").pop();
        const imagePath = `images/${slug}-${timestamp}.${imageExt}`;
        
        imageUrl = await uploadFileToSupabase(imageFile, "posters", imagePath);
      }

      if (posterFile && posterFile.size > 0) {
        toast.info("Uploading poster file...");
        const timestamp = Date.now();
        const title = formData.get("title") as string;
        const slug = title.toLowerCase().replace(/\s+/g, "-");
        const fileExt = posterFile.name.split(".").pop();
        const filePath = `files/${slug}-${timestamp}.${fileExt}`;
        
        const filePublicUrl = await uploadFileToSupabase(posterFile, "posters", filePath);
        fileUrl = filePath;
      }
      
      const priceValue = formData.get("priceInDollars") as string;
      const priceInCents = Math.round(parseFloat(priceValue) * 100);

      const productData = {
        title: formData.get("title") as string,
        description: formData.get("description") as string,
        price: priceInCents,
        category: formData.get("category") as string,
        imageUrl: imageUrl!,
        fileUrl: fileUrl!,
      };

      const url = isEdit
        ? `/api/admin/products/${poster?.id}`
        : "/api/admin/products";
      const method = isEdit ? "PUT" : "POST";

      toast.info("Saving product...");

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
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
            <p className="text-xs text-muted-foreground">
              Maximum size: 20MB. Recommended: JPG/PNG, 1200x1600px
            </p>
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
            <p className="text-xs text-muted-foreground">
              High-resolution version for customer download. Maximum size: 20MB
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
