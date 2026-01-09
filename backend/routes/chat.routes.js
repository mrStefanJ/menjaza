const router = require("express").Router();
const auth = require("../middleware/auth");
const chatController = require("../controllers/chat.controller");

// router.get("/test", (req, res) => {
//   res.json({ ok: true });
// });

router.post("/", auth, chatController.getOrCreateChat);
router.get("/:chatId/messages", auth, chatController.getMessages);
router.post("/message", auth, chatController.sendMessage);

module.exports = router;