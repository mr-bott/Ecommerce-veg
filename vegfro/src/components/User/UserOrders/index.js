import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./userorders.css";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import EcommerceHeader from "../../Header";
import Footer from "../../Footer";
import Loader from "../../Loader";
const UserOrderDetails = () => {
  // Sample data for orders
  const token = Cookies.get("jwt_token");
  const decoded = jwtDecode(token);
  const userId = decoded.userId; // Extract userId from the token
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orders, setOrders] = useState([]);
  useEffect(() => {
    fetchOrderDetails();
  }, []);

  const fetchOrderDetails = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const URL = `${process.env.REACT_APP_BACKEND_URL}/orders/user/${userId}`;
      const response = await fetch(URL);
      if (!response.ok) throw new Error(`Error: ${response.status}`);
      const data = await response.json();

      const transformedOrders = data.map((order) => ({
        id: order._id,
        date: new Date(order.createdAt).toLocaleDateString(),
        totalAmount: order.totalAmount,
        status: order.status.charAt(0).toUpperCase() + order.status.slice(1),
        items: order.products.map((product) => ({
          id: product.productId._id,
          name: product.productId.name,
          image: product.productId.imageUrl,
          price: product.productId.pricePerQuintal * product.quantity,
          quantity: product.quantity,
        })),
      }));

      setOrders(transformedOrders);
  
    } catch (error) {
      setError("Failed to fetch orders. Please try again later.");
   
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewOrder = (orderId) => {
    console.log(`Viewing order: ${orderId}`);
  };

  const handleViewInvoice = (orderId) => {
    console.log(`Viewing invoice for order: ${orderId}`);
  };

  const handleViewProduct = (productId) => {
    console.log(`Viewing product: ${productId}`);
  };

  const handleViewSimilarProducts = (productId) => {
    console.log(`Viewing similar products to: ${productId}`);
  };
  if (isLoading) return <Loader />;
  return (
    <>
      <EcommerceHeader />

      <div className="details-container">
        <div className="details-header">
          <h1>Order Details</h1>
          <p>
            Check the status of recent and old orders & discover more products
          </p>
        </div>

        <div className="details-orders-list">
          {orders.map((order, index) => (
            <div className="details-order-card" key={`${order.id}-${index}`}>
              <div className="details-order-info">
                <div className="details-info-section">
                  <h3>Order ID</h3>
                  <p className="details-orderid">#{order.id}</p>
                </div>

                <div className="details-info-section">
                  <h3>Date</h3>
                  <p>{order.date}</p>
                </div>

                <div className="details-info-section">
                  <h3>Total Amount</h3>
                  <p>₹{order.totalAmount}</p>
                </div>

                <div className="details-info-section">
                  <h3>Order Status</h3>
                  <div
                    className={`details-status ${order.status.toLowerCase()}`}
                  >
                    {order.status === "Delivered" && (
                      <span className="details-status-dot"></span>
                    )}
                    {order.status}
                  </div>
                </div>
              </div>

              <div className="details-order-items">
                {order.items.map((item) => (
                  <div className="details-product-row" key={item.id}>
                    <div className="details-product-image">
                      <img
                        src={item.image}
                        alt={item.name}
                        onError={(e) => {
                          e.target.src = "/api/placeholder/80/80";
                          e.target.alt = "Product placeholder";
                        }}
                      />
                    </div>

                    <div className="details-product-info">
                      <h3>{item.name}</h3>
                      <p>{item.color}</p>

                      <div className="details-product-actions">
                        <Link
                          to={`/product-details/${item.id}`}
                          className="logo-link"
                        >
                          <button
                            className="details-link-button"
                            onClick={() => handleViewProduct(item.id)}
                          >
                            View Product
                          </button>
                        </Link>

                        <p>Quantity: {item.quantity}</p>
                      </div>
                    </div>

                    <div className="details-product-price">₹{item.price}</div>
                  </div>
                ))}
              </div>

              <div className="details-order-actions">
                <button
                  className="details-btn details-btn-outline"
                  onClick={() => handleViewOrder(order.id)}
                >
                  View Order
                </button>

                <button
                  className="details-btn details-btn-outline"
                  onClick={() => handleViewInvoice(order.id)}
                >
                  View Invoice
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default UserOrderDetails;
