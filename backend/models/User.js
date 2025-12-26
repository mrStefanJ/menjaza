const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    userName: { type: String, required: true },
    role: { type: String, default: "user" },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    city: { type: String, default: "" },
    country: {
      type: String,
      enum: [
        "",
        "Srbija",
        "Hrvatska",
        "Slovenija",
        "Severna Makedonija",
        "Crna Gora",
        "Bosna i Hercegovina",
      ],
      default: "",
    },
    albums: [
      {
        albumId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Album",
          required: true,
        },
        missingStickers: {
          type: [Number],
          default: [],
        },
        duplicateStickers: {
          type: [Number],
          default: [],
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
