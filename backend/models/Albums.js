const mongoose = require("mongoose");

const AlbumSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    year: { type: Number, required: true },
    publisher: { type: String, required: true },
    category: { type: String, required: true }, // Football, Entertainment
    competition: { type: String },
    stickersCount: { type: Number },
    region: { type: String },
    franchise: { type: String }, // Disney, FIFA, Marvel
    type: { type: String, default: "sticker_album" },
    cover: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Album", AlbumSchema);
