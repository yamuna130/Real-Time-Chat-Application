# 💬 Real-Time Chat Application

A full-stack **real-time chat application** built with:

- 🖥️ **React.js** (frontend)
- 🔐 **JWT authentication**
- 🧠 **Node.js + Express.js** (backend)
- 🗂️ **MongoDB** (database)
- 📡 **Socket.IO** (real-time messaging)
- 📁 **File uploads** (images/documents)
- 🌗 **Light/Dark theme switcher**
-  ## 📁 Project Structure

Real-Time Chat Application/
├── client/ # React frontend
│ ├── public/
│ ├── src/
│ │ ├── components/
│ │ │ ├── Login.jsx
│ │ │ ├── Register.jsx
│ │ │ └── ChatRoom.jsx
│ │ ├── styles.css
│ │ └── App.js
├── server/ # Node.js backend
│ ├── controllers/
│ ├── models/
│ ├── middleware/
│ ├── routes/
│ ├── socket/
│ ├── uploads/
│ ├── .env
│ └── server.js
## ⚙️ Tech Stack

| Area        | Tech                        |
|-------------|-----------------------------|
| Frontend    | React, Axios, React Router  |
| Backend     | Express, Node.js            |
| Auth        | JWT, bcrypt                 |
| Real-time   | Socket.IO                   |
| DB          | MongoDB, Mongoose           |
| Uploads     | Multer                      |
| UI Features | Dark mode, Typing status    |

## 🚀 Getting Started

### 🔧 1. Clone the repository

```bash
git clone https://github.com/yourusername/real-time-chat-app.git
cd real-time-chat-app

🖥️ 2. Setup the Backend
cd server
npm install

📄 Create a .env file in server/:
MONGO_URI=mongodb://localhost:27017/chat-app
JWT_SECRET=yourSuperSecretKey
▶️ Run the server:
node server.js
✅ Server will run at: http://localhost:5000

💻 3. Setup the Frontend
cd ../client
npm install
📄 Optional .env for frontend:
REACT_APP_API_URL=http://localhost:5000

▶️ Start the React app:
npm start
✅ React will run at: http://localhost:3000

🔐 Features
✅ Register/Login with JWT

✅ Real-time public chat

✅ Private 1:1 messaging

✅ Online users list

✅ File uploads (images/docs)

✅ Dark mode toggle 🌙

✅ Typing indicators

✅ Session auto-logout on token expiry

Auth Routes
Method	Route	Description
POST	/api/auth/register	Register a user
POST	/api/auth/login	Login and get JWT

Message Routes
Method	Route	Description
GET	/api/messages	Get all public messages
POST	/api/messages	Send a public message

File Upload
Method	Route	Description
POST	/api/upload/file	Upload a file/image

🔌 Socket.IO Events
Event	Payload
join	username
sendMessage	{ user, text, fileUrl }
sendPrivateMessage	{ from, to, text, fileUrl }
typing	username
userList	[online usernames]
