const router = require("express").Router();
const auth = require("../middleware/auth");
const controller = require("../controllers/auth.controller");

router.post("/register", controller.register);
router.post("/login", controller.login);
router.get("/me", auth, controller.me);
router.put("/me/password", auth, controller.changePassword);

module.exports = router;
