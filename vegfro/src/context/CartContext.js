import React, { createContext, useState, useEffect } from "react";
import { useNotification } from "./NotificationContext";
const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { addNotification } = useNotification();
  const [cartList, setCartList] = useState(() => {
    const savedCart = localStorage.getItem("cartList");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem("cartList", JSON.stringify(cartList));
  }, [cartList]);

  const addCartItem = (product) => {
    const existingItem = cartList.find((item) => item._id === product.id);

    if (existingItem) {
      setCartList((prev) =>
        prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + product.quantity }
            : item
        )
      );
    } else {
      setCartList((prev) => [...prev, product]);
    }
  };

  const removeCartItem = (_id) => {
    setCartList((prev) => prev.filter((item) => item._id !== _id));
      
    addNotification("Item removed from cart!");
  };

  const removeAllCartItems = () => {
    setCartList([]);
  };
  const incrementCartItemQuantity = (_id) => {
    console.log("Incrementing item:", _id);
    setCartList((prev) => {
      const updated = prev.map((item) =>
        item._id === _id ? { ...item, quantity: item.quantity + 1 } : item
      );

      return updated;
    });
  };

  const decrementCartItemQuantity = (_id) => {
    console.log("Decrementing item:", _id);
    setCartList((prev) => {
      const updated = prev
        .map((item) =>
          item._id === _id
            ? item.quantity > 1
              ? { ...item, quantity: item.quantity - 1 }
              : null
            : item
        )
        .filter((item) => item !== null);

      return updated;
    });
  };

  console.log("fuck", cartList);

  return (
    <CartContext.Provider
      value={{
        cartList,
        addCartItem,
        removeCartItem,
        removeAllCartItems,
        incrementCartItemQuantity,
        decrementCartItemQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;
