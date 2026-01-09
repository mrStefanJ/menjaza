const Message = require("../models/Message");
const Chat = require("../models/Chat");

module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // join konkretan chat
    socket.on("join-chat", async (chatId) => {
      socket.join(chatId);
    });

    // slanje poruke
    socket.on("send-message", async ({ chatId, text, userId }) => {
      const chat = await Chat.findById(chatId);

      if (!chat || !chat.participants.includes(userId)) {
        return;
      }

      const message = await Message.create({
        chat: chatId,
        sender: userId,
        text,
      });

      io.to(chatId).emit("new-message", message);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
};
