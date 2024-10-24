const express = require("express");
const router = express.Router();
const mapController = require("../controllers/map.controller");
const { authJwt } = require("../middleware");

// Create a map
router.post("/", 
  [authJwt.verifyToken, authJwt.isAdminOrMod],
   mapController.create);

// Get all maps
router.get("/", mapController.getAll);

// Get map by ID
router.get("/:id", [authJwt.verifyToken], mapController.getById);

// Update a map
router.put(
  "/:id",
  [authJwt.verifyToken, authJwt.isAdminOrMod],
  mapController.update
);

// Delete a map
router.delete(
  "/:id",
  [authJwt.verifyToken, authJwt.isAdmin],
  mapController.delete
);

module.exports = router;
