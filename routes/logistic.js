const express = require("express");
const router = express.Router();
const logisticController = require("../controllers/logistic");

router.get("/getProducts", logisticController.getProdutos);

router.get("/getDeliveries", logisticController.getDeliveries);
router.get("/getDrivers", logisticController.getDrivers);
router.post("/getDeliveriesByDriver", logisticController.getDeliveriesByDriver);
router.post(
  "/getDeliveriesByOperator",
  logisticController.getDeliveriesByOperator
);
router.post("/postDelivery", logisticController.postDelivery);

module.exports = router;
