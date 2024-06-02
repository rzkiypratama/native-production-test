'use client';

import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Spin, Form, Typography, Popconfirm, Badge } from 'antd';
import { useProductStore } from '../store/useProducts';
import { useCartStore } from '../store/cartStore';
import ProductForm from './ProductsForm';
import { Product } from '../types/productTypes';
import { ShoppingCartOutlined } from '@ant-design/icons';
import Cart from './Cart';
import EditableCell from './EditableCell';

const ProductsComponent: React.FC = () => {
  const { products, fetchProducts, addProduct, editProduct, isLoading } = useProductStore();
  const { addToCart, initializeCart, cart } = useCartStore();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isCartVisible, setIsCartVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState<number | ''>('');

  useEffect(() => {
    fetchProducts();
    initializeCart();
  }, [fetchProducts, initializeCart]);

  const handleCreate = () => {
    setIsModalVisible(true);
  };
  
  const handleModalClose = () => {
    setIsModalVisible(false);
  };

  const handleCart = () => {
    setIsCartVisible(true);
  };

  const handleCartClose = () => {
    setIsCartVisible(false);
  };

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

  const isEditing = (record: Product) => record.id === editingKey;

  const edit = (record: Partial<Product> & { id: React.Key }) => {
    form.setFieldsValue({ ...record });
    setEditingKey(record.id);
  };

  const cancel = () => {
    setEditingKey('');
  };

  const save = async (id: number) => {
    try {
      const row = await form.validateFields();
      const updatedProduct = { ...row, id } as Product;
      await editProduct(updatedProduct);
      setEditingKey('');
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: '5%',
      editable: false,
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      width: '20%',
      editable: true,
      filters: products.map((product) => ({
        text: product.title,
        value: product.title,
      })),
      onFilter: (value: string | number | boolean, record: Product) => record.title.includes(value as string),
      filterSearch: true,
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      width: '10%',
      editable: true,
      sorter: (a: Product, b: Product) => a.price - b.price,
      render: (price: number) => <span>{price}</span>,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      width: '35%',
      editable: true,
    },
    {
      title: 'Images',
      dataIndex: 'images',
      key: 'images',
      width: '15%',
      editable: false,
      render: (images: string[]) => Array.isArray(images) ? images.join(', ') : '',
    },
    {
      title: 'Action',
      key: 'action',
      ellipsis: true,
      render: (_: any, record: Product) => {
        const editable = isEditing(record);
        return (
          <div>
            {editable ? (
              <>
                <span>
                  <Typography.Link onClick={() => save(record.id)} style={{ marginRight: 8 }}>
                    Save
                  </Typography.Link>
                  <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
                    <a>Cancel</a>
                  </Popconfirm>
                </span>
              </>
            ) : (
              <div className='flex gap-2 justify-center items-center'>
                <Button disabled={editingKey !== ''} onClick={() => edit(record)}>
                  Edit
                </Button>
                <Button onClick={() => handleAddToCart(record)}>
                  <ShoppingCartOutlined />
                </Button>
              </div>
            )}
          </div>
        );
      },
    },
  ];

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: Product) => ({
        record,
        inputType: col.dataIndex === 'price' ? 'number' : 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  const onChange = (pagination: any, filters: any, sorter: any) => {
    console.log('params', pagination, filters, sorter);
  };

  return (
    <div>
      <div className='flex justify-between items-center'>
        <Button onClick={handleCreate} type="primary" className='mb-4 mt-4'>
          Create Product
        </Button>
        <Badge count={cart.reduce((total, item) => total + item.quantity, 0)}>
          <Button onClick={handleCart} type="primary" shape="circle" icon={<ShoppingCartOutlined />} />
        </Badge>
      </div>
      <div className='flex justify-center items-center min-h-96'>
        {isLoading ? (
          <Spin tip="Loading..." />
        ) : (
          <Form form={form} component={false}>
            <Table<Product>
              components={{
                body: {
                  cell: EditableCell,
                },
              }}
              bordered
              dataSource={products}
              columns={mergedColumns as any}
              rowClassName="editable-row"
              pagination={{ pageSize: 5, onChange: cancel }}
              rowKey={(record) => record.id}
              onChange={onChange}
            />
          </Form>
        )}
      </div>
      <Modal
        title="Create Product"
        open={isModalVisible}
        onCancel={handleModalClose}
        footer={null}
      >
        <ProductForm onSubmit={handleFormSubmit} />
      </Modal>
      <Modal
        open={isCartVisible}
        onCancel={handleCartClose}
        footer={null}
      >
        <Cart />
      </Modal>
    </div>
  );
};

export default ProductsComponent;
