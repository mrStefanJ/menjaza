const router = require("express").Router();
const auth = require("../middleware/auth");
const exchangeController = require("../controllers/exchange.controller");

router.get("/test", (req, res) => {
  res.json({ ok: true });
});

router.get("/albums", auth, exchangeController.getExchangeAlbums);
router.get("/:albumId", auth, exchangeController.getExchangeUsers);

module.exports = router;
