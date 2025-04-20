import { useState, useEffect } from "react";
import { useNotification } from "../../../context/NotificationContext";

import "./products.css";
import Loader from "../../Loader";
import Footer from "../../Footer";

export default function ProductManagement() {
  const { addNotification } = useNotification();

  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    imageUrl: "",
    pricePerQuintal: "",
    availableQuantityInQuintals: "",
    category: "vegetable",
  });

  const [formMessage, setFormMessage] = useState({ text: "", type: "" });
  const API_URL = `${process.env.REACT_APP_BACKEND_URL}/products`;

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error("Failed to fetch");

        addNotification("Failed to fetch data!");
      }

      addNotification("Data fetcehd Successfully!");
      const data = await response.json();
      setProducts(data);
    } catch (err) {
      addNotification("Failed to fetch products. Try again later.");
      setError("Failed to fetch products. Try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/admin/products/${id}`,
        { method: "DELETE" }
      );
      if (!res.ok) throw new Error();
      setProducts(products.filter((p) => p._id !== id));
    } catch {
      alert("Failed to delete.");
    }
  };

  const handleEditClick = (product) => {
    setFormData(product);
    setEditingId(product._id);
    setShowForm(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setFormMessage({ text: "", type: "" });

    const url = process.env.REACT_APP_BACKEND_URL;
    const endpoint = editingId
      ? `${url}/admin/products/${editingId}`
      : `${url}/admin/products`;
    const method = editingId ? "PUT" : "POST";

    try {
      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error();
      const updated = await response.json();

      if (editingId) {
        setProducts(products.map((p) => (p._id === editingId ? updated : p)));
        setFormMessage({ text: "Updated successfully", type: "success" });

        addNotification('Item Updated successfully"!');
      } else {
        setProducts([...products, updated]);
        setFormMessage({ text: "Added successfully", type: "success" });

        addNotification("Item Added  Successfully!");
      }

      setFormData({
        name: "",
        description: "",
        imageUrl: "",
        pricePerQuintal: "",
        availableQuantityInQuintals: "",
        category: "vegetable",
      });
      setEditingId(null);

      setTimeout(() => {
        setShowForm(false);
        setFormMessage({ text: "", type: "" });
      }, 2000);
    } catch {
      addNotification("Update Failed!");
      setFormMessage({
        text: editingId ? "Update failed." : "Add failed.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderProducts = () => {
    if (isLoading && products.length === 0)
      return (
        <div className="pm-loader">
          <Loader />
        </div>
      );
    if (error) return <div className="pm-error">{error}</div>;
    if (products.length === 0)
      return <div className="pm-info">No products found.</div>;

    return (
      <div className="pm-grid">
        {products.map((product) => (
          <div key={product._id} className="pm-card">
            <img src={product.imageUrl} alt={product.name} className="pm-img" />
            <div className="pm-details">
              <h3>{product.name}</h3>
              <p>Price Per Quintal: {product.pricePerQuintal}</p>
              <p>Qty Available: {product.availableQuantityInQuintals}</p>
              <p className="pm-desc">
                {product.description?.length > 80
                  ? product.description.substring(0, 80) + "..."
                  : product.description}
              </p>

              <div className="pm-actions">
                <button
                  onClick={() => handleEditClick(product)}
                  className="pm-edit"
                >
                  Edit
                </button>
                {/* <button
                  onClick={() => handleDelete(product._id)}
                  className="pm-delete"
                >
                  Delete
                </button> */}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderForm = () => (
    <div className="pm-form-overlay">
      <div className="pm-form-box">
        <h2>{editingId ? "Edit Product" : "Add Product"}</h2>
        {formMessage.text && (
          <div
            className={formMessage.type === "error" ? "pm-error" : "pm-success"}
          >
            {formMessage.text}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          {[
            "name",
            "pricePerQuintal",
            "category",
            "description",
            "imageUrl",
            "availableQuantityInQuintals",
          ].map((field) => (
            <div className="pm-form-group" key={field}>
              <label htmlFor={field}>{field}</label>
              {field === "description" ? (
                <textarea
                  id={field}
                  name={field}
                  value={formData[field]}
                  onChange={handleInputChange}
                  required
                />
              ) : (
                <input
                  id={field}
                  name={field}
                  value={formData[field]}
                  onChange={handleInputChange}
                  required
                />
              )}
            </div>
          ))}
          <div className="pm-form-buttons">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="pm-cancel"
            >
              Cancel
            </button>
            <button type="submit" disabled={isLoading} className="pm-submit">
              {isLoading ? "Saving..." : editingId ? "Update" : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return (
    <div className="pm-container">
      <h1>Product Management</h1>
      <button className="pm-add-btn" onClick={() => setShowForm(true)}>
        Add Product
      </button>
      {renderProducts()}
      {showForm && renderForm()}
      <Footer />
    </div>
  );
}
