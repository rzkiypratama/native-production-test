export interface Category {
  id: number;
  name: string;
  image: string;
  creationAt?: string;
  updatedAt?: string;
}

export interface Product {
  id: number;
  title: string;
  price: number;
  description?: string;
  images?: string[];
  creationAt?: string;
  updatedAt?: string;
  category?: Category;
}


  export type EditableCellProps = {
    title: React.ReactNode;
    editable: boolean;
    children: React.ReactNode;
    dataIndex: keyof Product;
    record: Product;
    inputType: 'number' | 'text';
    index: number;
    editing: boolean;
  };