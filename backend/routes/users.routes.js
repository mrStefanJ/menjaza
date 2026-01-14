const router = require("express").Router();
const auth = require("../middleware/auth");
const controller = require("../controllers/users.controller");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../public/image"));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

router.get("/me", auth, controller.getMe);
router.get("/", auth, controller.getAllUsers);
router.put("/me", auth, upload.single("profileImage"), controller.updateMe);
router.put("/me/albums", auth, controller.addAlbum);
router.delete("/me/albums/:albumId", auth, controller.removeAlbum);
router.put("/me/albums/:albumId/stickers", auth, controller.saveUserStickers);

module.exports = router;
