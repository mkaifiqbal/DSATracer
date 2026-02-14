# 🚀 DSATracer

[![Deployment Status](https://img.shields.io/badge/Deployment-Live-success?style=for-the-badge&logo=vercel)](https://dsa-tracer.vercel.app/)
[![MERN Stack](https://img.shields.io/badge/Stack-MERN-blue?style=for-the-badge&logo=mongodb)](https://github.com/mkaifiqbal/DSATracer)

**DSATracer** is a powerful, full-stack personal productivity tool designed to help developers track, manage, and visualize their progress in Data Structures and Algorithms. Stay consistent and dominate your coding interviews by keeping all your solved problems in one place.

🔗 **Live Demo:** [dsa-tracer.vercel.app](https://dsa-tracer.vercel.app/)

---

## ✨ Features

- **Problem Tracking:** Log every problem you solve with category.
- **Google Authentication:** Secure and seamless login using Google OAuth.
- **Personalized Dashboard:** A clean UI to view your overall progress at a glance.
- **Persistent Progress:** Data is securely stored in MongoDB Atlas, accessible from anywhere.
- **Mobile Responsive:** Track your progress on the go with a fully responsive Tailwind CSS design.

---

## 🛠️ Tech Stack

- **Frontend:** React.js, Tailwind CSS, React Router DOM
- **Backend:** Node.js, Express.js, Passport.js (Google Strategy)
- **Database:** MongoDB Atlas
- **Hosting:** Vercel (Frontend) & Render (Backend)

---

## 🚀 Getting Started

Follow these steps to get a local copy up and running.

### 📋 Prerequisites
- Node.js (v16+)
- npm or yarn
- A MongoDB Atlas Account
- Google Cloud Console Project (for OAuth)

### 🔧 Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/mkaifiqbal/DSATracer.git
   cd DSATracer
2. **Install Dependencies:**
   ```bash
   # Install backend dependencies
    cd backend
    npm install
    
    # Install frontend dependencies
    cd ../dsatracer
    npm install 
3. **Set Up Environment Variables:**
   Create a .env file in the backend directory and add the following keys:
    ```bash
    PORT=5000
    MONGO_URI=your_mongodb_connection_string
    SESSION_SECRET=your_random_session_secret
    GOOGLE_CLIENT_ID=your_google_client_id
    GOOGLE_CLIENT_SECRET=your_google_client_secret
    FRONTEND_URL=http://localhost:3000
4. **Run the Project:**
    ```bash
    # In backend directory
    npm run dev
    
    # In dsatracer directory (new terminal)
    npm start
  **🤝 Contributing**
  Contributions are what make the open-source community such an amazing place to learn, inspire, and create.

1. Fork the Project
2. Create your Feature Branch (git checkout -b feature/AmazingFeature)
3. Commit your Changes (git commit -m 'Add some AmazingFeature')
4. Push to the Branch (git push origin feature/AmazingFeature)
5. Open a Pull Request

**👤 Author**
Mohammad Kaif Iqbal

GitHub: [@mkaifiqbal](https://github.com/mkaifiqbal/)

Website: [https://dsa-tracer.vercel.app/](https://dsa-tracer.vercel.app/)

Give a ⭐️ if this project helped you!
