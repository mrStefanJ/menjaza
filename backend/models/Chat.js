const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    album: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Album",
      required: true,
    },
    lastMessage: {
      type: String,
    },
  },
  { timestamps: true }
);

chatSchema.index({ participants: 1, album: 1 }, { unique: true });

module.exports = mongoose.model("Chat", chatSchema);
