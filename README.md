# 🍦 Mystery Scoops

Welcome to the **Mystery Scoops** business website! This project is a full-stack e-commerce web application designed to provide a seamless mystery-box purchasing experience for customers.

## 🚀 Features
*   **Dynamic Product Catalog:** Fully responsive product pages.
*   **Secure Payment Integration:** Integrated with **Razorpay** to handle real-time transactions safely.
*   **Order Management:** Built-in backend logic to verify payment signatures.
*   **Data Persistence:** All customer order data is stored securely in a **MongoDB** cloud database.

## 🛠 Tech Stack
*   **Frontend:** HTML5, CSS3, JavaScript
*   **Backend:** Node.js, Express
*   **Database:** MongoDB, Mongoose
*   **Payments:** Razorpay API

## 📂 Project Structure
*   `server.js`: Handles backend routing, payment verification, and database interactions.
*   `script.js`: Manages frontend interactivity and Razorpay checkout triggers.
*   `style.css`: Custom responsive styling for a modern UI.

## 💡 How to Run Locally
1. Clone this repository.
2. Install dependencies:
   ```bash
   npm install mongoose express razorpay dotenv corsCreate a .env file in the root directory and add your credentials:

Plaintext
RAZORPAY_KEY_ID=your_key_here
RAZORPAY_KEY_SECRET=your_secret_here
MONGODB_URI=your_mongodb_connection_string
Start the server:

Bash
node server.js
Built with ❤️ by Sneha
