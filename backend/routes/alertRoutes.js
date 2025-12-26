const express = require("express");
const router = express.Router();
const controller = require("../controllers/alertController");

router.get("/low-stock", controller.lowStock);
router.get("/dead-stock", controller.deadStock);

module.exports = router;
