# NODETEST - Product Management System

A high-performance MERN (MongoDB, Express, React, Node.js) application designed for seamless product discovery and catalog management. This project features a modern split-screen authentication experience, dynamic category filtering, and a robust backend architecture.

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v16.x or higher)
- **MongoDB** (Local instance or Atlas URI)
- **Git** (Configured on your local machine)

### Installation

1. **Clone the repository** (after pushing):
   ```bash
   git clone https://github.com/althafbiju7/NODETEST.git
   cd NODETEST
   ```

2. **Backend Setup**:
   - Navigate to the `backend` folder.
   - Install dependencies: `npm install`
   - Create a `.env` file from the example below.
   - Start the server: `npm run dev`

3. **Frontend Setup**:
   - Navigate to the `frontend` folder.
   - Install dependencies: `npm install`
   - Start the development server: `npm run dev`

### Environment Configuration (.env)
Create a `.env` file in the `backend/` directory:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

## ✨ Key Features

- **Modern Split-Screen Auth**: A beautiful, branded login and signup experience with geometric background decorations.
- **Dynamic Catalog**: Filter products by Category and Sub-category with ease.
- **Global Search**: Search for any product by name from the top navigation bar.
- **Variant Management**: Support for multiple product variants (RAM/Size, Price, Qty) in a single entry.
- **User Wishlist**: Save and manage your favorite items.
- **Admin Tools**: Integrated modals for adding Products, Categories, and Sub-categories.

## 🛠️ Tech Stack

- **Frontend**: React, Vite, React Router, Context API, react-icons.
- **Backend**: Node.js, Express, Mongoose.
- **Authentication**: JSON Web Tokens (JWT) & bcrypt.
- **Styling**: Vanilla CSS with modern Design Tokens and Glassmorphism.

## 📂 Project Structure

- `backend/`: Server logic, models, controllers, and API routes.
- `frontend/`: React components, pages, and UI assets.

---

### Push to GitHub

If you have already initialized your local repository, run these commands to link it to your new GitHub repository:

```bash
# Link the remote
git remote add origin https://github.com/althafbiju7/NODETEST.git

# Stage and commit your current progress
git add .
git commit -m "Initial commit: Professional Product Management app with Split-Screen Auth"

# Push to the main branch
git branch -M main
git push -u origin main
```
