import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { useNotification } from "../../../context/NotificationContext";
import "./productdetails.css";
import EcommerceHeader from "../../Header";
import CartContext from "../../../context/CartContext";
import Footer from "../../Footer";
import Loader from "../../Loader";
export default function ProductDetails() {
  const { addNotification } = useNotification();
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1); // Local quantity state

  const { addCartItem, incrementCartItemQuantity, decrementCartItemQuantity } =
    useContext(CartContext); // Access context functions

  useEffect(() => {
    fetchProductDetails();
  }, []);

  const fetchProductDetails = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const URL = `${process.env.REACT_APP_BACKEND_URL}/products/${id}`;
      const response = await fetch(URL);
      if (!response.ok) throw new Error(`Error: ${response.status}`);
      const data = await response.json();
      setProduct(data);
    } catch (error) {
      setError("Failed to fetch product. Please try again later.");
   
    } finally {
      setIsLoading(false);
    }
  };

  const handleDecrement = (id) => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
      decrementCartItemQuantity(id);
    }
  };

  const handleIncrement = (id) => {
    setQuantity((prev) => prev + 1);
    incrementCartItemQuantity(id);
  };

  const handleAddToCart = () => {
    addCartItem({ ...product, quantity });
    addNotification('Item added to cart successfully!');
  };

  if (isLoading) return <Loader />;
  if (error) return <p>{error}</p>;
  if (!product) return null;

  return (
    <>
      <EcommerceHeader />
      <div className="product-container">
        <div className="product-image-container">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="product-image-details-large"
          />
        </div>

        <div className="product-details">
          <h1 className="product-title">{product.name}</h1>

          <div className="product-pricing">
            <span className="product-price">
              Rs {product.pricePerQuintal}/-
            </span>
          </div>

          <p className="product-description">{product.description}</p>

          <div className="info-row">
            <span className="info-label">Category: </span>
            <span className="info-value"> {product.category}</span>
          </div>

          <div className="info-row">
            <span className="info-label">Available Quintals: </span>
            <span className="info-value">
              {product.availableQuantityInQuintals}
            </span>
          </div>

          <div className="info-row">
            <span className="info-label">Status:</span>
            <span className={`status-badge status-${product.status}`}>
              {product.status}
            </span>
          </div>

          <div className="break-line"></div>
          <div className="quantity-selector">
            <button
              className="quantity-button decrease-button"
              onClick={() => handleDecrement(id)}
            >
              -
            </button>
            <span className="current-quantity">{quantity}</span>
            <button
              className="quantity-button increase-button"
              onClick={() => handleIncrement(id)}
            >
              +
            </button>
          </div>

          <div className="action-buttons">
            <button className="add-to-cart-button" onClick={handleAddToCart}>
              ADD TO CART
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
