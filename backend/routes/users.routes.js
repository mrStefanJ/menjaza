const router = require("express").Router();
const auth = require("../middleware/auth");
const controller = require("../controllers/users.controller");

/**
 * GET /api/users/me
 * Vrati podatke trenutno ulogovanog korisnika
 */
router.get("/me", auth, controller.getMe);

/**
 * GET /api/users/all
 * Vrati spisak svih user-a
 */

router.get("/", auth, controller.getAllUsers);
/**
 * PUT /api/users/me
 * Update osnovnih podataka profila
 */
router.put("/me", auth, controller.updateMe);

/**
 * PUT /api/users/me/albums
 * Dodavanje albuma korisniku
 */
router.put("/me/albums", auth, controller.addAlbum);

/**
 * DELETE /api/users/me/albums/:albumId
 * Uklanjanje albuma korisniku
 */
router.delete("/me/albums/:albumId", auth, controller.removeAlbum);

// PUT /api/users/me/albums/:albumId/stickers
router.put(
  "/me/albums/:albumId/stickers",
  auth,
  controller.saveUserStickers
);

module.exports = router;
