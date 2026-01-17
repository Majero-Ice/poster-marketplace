export interface Poster {
  id: string;
  title: string;
  description?: string;
  price: number;
  imageUrl: string;
  fileUrl: string;
  category?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
