"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Spin,
  Form,
  Typography,
  Popconfirm,
  Badge,
} from "antd";
import { useProductStore } from "../utils/axios";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../store";
import { addToCart, initializeCart } from "../store/cartStore";
import ProductForm from "./ProductsForm";
import { Product } from "../types/productTypes";
import {
  ShoppingCartOutlined,
  DeleteOutlined,
  EditOutlined,
} from "@ant-design/icons";
import Cart from "./Cart";
import EditableCell from "./EditableCell";
import { useTheme } from "next-themes";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProductsComponent: React.FC = () => {
  const {
    products,
    fetchProducts,
    addProduct,
    editProduct,
    deleteProduct,
    isLoading,
  } = useProductStore();

  const dispatch = useDispatch<AppDispatch>();
  const cart = useSelector((state: RootState) => state.cart.cart);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isCartVisible, setIsCartVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState<number | "">("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    fetchProducts();
    dispatch(initializeCart());
  }, [fetchProducts, dispatch]);

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

  const handleFormSubmit = async (data: Omit<Product, "id">) => {
    try {
      await addProduct(data);
      setIsModalVisible(false);
      toast.success("New data added successfully");
    } catch (error) {
      toast.error("Failed to add new data");
      console.error("Error adding product:", error);
    }
  };

  const handleAddToCart = (product: Product) => {
    dispatch(addToCart(product));
  };

  const handleDeleteProduct = async (id: number) => {
    try {
      await deleteProduct(id);
      toast.success("Delete product success");
    } catch (error) {
      toast.error("Delete product failed");
      console.error("Error deleting product:", error);
    }
  };

  const isEditing = (record: Product) => record.id === editingKey;

  const edit = (record: Partial<Product> & { id: React.Key }) => {
    form.setFieldsValue({ ...record });
    setEditingKey(record.id);
  };

  const cancel = () => {
    setEditingKey("");
  };

  const save = async (id: number) => {
    try {
      const row = await form.validateFields();
      const updatedProduct = { ...row, id } as Product;
      await editProduct(updatedProduct);
      toast.success("Edit data success");
      setEditingKey("");
    } catch (errInfo) {
      toast.success("Edit data error");
      console.log("Validate Failed:", errInfo);
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: "5%",
      editable: false,
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      width: "20%",
      editable: true,
      filters: products.map((product) => ({
        text: product.title,
        value: product.title,
      })),
      onFilter: (value: string | number | boolean, record: Product) =>
        record.title.includes(value as string),
      filterSearch: true,
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      width: "10%",
      editable: true,
      sorter: (a: Product, b: Product) => a.price - b.price,
      render: (price: number) => <span>{price}</span>,
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      width: "35%",
      editable: true,
    },
    {
      title: "Images",
      dataIndex: "images",
      key: "images",
      width: "15%",
      editable: true,
      render: (images: string[]) =>
        Array.isArray(images) ? images.join(", ") : "",
    },
    {
      title: "Action",
      key: "action",
      ellipsis: true,
      render: (_: any, record: Product) => {
        const editable = isEditing(record);
        return (
          <div>
            {editable ? (
              <>
                <span>
                  <Typography.Link
                    onClick={() => save(record.id)}
                    style={{ marginRight: 8 }}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? <Spin /> : "Save"}
                  </Typography.Link>
                  <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
                    <a>Cancel</a>
                  </Popconfirm>
                </span>
              </>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <Button
                  disabled={editingKey !== ""}
                  onClick={() => edit(record)}
                >
                  <EditOutlined />
                </Button>
                <Button onClick={() => handleAddToCart(record)}>
                  <ShoppingCartOutlined />
                </Button>
                <Popconfirm
                  title="Are you sure to delete?"
                  onConfirm={() => handleDeleteProduct(record.id)}
                >
                  <Button>
                    <DeleteOutlined style={{ color: "red" }} />
                  </Button>
                </Popconfirm>
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
        inputType: col.dataIndex === "price" ? "number" : "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  const onChange = (pagination: any, filters: any, sorter: any) => {
    console.log("params", pagination, filters, sorter);
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <Button onClick={handleCreate} type="primary" className="mb-4 mt-4">
          Create Product
        </Button>
        <Badge count={cart.reduce((total, item) => total + item.quantity, 0)}>
          <Button
            onClick={handleCart}
            type="primary"
            shape="circle"
            icon={<ShoppingCartOutlined />}
          />
        </Badge>
      </div>
      <div className="flex min-h-96 items-center justify-center">
        {isLoading ? (
          <Spin />
        ) : (
          <Form form={form} component={false}>
            <div className="rounded-md bg-white">
              <Table<Product>
                components={{
                  body: {
                    cell: EditableCell,
                  },
                }}
                bordered
                dataSource={products}
                columns={mergedColumns as any}
                rowClassName={() =>
                  theme === "dark"
                    ? "bg-[#31363F] text-white hover:text-[#333]"
                    : "bg-white text-black"
                }
                pagination={{ pageSize: 5, onChange: cancel }}
                rowKey={(record) => record.id}
                onChange={onChange}
              />
            </div>
          </Form>
        )}
      </div>
      {/* modal for open create product */}
      <Modal
        title="Create Product"
        open={isModalVisible}
        onCancel={handleModalClose}
        footer={null}
      >
        <ProductForm onSubmit={handleFormSubmit} />
      </Modal>

      {/* modal for open cart */}
      <Modal open={isCartVisible} onCancel={handleCartClose} footer={null}>
        <Cart />
      </Modal>

      <ToastContainer
        position="top-center"
        autoClose={2500}
        hideProgressBar={false}
        newestOnTop
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        theme="dark"
      />
    </div>
  );
};

export default ProductsComponent;
