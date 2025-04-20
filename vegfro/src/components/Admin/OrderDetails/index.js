import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNotification } from "../../../context/NotificationContext";
import "./orderdetails.css";
import Loader from "../../Loader";
import Footer from "../../Footer";
export default function OrderDetails() {
  const { addNotification } = useNotification();
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrderDetails();
  }, []);

  const fetchOrderDetails = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const URL = `${process.env.REACT_APP_BACKEND_URL}/admin/orders/${id}`;
      const response = await fetch(URL);
      if (!response.ok) throw new Error(`Error: ${response.status}`);
      const data = await response.json();
      setOrder(data);
    } catch (error) {
      addNotification("Failed to fetch order. Please try again later.");
      setError("Failed to fetch order. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };
  const handleStatusChange = async (newStatus) => {
    try {
      setIsLoading(true);
      const URL = `${process.env.REACT_APP_BACKEND_URL}/admin/orders/${id}/status`;
      const response = await fetch(URL, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });
       if(response.ok) {
        addNotification("Status updated Successfully");  
       }
      if (!response.ok) {
        addNotification("Failed to update status on the server.");
        throw new Error("Failed to update status on the server.");
        setIsLoading(false);
      }

      // Update the local order state
      setOrder((prevOrder) => ({
        ...prevOrder,
        status: newStatus,
      }));
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);

      addNotification("Failed to update order status. Please try again.");
    }
  };

  if (isLoading) return <Loader />;
  if (error) return <p>{error}</p>;
  if (!order) return null;

  return (
    <>
      <div className="single-product-wrapper">
        {order.products.map((item, index) => (
          <div key={index} className="single-product-container">
            <div className="single-product-image-container">
              <img
                src={item.productId.imageUrl}
                alt={item.productId.name}
                className="single-product-image"
              />
            </div>

            <div className="single-product-details">
              <h1 className="single-product-title">
                Name: {item.productId.name}
              </h1>

              <div className="single-product-pricing">
                <span className="single-product-price">
                  Rs {item.productId.pricePerQuintal}/-
                </span>
              </div>

              <p className="single-product-description">
                {item.productId.description}
              </p>

              <div className="single-product-info">
                <div className="single-info-row">
                  <span className="single-info-label">Quantity:</span>
                  <span className="single-info-value">{item.quantity}</span>
                </div>

                <div className="single-info-row">
                  <span className="single-info-label">Status:</span>
                  <span
                    className={`single-status-badge single-status-${order.status}`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}

        <div className="single-status-controls">
          <h1 className="single-product-price">
            Settled Amount:Rs {order.totalAmount}
          </h1>
          <div>
            <h3 className="single-status-heading">Change Order Status:</h3>
            <div className="single-status-buttons">
              {["placed", "processed", "delivered"].map((status) => (
                <button
                  key={status}
                  className={`single-status-button ${
                    order.status === status ? "active" : ""
                  }`}
                  onClick={() => handleStatusChange(status)}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
