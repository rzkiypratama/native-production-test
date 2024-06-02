export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  categoryId: number;
  images: string[];
  creationAt: string;
  updatedAt: string;
  category: {
    id: number;
    name: string;
  };
}

export type EditableCellProps = {
  title: React.ReactNode;
  editable: boolean;
  children: React.ReactNode;
  dataIndex: keyof Product;
  record: Product;
  inputType: "number" | "text";
  index: number;
  editing: boolean;
};
