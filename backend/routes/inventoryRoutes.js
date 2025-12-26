const express = require("express");
const router = express.Router();
const inventoryController = require("../controllers/inventoryController");

router.post("/", inventoryController.addItem);
router.get("/", inventoryController.getItems);
router.put("/:id", inventoryController.updateStock);

module.exports = router;
