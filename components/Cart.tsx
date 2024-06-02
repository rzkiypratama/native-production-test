'use client';

import React from 'react';
import { useCartStore } from '../store/cartStore';
import { Button, List } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';

const Cart: React.FC = () => {
  const { cart, removeFromCart, removeAllFromCart, removeAllOfProductFromCart } = useCartStore();

  return (
    <div className='bg bg-white'>
      <h2>Cart</h2>
      <List
        dataSource={cart}
        renderItem={({ product, quantity }) => (
          <List.Item
            actions={[
              <Button onClick={() => removeFromCart(product.id)} type="link">
                <DeleteOutlined style={{ color: 'red' }} />
              </Button>,
              <Button onClick={() => removeAllOfProductFromCart(product.id)} type="link" danger>
                Remove All
              </Button>,
            ]}
          >
            <List.Item.Meta
              title={product.title}
              description={`Price: ${product.price} - Quantity: ${quantity}`}
            />
          </List.Item>
        )}
      />
       <Button onClick={removeAllFromCart} type="primary" danger className='mb-4'>
        Remove All
      </Button>
    </div>
  );
};

export default Cart;
