import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./productsUser.css";
import EcommerceHeader from "../../Header";
import Footer from "../../Footer";
import Loader from "../../Loader";
const ProductDisplay = () => {
  const [originalProducts, setOriginalProducts] = useState([]); // original fetched products
  const [filteredProducts, setFilteredProducts] = useState([]); // filtered + sorted products
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("default");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch products on component mount
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const URL = `${process.env.REACT_APP_BACKEND_URL}/products`;
      const response = await fetch(URL);
      if (!response.ok) throw new Error(`Error: ${response.status}`);
      const data = await response.json();
    
      setOriginalProducts(data);
      setFilteredProducts(data); // initialize display list
    } catch (error) {
      setError("Failed to fetch products. Please try again later.");
  
    } finally {
      setIsLoading(false);
    }
  };

  // Get unique categories for filter dropdown
  const categories = [
    "all",
    ...new Set(originalProducts.map((product) => product.category)),
  ];

  // Handle filters and sorting
  useEffect(() => {
    let updated = [...originalProducts];

    // Search filter
    if (search) {
      updated = updated.filter(
        (product) =>
          product.name.toLowerCase().includes(search.toLowerCase()) ||
          product.category.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Category filter
    if (categoryFilter !== "all") {
      updated = updated.filter(
        (product) => product.category === categoryFilter
      );
    }

    // Sort
    if (sortOrder === "low-to-high") {
      updated.sort((a, b) => a.pricePerQuintal - b.pricePerQuintal);
    } else if (sortOrder === "high-to-low") {
      updated.sort((a, b) => b.pricePerQuintal - a.pricePerQuintal);
    } else if (sortOrder === "name-asc") {
      updated.sort((a, b) => a.name.localeCompare(b.name));
    }

    setFilteredProducts(updated);
  }, [search, sortOrder, categoryFilter, originalProducts]);

  if (isLoading) return <Loader />;
  return (
    <>
      <EcommerceHeader />
      <div className="_product_display_container">
        <h1 className="_product_heading">Fashion & Clothing</h1>

        <div className="_filter_container">
          <div className="_search_container">
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="_search_input"
            />
          </div>

          <div className="_filter_options">
            <div className="_sort_container">
              <label htmlFor="sort">Sort by: </label>
              <select
                id="sort"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="_select"
              >
                <option value="default">Default</option>
                <option value="low-to-high">Price: Low to High</option>
                <option value="high-to-low">Price: High to Low</option>
                <option value="name-asc">Name: A-Z</option>
              </select>
            </div>

            <div className="_category_container">
              <label htmlFor="category">Category: </label>
              <select
                id="category"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="_select"
              >
                {categories.map((category, index) => (
                  <option key={index} value={category}>
                    {category === "all" ? "All Categories" : category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="_products_grid">
          {isLoading ? (
            <div className="_loading">Loading products...</div>
          ) : error ? (
            <div className="_error">{error}</div>
          ) : filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <div key={product._id} className="_product_card">
                <Link
                  to={`/product-details/${product._id}`}
                  className="logo-link"
                >
                  <div className="_product_image_container">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="_product_image"
                      onError={(e) => {
                        e.target.src = "/images/placeholder.jpg"; // fallback image
                        e.target.alt = "Product image placeholder";
                      }}
                    />
                  </div>
                  <div className="_product_info">
                    <div className="_product_category">{product.category}</div>
                    <h3 className="_product_name">{product.name}</h3>
                    <div className="_product_price">
                      ${product.pricePerQuintal.toFixed(2)}
                    </div>
                  </div>
                </Link>
                {/* <button className="_add_to_cart_btn">Add to Cart</button> */}
              </div>
            ))
          ) : (
            <div className="_no_products">
              No products match your search criteria.
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ProductDisplay;
