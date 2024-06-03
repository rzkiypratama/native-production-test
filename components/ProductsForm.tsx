import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input, Button, Upload, Spin } from "antd";
import { Product } from "../types/productTypes";
import { productSchema } from "@/schemas/products";

type ProductFormInputs = Omit<Product, "id">;

type ProductFormProps = {
  initialData?: ProductFormInputs;
  onSubmit: (data: ProductFormInputs) => void;
};

const ProductForm: React.FC<ProductFormProps> = ({ initialData, onSubmit }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<ProductFormInputs>({
    resolver: zodResolver(productSchema),
    defaultValues: initialData || {
      title: "",
      price: 0,
      description: "",
      categoryId: 0,
      images: [""],
    },
  });

  const handleFileChange = (index: number, fileList: FileList | null) => {
    if (fileList && fileList[0]) {
      const placeholderURL = "https://via.placeholder.com/";
      const fileURL = URL.createObjectURL(fileList[0]);
      setValue(`images.${index}`, placeholderURL, { shouldValidate: true });
    }
  };

  const onSubmitForm = async (data: ProductFormInputs) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
      reset();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmitForm)}>
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
        <label>Images</label>
        <Controller
          name="images.0"
          control={control}
          render={({ field }) => (
            <div className="pb-3 pt-1">
              <Input {...field} style={{ display: "none" }} />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(0, e.target.files)}
                className="bg-t bg-transparent"
              />
            </div>
          )}
        />
      </div>
      <Button type="primary" htmlType="submit" disabled={isSubmitting}>
        {isSubmitting ? <Spin /> : "Submit"}
      </Button>
    </form>
  );
};

export default ProductForm;
