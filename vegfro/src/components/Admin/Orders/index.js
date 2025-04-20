import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./ordres.css";
import OrderDetails from "../OrderDetails";
import Loader from "../../Loader";
import Footer from "../../Footer";
const OrderManagement = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const URL = `${process.env.REACT_APP_BACKEND_URL}/admin/orders`;
      const response = await fetch(URL);
      if (!response.ok) throw new Error(`Error: ${response.status}`);
      const data = await response.json();
      setProducts(data);
 
    } catch (error) {
      setError("Failed to fetch products. Please try again later.");
  
    } finally {
      setIsLoading(false);
    }
  };

  const StatusBadge = ({ status }) => {
    const statusClasses = {
      delivered: "status-delivered",
      placed: "status-processing",
      processed: "status-shipped",
      // cancelled: "status-cancelled",
      // pending: "status-pending",
    };

    return (
      <div className={`order-status-badge ${statusClasses[status]}`}>
        {status.toUpperCase()}
      </div>
    );
  };

  const PaymentBadge = ({ payment }) => {
    const paymentClasses = {
      paid: "payment-paid",
      unpaid: "payment-unpaid",
      refunded: "payment-refunded",
    };

    return (
      <div className={`order-payment-badge ${paymentClasses[payment]}`}>
        {/* {payment.toUpperCase()} */}
      </div>
    );
  };
  const getItemSummary = (items) => {
    if (!items || items.length === 0) return "No items";
    const first = items[0];
    const name = first?.productId?.name || "Unnamed";
    const quantity = first?.quantity || 1;
    if (items.length === 1) return `${quantity} × ${name}`;
    return `${quantity} × ${name} + ${items.length - 1} more`;
  };
  const filteredOrders = products.filter((order) => {
    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;

    const matchesSearch =
      order._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.userId.email.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  if (isLoading) {
    return <Loader />;
  }
  return (
    <>
      <div className="vegetable-orders-container">
        <h1 className="orders-title">All Orders</h1>

        <div className="order-filters">
          <input
            type="text"
            className="order-search"
            placeholder="Search by email or order ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <select
            className="order-filter-status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="delivered">Delivered</option>
            <option value="placed">Placed</option>
            <option value="processed">Processed</option>
          </select>
        </div>

        <div className="orders-table-wrapper">
          <table className="orders-table">
            <thead>
              <tr>
                <th className="column-order-id">ORDER</th>
                <th className="column-customer">CUSTOMER</th>
                <th className="column-items">ITEMS</th>
                <th className="column-total">TOTAL</th>
                <th className="column-date">DATE</th>
                <th className="column-status">STATUS</th>
                <th className="column-payment">PAYMENT</th>
                <th className="column-action">ACTION</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order._id} className="order-row">
                  <td className="order-id">{order._id}</td>
                  <td className="order-customer">
                    <div className="customer-name">{order?.userId?.name||"name"}</div>
                    <div className="customer-email">{order?.userId?.email||"email"}</div>
                  </td>
                  <td className="order-items">
                    <div className="items-summary">
                      {getItemSummary(order.products)}
                    </div>
                    <div className="items-count"> 
                      {order.products.length} items
                    </div>
                  </td>

                  <td className="order-amount">
                    {order.totalAmount.toLocaleString("en-IN", {
                      style: "currency",
                      currency: "INR",
                    })}
                  </td>
                  <td className="order-date">
                    {new Date(order.createdAt).toLocaleString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </td>

                  <td className="order-status">
                    <StatusBadge status={order.status} />
                  </td>
                  <td className="order-payment">
                    <PaymentBadge payment={order.totalAmount} />
                  </td>
                  <td className="order-action">
                    <Link
                      to={`/order-details/${order._id}`}
                      className="link-item"
                    >
                      <button className="view-button">View</button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="orders-pagination">
          <button className="pagination-button">Previous</button>
          <div className="pagination-pages">
            <button className="pagination-page pagination-active">1</button>
            <button className="pagination-page">2</button>
            <button className="pagination-page">3</button>
          </div>
          <button className="pagination-button">Next</button>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default OrderManagement;
