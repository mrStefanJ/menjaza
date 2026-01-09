const mongoose = require("mongoose");
const User = require("../models/User");
const Album = require("../models/Albums");

/**
 * GET /api/exchange/albums
 * Vraća albume za koje postoji bar jedna moguća razmena
 */
exports.getExchangeAlbums = async (req, res) => {
  try {
    const userId = req.user.id;

    const me = await User.findById(userId)
      .select("albums")
      .lean();

    if (!me) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!me.albums?.length) {
      return res.json([]);
    }

    const albumIds = me.albums.map(a =>
      new mongoose.Types.ObjectId(a.albumId)
    );

    /* 1. Učitaj albume i napravi mapu */
    const albumsFromDb = await Album.find({
      _id: { $in: albumIds }
    })
      .select("title")
      .lean();

    const albumMap = new Map(
      albumsFromDb.map(a => [a._id.toString(), a.title])
    );

    /* 2. Učitaj druge korisnike */
    const otherUsers = await User.find({
      _id: { $ne: userId },
      "albums.albumId": { $in: albumIds }
    })
      .select("albums")
      .lean();

    const result = [];

    for (const myAlbum of me.albums) {
      const albumId = myAlbum.albumId.toString();

      const myMissing = new Set(myAlbum.missingStickers || []);
      const myDuplicates = new Set(myAlbum.duplicateStickers || []);

      if (!myMissing.size || !myDuplicates.size) continue;

      let exchangeUsers = 0;

      for (const user of otherUsers) {
        const theirAlbum = user.albums.find(
          a => a.albumId.toString() === albumId
        );

        if (!theirAlbum) continue;

        const theirMissing = new Set(theirAlbum.missingStickers || []);
        const theirDuplicates = new Set(theirAlbum.duplicateStickers || []);

        const haveForThem = [...myDuplicates].some(s =>
          theirMissing.has(s)
        );
        const haveForMe = [...theirDuplicates].some(s =>
          myMissing.has(s)
        );

        if (haveForThem && haveForMe) {
          exchangeUsers++;
        }
      }

      if (exchangeUsers > 0) {
        result.push({
          albumId,
          albumName: albumMap.get(albumId) || "Unknown album",
          exchangeUsers
        });
      }
    }

    res.json(result);
  } catch (err) {
    console.error("Exchange albums error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * GET /api/exchange/:albumId
 * Vraća korisnike sa kojima postoji razmena za dati album
 */
exports.getExchangeUsers = async (req, res) => {
  try {
    const userId = req.user.id;
    const { albumId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(albumId)) {
      return res.status(400).json({ message: "Invalid album ID" });
    }

    const me = await User.findById(userId).lean();
    if (!me) {
      return res.status(404).json({ message: "User not found" });
    }

    const myAlbum = me.albums.find(
      a => a.albumId.toString() === albumId
    );

    if (!myAlbum) {
      return res.status(404).json({ message: "Album not found for user" });
    }

    const myMissing = new Set(myAlbum.missingStickers || []);
    const myDuplicates = new Set(myAlbum.duplicateStickers || []);

    if (!myMissing.size || !myDuplicates.size) {
      return res.json([]);
    }

    const users = await User.find({
      _id: { $ne: userId },
      "albums.albumId": albumId
    })
      .select("userName firstName lastName city country albums")
      .lean();

    const exchanges = [];

    for (const user of users) {
      const album = user.albums.find(
        a => a.albumId.toString() === albumId
      );

      if (!album) continue;

      const theirMissing = new Set(album.missingStickers || []);
      const theirDuplicates = new Set(album.duplicateStickers || []);

      let haveForThem = 0;
      let haveForMe = 0;

      for (const s of myDuplicates) {
        if (theirMissing.has(s)) haveForThem++;
      }

      for (const s of theirDuplicates) {
        if (myMissing.has(s)) haveForMe++;
      }

      const exchangeCount = Math.min(haveForThem, haveForMe);

      if (exchangeCount > 0) {
        exchanges.push({
          userId: user._id,
          userName: user.userName,
          firstName: user.firstName,
          lastName: user.lastName,
          city: user.city,
          country: user.country,
          haveForThem,
          haveForMe,
          exchangeCount
        });
      }
    }

    exchanges.sort((a, b) => b.exchangeCount - a.exchangeCount);

    res.json(exchanges);
  } catch (err) {
    console.error("Exchange users error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
