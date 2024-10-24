const Map = require("../models/map.models");

// Create and Save a new Map!
exports.create = async (req, res) => {
  const { name, address, direction, lat, lng, radius} = req.body;

  // Validate Data
  if (!name || !address || !direction || !lat || !lng || !radius) {
    return res.status(400).send({
      message: "Name, Address, or Direction cannot be empty!",
    });
  }

  try {
    const existingMap = await Map.findOne({ where: { name } });
    if (existingMap) {
      return res.status(400).send({ message: "Map already exists!" });
    }

    // Create a Map
    const newMap = { name, address, direction, lat, lng, radius };
    const data = await Map.create(newMap);
    res.send(data);
  } catch (error) {
    res.status(500).send({
      message: error.message || "An error occurred while creating the map.",
    });
  }
};

// Get all maps
exports.getAll = async (req, res) => {
  try {
    const data = await Map.findAll();
    res.send(data);
  } catch (error) {
    res.status(500).send({
      message: error.message || "An error occurred while retrieving the maps.",
    });
  }
};

// Get map by ID
exports.getById = async (req, res) => {
  const id = req.params.id;
  try {
    const data = await Map.findByPk(id);
    if (!data) {
      return res.status(404).send({ message: "Map not found with id " + id });
    }
    res.send(data);
  } catch (error) {
    res.status(500).send({
      message: error.message || "An error occurred while retrieving the map.",
    });
  }
};

// Update a map
exports.update = async (req, res) => {
  const id = req.params.id;
  try {
    const [num] = await Map.update(req.body, { where: { id } });
    if (num === 1) {
      res.send({ message: "Map was updated successfully." });
    } else {
      res.status(404).send({
        message: `Cannot update Map with id=${id}. Maybe Map was not found or req.body is empty!`,
      });
    }
  } catch (error) {
    res.status(500).send({
      message: error.message || "An error occurred while updating the map.",
    });
  }
};

// Delete a map
exports.delete = async (req, res) => {
  const id = req.params.id;
  try {
    const num = await Map.destroy({ where: { id } });
    if (num === 1) {
      res.send({ message: "Map was deleted successfully." });
    } else {
      res.status(404).send({ message: `Cannot delete Map with id=${id}.` });
    }
  } catch (error) {
    res.status(500).send({
      message: error.message || "An error occurred while deleting the map.",
    });
  }
};