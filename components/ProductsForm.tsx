import React from 'react';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input, Button } from 'antd';
import { Product } from '../types/product';
import { productSchema } from '@/schemas/products';

type ProductFormInputs = Omit<Product, 'id'>;

type ProductFormProps = {
  initialData?: ProductFormInputs;
  onSubmit: (data: ProductFormInputs) => void;
};

const ProductForm: React.FC<ProductFormProps> = ({ initialData, onSubmit }) => {
  const { control, handleSubmit, formState: { errors }, setValue } = useForm<ProductFormInputs>({
    resolver: zodResolver(productSchema),
    defaultValues: initialData || {
      title: '',
      price: 0,
      description: '',
      categoryId: 0,
      images: [''],
    },
  });

  // conditional rendering state for images button
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'images',
  });

  const handleFileChange = (index: number, fileList: FileList | null) => {
    if (fileList && fileList[0]) {
      const placeholderURL = 'https://via.placeholder.com/';
      const fileURL = URL.createObjectURL(fileList[0]);
      // avoid some error when upload a file directly with placeholder URL
      setValue(`images.${index}`, placeholderURL, { shouldValidate: true });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label>Title</label>
        <Controller
          name="title"
          control={control}
          render={({ field }) => <Input {...field} />}
        />
        {errors.title && <p>{errors.title.message}</p>}
      </div>
      <div>
        <label>Price</label>
        <Controller
          name="price"
          control={control}
          render={({ field }) => <Input type="number" {...field} />}
        />
        {errors.price && <p>{errors.price.message}</p>}
      </div>
      <div>
        <label>Description</label>
        <Controller
          name="description"
          control={control}
          render={({ field }) => <Input {...field} />}
        />
        {errors.description && <p>{errors.description.message}</p>}
      </div>
      <div>
        <label>Category ID</label>
        <Controller
          name="categoryId"
          control={control}
          render={({ field }) => <Input type="number" {...field} />}
        />
        {errors.categoryId && <p>{errors.categoryId.message}</p>}
      </div>
      <div>
        {fields.map((field, index) => (
          <div key={field.id}>
            <Controller
              name={`images.${index}`}
              control={control}
              render={({ field }) => (
                <>
                  <Input {...field} style={{ display: 'none' }} />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(index, e.target.files)}
                  />
                </>
              )}
            />
        <Button onClick={() => remove(index)}>Remove</Button>
          </div>
        ))}
        <Button onClick={() => append('')}>Add Image</Button>
      </div>
      <Button type="primary" htmlType="submit">Submit</Button>
    </form>
  );
};

export default ProductForm;
