const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

require("dotenv").config();

const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/users.routes");
const albumsRoutes = require("./routes/albums.routes");
const exchangeRoutes = require("./routes/exchange.routes");
const chatRoutes = require("./routes/chat.routes");

const app = express();
const server = http.createServer(app);

/* ===== MIDDLEWARE ===== */
app.use(cors());
app.use(express.json());
app.use("/image", express.static(path.join(__dirname, "public/image")));

/* ===== SOCKET.IO ===== */
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

require("./socket/chat.socket")(io);
app.set("io", io);

/* ===== ROUTES ===== */
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/albums", albumsRoutes);
app.use("/api/exchange", exchangeRoutes);
app.use("/api/chat", chatRoutes);

/* ===== DB + START ===== */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    server.listen(5000, () =>
      console.log("Server running on port 5000")
    );
  })
  .catch(console.error);
