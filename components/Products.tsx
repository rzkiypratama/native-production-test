'use client';

import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Spin } from 'antd';
import { useProductStore } from '../store/useProducts';
import { useCartStore } from '../store/cartStore';
import ProductForm from './ProductsForm';
import { Product } from '../types/product';
import { ShoppingCartOutlined } from '@ant-design/icons';
import Cart from './Cart';

const ProductsComponent: React.FC = () => {
  const { products, fetchProducts, addProduct, isLoading } = useProductStore();
  const { cart, addToCart, initializeCart } = useCartStore();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isCartVisible, setIsCartVisible] = useState(false);

  useEffect(() => {
    fetchProducts();
    initializeCart();
  }, [fetchProducts, initializeCart]);

  // create new product modal button
  const handleCreate = () => {
    setIsModalVisible(true);
  };
  
  const handleModalClose = () => {
    setIsModalVisible(false);
  };

  // cart modal button
  const handleCart = () => {
    setIsCartVisible(true);
  }

  const handleCartClose = () => {
    setIsCartVisible(false);
  }


  const handleFormSubmit = async (data: Omit<Product, 'id'>) => {
    try {
      await addProduct(data);
      setIsModalVisible(false);
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  const handleAddToCart = (product: Product) => {
    addToCart(product);
  };

  // table columns
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: '5%',
      editable: true
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      width: '25%',
      editable: true,
      filters: products.map((product) => ({
        text: product.title,
        value: product.title,
      })),
      onFilter: (value: any, record: { title: string | any[]; }) => record.title.includes(value),
      filterSearch: true,
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      width: '10%',
      sorter: (a: { price: number; }, b: { price: number; }) => a.price - b.price,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      width: '30%',
    },
    {
      title: 'Images',
      dataIndex: 'images',
      key: 'images',
      width: '20%',
      render: (images: string[]) => Array.isArray(images) ? images.join(', ') : '',
    },
    {
      title: 'Action',
      key: 'action',
      width: '10%',
      ellipsis: true,
      render: (_: any, record: Product) => (
        <div className='flex gap-2 justify-center items-center'>
          <Button onClick={() => handleAddToCart(record)}>
          <ShoppingCartOutlined />
          </Button>
          <Button type='dashed' >
            Edit
          </Button>
        </div>
      ),
    },
  ];

  const onChange = (sorter: any, filters: any) => {
    console.log('params', sorter, filters);
  };
  

  return (
    <div>
      <div className='flex justify-between items-center'>
      <Button onClick={handleCreate} type="primary" className='mb-4 mt-4'>
        Create Product
      </Button>

      <Button>
      <ShoppingCartOutlined onClick={handleCart} />
      </Button>
      </div>
      <div className='flex justify-center items-center min-h-96'>
      {isLoading ? (
        <Spin tip="Loading..." />
      ) : (
        <Table columns={columns}  dataSource={products} rowKey="id" onChange={onChange} />
      )}
      </div>
      <Modal
        title="Create Product"
        visible={isModalVisible}
        onCancel={handleModalClose}
        footer={null}
      >
        <ProductForm onSubmit={handleFormSubmit} />
      </Modal>
      <Modal
        visible={isCartVisible}
        onCancel={handleCartClose}
        footer={null}
      >
        <Cart />
      </Modal>
    </div>
  );
};

export default ProductsComponent;
