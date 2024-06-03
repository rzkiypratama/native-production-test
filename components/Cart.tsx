import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store";
import {
  removeFromCart,
  removeAllFromCart,
  removeAllOfProductFromCart,
} from "../store/cartStore";
import { Button, List } from "antd";
import { DeleteOutlined } from "@ant-design/icons";

const Cart: React.FC = () => {
  const cart = useSelector((state: RootState) => state.cart.cart);
  const dispatch = useDispatch();

  return (
    <div className="bg bg-white">
      <h2>Cart</h2>
      <List
        dataSource={cart}
        renderItem={({ product, quantity }) => (
          <List.Item
            actions={[
              <Button
                key="remove"
                onClick={() => dispatch(removeFromCart(product.id))}
                type="link"
              >
                <DeleteOutlined style={{ color: "red" }} />
              </Button>,
              <Button
                key="removeAll"
                onClick={() => dispatch(removeAllOfProductFromCart(product.id))}
                type="link"
                danger
              >
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
      {cart.length > 1 && (
        <Button
          onClick={() => dispatch(removeAllFromCart())}
          type="primary"
          danger
          className="mb-4"
        >
          Remove All
        </Button>
      )}
    </div>
  );
};

export default Cart;
