# Credentails :-
Admin:-
email: admin@gmail.com
password:- Svcet@24

user :- 
create your own (or) credentails 
email:demo@gmail.com
password :- Svcet@24 

LINK :-> https://ecommerce-veg.vercel.app
# Bulk Vegetables & Fruit Selling E-Commerce Platform

This is a fully developed and feature-rich e-commerce platform designed for selling bulk vegetables and fruits. It includes various features to enhance the user experience and simplify order management for vendors and admins.

## Features:
- **User Authentication**: Sign up and log in with email OTP verification.
- **Email Notifications**: Users are notified via email for various actions like order status, promotional offers, etc.
- **In-App Notifications**: Real-time notifications for order updates and promotions within the platform.
- **Robust Backend**: Built with a strong and scalable backend architecture to handle high volumes of orders and transactions.
- **Admin Panel**: Admin users can efficiently manage orders, users, and product listings, while gaining insights into sales performance and trends.
- **Responsive Design**: A fully responsive and intuitive UI for both mobile and desktop views.
- **Order Management**: Users can track their orders, update preferences, and complete bulk vegetable and fruit purchases seamlessly.

## Tech Stack:
- **Frontend**: React.js, HTML5, CSS3, ReactJs
- **Backend**: Node.js, Express.js
- **Database**: MongoDB 
- **Authentication**: JWT (JSON Web Tokens) with OTP verification
- **Notifications**: Email (Nodemailer) & In-App Notifications
- **Admin Panel**: Custom Admin Dashboard with access control

## Setup Instructions:

### Prerequisites:
- Node.js (v14 or above)
- NPM 
- MongoDB
- Git

### Steps to Run Locally:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/mr-bott/Veg-Ecommerce.git
   cd Veg-Ecommerce
   ```

2. **Install the dependencies:**

   For the backend:
   ```bash
   cd vegbak
   npm install
   ```

   For the frontend:
   ```bash
   cd vegfro
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env` file in both the **frontend** and **backend** directories and configure the necessary environment variables (like database URL, JWT secret, email service credentials, etc.)

4. **Run the backend:**
   ```bash
   cd vegbak
   npm start
   ```

5. **Run the frontend:**
   ```bash
   cd vegfro
   npm start
   ```

6. **Access the application:**
   Once both the frontend and backend are running, open your browser and navigate to `http://localhost:3000`.

---

## Admin Panel:

The admin panel provides a user-friendly interface for monitoring and managing orders, users, and product listings. To access the admin panel:
1. Log in with an admin email and password (configured in your environment).
2. You can view, update, and delete orders, track sales statistics, and manage users and products.

## Email OTP Authentication:

Users can sign up and log in using a one-time password (OTP) sent to their email. This adds an extra layer of security to the authentication process.

## Notifications:
- **Email Notifications**: Users receive email notifications for successful orders, payment updates, and promotional offers.
- **In-App Notifications**: Real-time updates regarding order status, delivery tracking, and more.


## Contributing:
We welcome contributions to improve the platform! To contribute:
1. Fork the repository.
2. Create a new branch (`git checkout -b feature-name`).
3. Make your changes and commit (`git commit -am 'Add feature'`).
4. Push to the branch (`git push origin feature-name`).
5. Create a pull request.

## Contact:
For any queries or suggestions, feel free to reach out to **mr-bott** at [mr-bott@example.com](mailto:muralikrishna8309@example.com).
