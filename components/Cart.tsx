'use client';

import React from 'react';
import { useCartStore } from '../store/cartStore';
import { Button, List } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';

const Cart: React.FC = () => {
  const { cart, removeFromCart } = useCartStore();

  return (
    <div className='bg bg-white'>
      <h2>Cart</h2>
      <List
        dataSource={cart}
        renderItem={(item) => (
          <List.Item
            actions={[
              <Button onClick={() => removeFromCart(item.id)} type="link">
                <DeleteOutlined style={{ color: 'red' }} />
              </Button>,
            ]}
          >
            <List.Item.Meta
              title={`${item.title} (x${item.quantity})`}
              description={`Price: ${item.price} | Total: ${item.price * item.quantity}`}
            />
          </List.Item>
        )}
      />
    </div>
  );
};

export default Cart;
