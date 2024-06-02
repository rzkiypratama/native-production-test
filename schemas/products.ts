import { z } from 'zod';

export const productSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  price: z.preprocess((val) => Number(val), z.number().positive('Price must be a number')),
  description: z.string().min(1, 'Description is required'),
  categoryId: z.preprocess((val) => Number(val), z.number().positive('Category ID must be a number')),
  images: z.array(z.string().url('Must be a valid URL')).min(1, 'Images are required'),
});