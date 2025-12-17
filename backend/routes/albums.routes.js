const router = require("express").Router();
const controller = require("../controllers/albums.controller");
const auth = require("../middleware/auth");

router.get("/", auth, controller.getAll);
router.get("/:id", auth, controller.getById);

module.exports = router;
