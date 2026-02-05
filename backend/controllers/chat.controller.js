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
  }).populate("participants", "name");

  if (!chat) {
    chat = await Chat.create({
      participants,
      album: albumId,
    });

    chat = await chat.populate("participants", "name");
  }

  // pronađi "drugog" korisnika
  const otherUser = chat.participants.find(
    (u) => u._id.toString() !== me
  );

  res.json({
    _id: chat._id,
    otherUser: {
      id: otherUser._id,
      name: otherUser.name,
    },
  });
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
