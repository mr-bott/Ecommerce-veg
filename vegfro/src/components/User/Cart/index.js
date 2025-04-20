import React, { useContext, useState } from "react";
import { Trash2 } from "lucide-react";
import CartContext from "../../../context/CartContext";
import EcommerceHeader from "../../Header";
import "./cart.css";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import axios from "axios";
import Loader from "../../Loader";
import Footer from "../../Footer";
import { useNotification } from "../../../context/NotificationContext";

export default function ShoppingCart() {
  const { addNotification } = useNotification();

  const [isLoading, setIsLoading] = useState(false);
  const token = Cookies.get("jwt_token");
  const decoded = jwtDecode(token);
  const userId = decoded.userId;
  const {
    cartList,
    setCartList,
    removeCartItem,
    incrementCartItemQuantity,
    decrementCartItemQuantity,
  } = useContext(CartContext);

  const subtotal = cartList.reduce(
    (sum, item) => sum + item.pricePerQuintal * item.quantity,
    0
  );
  const tax = 0;
  const shipping = 19;
  const total = subtotal + tax + shipping;

  const handlePlaceOrder = async () => {
    try {
      setIsLoading(true);
      const orderData = {
        userId,
        products: cartList.map((item) => ({
          productId: item._id,
          name: item.name,
          quantity: item.quantity,
          price: item.pricePerQuintal,
        })),
        totalAmount: total,
      };
      const url = process.env.REACT_APP_BACKEND_URL;

      const response = await axios.post(`${url}/orders`, orderData);
      if (response.status === 201) {
        // Send confirmation email
        
      addNotification("Order Placed Successfully!");
        await axios.post(`${url}/send-confirmation-email`, {
          userId,
          orderDetails: orderData,
        });

        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);

      addNotification("Failed to place order. Please try again.");
    }
  };

  const handleQuantityChange = (id, amount) => {
    setCartList((prevCart) =>
      prevCart.map((item) =>
        item.id === id && item.quantity + amount > 0
          ? { ...item, quantity: item.quantity + amount }
          : item
      )
    );
  };

  const handleRemove = (id) => {
    setCartList((prevCart) => prevCart.filter((item) => item._id !== id));
  };
  if (isLoading) {
    return <Loader />;
  }
  return (
    <>
      <EcommerceHeader />
      <div className="cart-container">
        <div className="cart-details">
          <h2 className="cart-heading">Your Cart</h2>

          <div className="cart-header">
            <div className="cart-header-product">PRODUCT</div>
            <div className="cart-header-quantity">QUANTITY</div>
            <div className="cart-header-price">PRICE</div>
          </div>

          <div className="cart-items-container">
            {cartList.length === 0 ? (
              <div className="empty-cart-message">No items in cart</div>
            ) : (
              cartList.map((item) => (
                <div className="cart-item" key={item.id}>
                  <div className="cart-item-product">
                    <div className="cart-item-image">
                      <img src={item.imageUrl} alt={item.name} />
                    </div>
                    <div className="cart-item-details">
                      <div className="cart-item-name">{item.name}</div>
                      <div className="cart-item-variant">
                        Per Quintal: ₹ {item.pricePerQuintal}/-
                      </div>
                    </div>
                  </div>

                  <div className="quantity-selector">
                    <button
                      className="quantity-button decrease-button"
                      onClick={() => decrementCartItemQuantity(item._id)}
                    >
                      -
                    </button>
                    <span className="current-quantity">{item.quantity}</span>
                    <button
                      className="quantity-button increase-button"
                      onClick={() => incrementCartItemQuantity(item._id)}
                    >
                      +
                    </button>
                  </div>

                  <div className="cart-item-price-section">
                    <div className="cart-item-price">
                      ₹ {(item.pricePerQuintal * item.quantity).toFixed(2)}
                    </div>
                    <button
                      className="cart-item-remove"
                      onClick={() => removeCartItem(item._id)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="cart-coupon">
            <input
              type="text"
              placeholder="Enter coupon code"
              className="cart-coupon-input"
            />
            <button className="cart-coupon-button">Apply coupon</button>
          </div>
        </div>

        <div className="cart-summary">
          <h3 className="cart-summary-heading">Cart total</h3>

          <div className="cart-summary-row">
            <span>Subtotal</span>
            <span>₹{subtotal.toFixed(2)}</span>
          </div>

          <div className="cart-summary-row">
            <span>Tax</span>
            <span>₹{tax.toFixed(2)}</span>
          </div>

          <div className="cart-summary-row">
            <span>Shipping in India</span>
            <span>₹{shipping.toFixed(2)}</span>
          </div>

          <div className="cart-summary-shipping-note">
            We only charge for shipping when you have over 7kg items
          </div>

          <div className="cart-summary-total">
            <span>Total</span>
            <span>₹{total.toFixed(2)}</span>
          </div>

          <button
            className="cart-checkout-button"
            onClick={() => handlePlaceOrder()}
          >
            Place Your Order
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
}
