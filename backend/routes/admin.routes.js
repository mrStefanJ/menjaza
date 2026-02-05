const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin.controller");
const auth = require("../middleware/auth");

router.delete("/user/:id", auth, adminController.deleteUser);
router.put("/user/:id", auth, adminController.updateUserByAdmin);

module.exports = router;