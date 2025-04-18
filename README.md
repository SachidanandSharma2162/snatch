👜 Snatch – An Online Marketplace for Bags
Snatch is a full-stack web application designed as an online marketplace specifically for bags. The goal of the project was to provide a seamless platform where users can browse, select, and interact with products — even in the absence of a payment gateway — while also giving administrators full control over product and user management.

🚀 Features
👤 User Functionality
Sign up / Login / Logout with Passport.js authentication
View Products with image, description, and details
Add to Cart for tracking selected products before checkout


Comment System:
Authenticated users can post, delete, and edit their own comments
Comments are tied to specific products

Profile System:
Upload profile pictures using Multer
View your cart and comment history

🛒 Shopping Experience
Dynamic cart system to hold selected items
Checkout page to simulate order placement (no payment processing)

After checkout:
Cart is cleared
Order history is updated for both user and admin

🛠️ Admin Panel
Admin dashboard with:
Full access to product list

User management: view and delete users
Add, delete, or update products
View orders placed by all users

📦 Product Management
Products include:
Title, description, image, and pric
Image uploads handled with Multer
Stored securely in MongoDB

🧰 Tech Stack
Frontend: HTML, CSS, JavaScript, EJS
Backend: Node.js, Express.js
Database: MongoDB with Mongoose
Authentication: Passport.js
Image Uploads: Multer
Templating Engine: EJS

-------

✅ Future Improvements
Integrate Stripe or Razorpay for real payment support
Improve mobile responsiveness
Add user order history page
Introduce product categories and filters

-------

git clone https://github.com/SachidanandSharma2162/snatch.git
cd snatch
npm install
npm run dev
