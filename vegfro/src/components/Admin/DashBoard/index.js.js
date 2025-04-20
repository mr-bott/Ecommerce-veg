

import { useState, useEffect } from 'react';
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, ShoppingBag, CreditCard, 
  Bell, User, Settings, BarChart3, ArrowUp, Menu, X, LogOut,Package
} from 'lucide-react';
import Loader from '../../Loader';
import './Dashboard.css'; 
import RecentOrderManagement from '../RecentOrders';
import ProductManagement from '../Products';
import OrderManagement from '../Orders';
import Footer from '../../Footer';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const navItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Orders', icon: <ShoppingBag size={20} /> },
    { name: 'Products', icon: <Package size={20} /> },
    { name: 'Billing', icon: <CreditCard size={20} /> },
    { name: 'Notifications', icon: <Bell size={20} /> },
    { name: 'Profile', icon: <User size={20} /> },
    { name: "Logout", icon: <LogOut size={20} /> }
  ];

  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const URL = `${process.env.REACT_APP_BACKEND_URL}/admin/orders/total-amount`;
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

  const logoutUser = () => {
    Cookies.remove("token"); // Remove token from cookies
    navigate("/login");      // Redirect to login
  };

  const statsCards = [
    { 
      title: 'Total Sales',
      value: `${products.totalAmount}`, 
      change: '+55%', 
      period: 'Total Trading',
      icon: <ShoppingBag size={24} />,
      iconClass: 'dashboard-icon-dark',
      textColorClass: 'text-success'
    },
    { 
      title: "Orders", 
      value: `${products.totalOrders}`,
      change: '+3%', 
      period: 'Total Orders',
      icon: <BarChart3 size={24} />,
      iconClass: 'dashboard-icon-blue',
      textColorClass: 'text-success'
    },
    { 
      title: 'Pending Orders', 
      value: `${products.pendingOrders}`,
      change: '+1%', 
      period: 'Orders Pending',
      icon: <CreditCard size={24} />,
      iconClass: 'dashboard-icon-pink',
      textColorClass: 'text-success'
    },
    { 
      title: '24 Hours Orders', 
      value: `${products.last24HoursOrders}`,
      change: 'Just updated', 
      period: '',
      icon: <User size={24} />,
      iconClass: 'dashboard-icon-green',
      textColorClass: 'text-neutral'
    }
  ];

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const renderMainContent = () => {
    if (activeTab === 'Orders') {
      return <OrderManagement />;
    } else if (activeTab === 'Products') {
      return <ProductManagement />;
    } else {
      if (isLoading) {
        return <Loader />;
      }

      return (
        <>
          <div className="dashboard-stats">
            {statsCards.map((card, index) => (
              <div key={index} className="dashboard-stat-card">
                <div className="dashboard-stat-header">
                  <div className={`dashboard-stat-icon ${card.iconClass}`}>
                    {card.icon}
                  </div>
                  <div className="dashboard-stat-info">
                    <p className="dashboard-stat-title">{card.title}</p>
                    <h3 className="dashboard-stat-value">{card.value}</h3>
                  </div>
                </div>
                <div className="dashboard-stat-footer">
                  <p className="dashboard-stat-change">
                    {card.change.startsWith('+') && <ArrowUp size={16} className="dashboard-icon-up" />}
                    <span className={card.textColorClass}>
                      {card.change}
                    </span>
                    <span className="dashboard-stat-period">{card.period}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
          <RecentOrderManagement />
        </>
      );
    }
  };

  return (
    <div className="dashboard-container">
      {/* Mobile Menu Toggle */}
      <button 
        className="dashboard-mobile-toggle" 
        onClick={toggleSidebar}
      >
        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <div className={`dashboard-sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <div className="dashboard-logo">
          <div className="dashboard-logo-icon">
            <LayoutDashboard size={20} />
          </div>
          <h1 className="dashboard-logo-text">AGRO FX Dashboard</h1>
        </div>

        <div className="dashboard-nav">
          {navItems.map((item) => (
            <button
              key={item.name}
              className={`dashboard-nav-item ${activeTab === item.name ? 'dashboard-nav-active' : ''}`}
              onClick={() => {
                if (item.name === "Logout") {
                  logoutUser();
                } else {
                  setActiveTab(item.name);
                }
                if (window.innerWidth < 768) {
                  setSidebarOpen(false);
                }
              }}
            >
              <span className="dashboard-nav-icon">{item.icon}</span>
              <span className="dashboard-nav-text">{item.name}</span>
            </button>
          ))}
        </div>

        <div className="dashboard-upgrade">
          <button className="dashboard-upgrade-button" onClick={()=>logoutUser()}>
            LOGOUT 
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="dashboard-main">
        {/* Header & Navigation */}
        <header className="dashboard-header">
          <div className="dashboard-breadcrumb">
            <a href="#" className="dashboard-breadcrumb-link">
              <LayoutDashboard size={18} />
            </a>
            <span className="dashboard-breadcrumb-separator">/</span>
            <span className="dashboard-breadcrumb-current">{activeTab}</span>
          </div>
          <h1 className="dashboard-title">{activeTab}</h1>
          <div className="dashboard-controls">
            <div className="dashboard-search">
              <input 
                type="text" 
                placeholder="Search here" 
                className="dashboard-search-input"
              />
            </div>
            <button className="dashboard-control-button">
              <User size={20} />
            </button>
            <button className="dashboard-control-button">
              <Settings size={20} />
            </button>
            <button className="dashboard-control-button">
              <Bell size={20} />
            </button>
          </div>
        </header>

        {/* Render dynamic content based on active tab */}
        {renderMainContent()}
      </div>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)}></div>}
    </div>
  );
}
