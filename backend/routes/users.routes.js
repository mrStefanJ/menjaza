const router = require("express").Router();
const auth = require("../middleware/auth");
const controller = require("../controllers/users.controller");

/**
 * GET /api/users/me
 * Vrati podatke trenutno ulogovanog korisnika
 */
router.get("/me", auth, controller.getMe);

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

module.exports = router;
