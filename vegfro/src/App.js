
// import { Component } from "react";
// import React from "react";
// import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
// import "./App.css";
// import { NotificationProvider } from "./context/NotificationContext";
// import NotificationManager from "./components/NotificationManager";
// import SignUp from "./components/SignUp";
// import Login from "./components/Login";
// import ProtectedRoute from "./components/ProtectedRoutes";
// import Dashboard from "./components/Admin/DashBoard/index.js";
// import OrderDetails from "./components/Admin/OrderDetails";
// import ProductDisplay from "./components/User/Products/index.js";
// import ProductDetails from "./components/User/ProductDetails/index.js";
// import UserOrderDetails from "./components/User/UserOrders/index.js";
// import ShoppingCart from "./components/User/Cart/index.js";
// import { CartProvider } from "./context/CartContext";
// import HomePage from "./components/User/Dashboard/index.js";
// import NotFound from "./components/NotFound/index.js";
// class App extends Component {
//   render() {
//     return (
//       <CartProvider>
//         <Router>
//           <Routes>
//             <Route path="/" element={<ProtectedRoute />} />
//             <Route path="/signup" element={<SignUp />} />
//             <Route path="/login" element={<Login />} />
//             <Route
//               path="/my-orders"
//               element={
//                 <ProtectedRoute
//                   element={UserOrderDetails}
//                   allowedRoles={["user"]}
//                 />
//               }
//             />
//             <Route
//               path="/cart"
//               element={
//                 <ProtectedRoute
//                   element={ShoppingCart}
//                   allowedRoles={["user"]}
//                 />
//               }
//             />
//             <Route
//               path="/products"
//               element={
//                 <ProtectedRoute
//                   element={ProductDisplay}
//                   allowedRoles={["user"]}
//                 />
//               }
//             />
//             <Route
//               path="/product-details/:id"
//               element={
//                 <ProtectedRoute
//                   element={ProductDetails}
//                   allowedRoles={["user"]}
//                 />
//               }
//             />
//             <Route
//               path="/order-details/:id"
//               element={
//                 <ProtectedRoute
//                   element={OrderDetails}
//                   allowedRoles={["admin"]}
//                 />
//               }
//             />
//             <Route
//               path="/user/dashboard"
//               element={
//                 <ProtectedRoute element={HomePage} allowedRoles={["user"]} />
//               }
//             />
//             <Route
//               path="/admin/dashboard"
//               element={
//                 <ProtectedRoute element={Dashboard} allowedRoles={["admin"]} />
//               }
//             />

//             <Route path="*" element={<NotFound />} />
//           </Routes>
//         </Router>
//       </CartProvider>
//     );
//   }
// }

// export default App;


import { Component } from "react";
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

import { NotificationProvider } from "./context/NotificationContext";
import NotificationManager from "./components/NotificationManager";

import { CartProvider } from "./context/CartContext";

import SignUp from "./components/SignUp";
import Login from "./components/Login";
import ProtectedRoute from "./components/ProtectedRoutes";
import Dashboard from "./components/Admin/DashBoard/index.js";
import OrderDetails from "./components/Admin/OrderDetails";
import ProductDisplay from "./components/User/Products/index.js";
import ProductDetails from "./components/User/ProductDetails/index.js";
import UserOrderDetails from "./components/User/UserOrders/index.js";
import ShoppingCart from "./components/User/Cart/index.js";
import HomePage from "./components/User/Dashboard/index.js";
import NotFound from "./components/NotFound/index.js";

class App extends Component {
  render() {
    return (
      <NotificationProvider>
        <CartProvider>
          <Router>
            {/* Notification bar should always render */}
            <NotificationManager />

            <Routes>
              <Route path="/" element={<ProtectedRoute />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/login" element={<Login />} />
              <Route
                path="/my-orders"
                element={
                  <ProtectedRoute
                    element={UserOrderDetails}
                    allowedRoles={["user"]}
                  />
                }
              />
              <Route
                path="/cart"
                element={
                  <ProtectedRoute
                    element={ShoppingCart}
                    allowedRoles={["user"]}
                  />
                }
              />
              <Route
                path="/products"
                element={
                  <ProtectedRoute
                    element={ProductDisplay}
                    allowedRoles={["user"]}
                  />
                }
              />
              <Route
                path="/product-details/:id"
                element={
                  <ProtectedRoute
                    element={ProductDetails}
                    allowedRoles={["user"]}
                  />
                }
              />
              <Route
                path="/order-details/:id"
                element={
                  <ProtectedRoute
                    element={OrderDetails}
                    allowedRoles={["admin"]}
                  />
                }
              />
              <Route
                path="/user/dashboard"
                element={
                  <ProtectedRoute
                    element={HomePage}
                    allowedRoles={["user"]}
                  />
                }
              />
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute
                    element={Dashboard}
                    allowedRoles={["admin"]}
                  />
                }
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Router>
        </CartProvider>
      </NotificationProvider>
    );
  }
}

export default App;
