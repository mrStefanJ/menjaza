const mongoose = require("mongoose");
const Chat = require("../models/Chat");
const Message = require("../models/Message");

// create or get chat 
exports.getOrCreateChat = async (req, res) => {
  const me = req.user.id;
  const { userId, albumId } = req.body;

  const participants = [me, userId].sort();

  let chat = await Chat.findOne({
    participants,
    album: albumId,
  });

  if (!chat) {
    chat = await Chat.create({
      participants,
      album: albumId,
    });
  }

  res.json(chat);
};

// get a message
exports.getMessages = async (req, res) => {
  const messages = await Message.find({
    chat: req.params.chatId,
  }).sort("createdAt");

  res.json(messages);
};

exports.sendMessage = async (req, res) => {
  const message = await Message.create({
    chat: req.body.chatId,
    sender: req.user.id,
    text: req.body.text,
  });

  // emit preko socket.io
  req.io.to(req.body.chatId).emit("new-message", message);

  res.json(message);
};
