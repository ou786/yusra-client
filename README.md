# 🟣 Yusra – A Beautiful, Modern Kanban Productivity App

Yusra is a full-stack Kanban board application designed for smooth task management, workflow organization, and personal productivity.  
It features a clean UI, intuitive drag-and-drop interactions, and a calm visual theme inspired by the quote:

> **“For every hardship, there is ease.” — Surah Ash-Sharh**

---

## 🚀 Live Demo

**Frontend:**  
🔗 https://yusra-nine.vercel.app  

**Backend:**  
🔗 https://yusra-server.onrender.com

---

## 🧩 Features

### ✅ Authentication
- Secure JWT login & register  
- Protected routes  
- Auto-redirect based on session  

### ✅ Workspaces
- Create & delete workspaces  
- Rename inline  
- Smooth hover animations  
- Clean empty-state onboarding UI  

### ✅ Boards
- Multiple boards per workspace  
- Interactive grid layout  
- Inline rename  
- Hover animations  
- Smart navigation  

### ✅ Columns
- Add, rename, and delete columns  
- Drag & drop reordering  
- Real-time UI updates  

### ✅ Cards
- Add, rename, delete cards  
- Drag between columns  
- Smooth animations  
- Instant state update without reload  

### ✅ Global UI Enhancements
- Animated top quote (changes every 5 seconds)  
- Sticky navigation bar with Logout  
- Responsive layout  
- Minimal, modern Tailwind styling  

---

## 🛠️ Tech Stack

### Frontend
- React (Vite)
- React Router
- Tailwind CSS
- @hello-pangea/dnd (Drag & Drop)
- Axios

### Backend
- Node.js / Express
- MongoDB / Mongoose
- JWT Authentication
- Render (deployment)

### Tools
- Postman (API testing)
- GitHub
- Vercel (frontend hosting)

---

## 📁 Project Structure (Client)

src/
├── api/ # Axios config & API wrappers
├── components/ # Shared UI components
├── pages/ # Login, Register, Dashboard, Workspace, Board
├── assets/ # Images / logos
├── App.jsx # Routes
└── main.jsx # Entry point


---

## ⚙️ Local Setup

### 1. Clone the project
```bash
git clone https://github.com/ou786/yusra-client.git
cd yusra-client
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start development server
```bash
npm run dev
```

## Available at
The app will be available at:
➡️ http://localhost:5173

---

## 📌 Environment Variables

This frontend currently does not require a .env file.
API URLs are configured in the Axios instance.
Backend uses environment variables for:
MongoDB connection
JWT secrets
Email credentials (if required)

---

## 🧑‍💻 Author

Mohammed Osama Ussaid
Full-Stack Developer — React | Node.js | MongoDB

GitHub: https://github.com/ou786