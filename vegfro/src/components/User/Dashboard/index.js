import React from "react";
import { Link } from "react-router-dom";
import "./homepage.css";
import EcommerceHeader from "../../Header";
import Footer from "../../Footer";
export default function HomePage() {
  return (
    <>
      <div className="home-container">
        <EcommerceHeader />

        <main className="main-content">
          <h1 className="main-title">
            Fresh Fruits
            <br />
            &amp; Vegetables
          </h1>
          <p className="subtitle">
            Get fresh fruits and vegetables
            <br />
            delivered to your door.
          </p>
          <Link to="/products" className="shop-now-link">
            <button className="shop-now-button">Shop Now</button>
          </Link>

          <div className="fruits-illustration">
            <div className="fruit tomato"></div>
            <div className="fruit carrot"></div>
            <div className="fruit lemon"></div>
            <div className="fruit banana"></div>
            <div className="fruit watermelon"></div>
            <div className="fruit broccoli"></div>
            <div className="fruit avocado"></div>
            <div className="fruit grapes"></div>
            <div className="fruit bell-pepper"></div>
            <div className="fruit cucumber"></div>
            <div className="fruit beet"></div>
            <div className="fruit cabbage"></div>
          </div>
        </main>

        <div className="stats-container">
          <div className="stats-header">
            <h2>Numbers tell our story</h2>
            <p>
              Amet minim mollit non deserunt ullamco est sit aliqua dolor do
              amet sint. Velit officia consequat duis.
            </p>
          </div>

          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-value">
                6<span className="plus">+</span>
              </div>
              <div className="stat-title">Years in business</div>
              <div className="stat-subtitle">Creating the successful path</div>
            </div>

            <div className="stat-card">
              <div className="stat-value">9845</div>
              <div className="stat-title">Items delivered</div>
              <div className="stat-subtitle">In last 6 Months</div>
            </div>

            <div className="stat-card">
              <div className="stat-value">
                374<span className="plus">+</span>
              </div>
              <div className="stat-title">Team members</div>
              <div className="stat-subtitle">Working for your success</div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
