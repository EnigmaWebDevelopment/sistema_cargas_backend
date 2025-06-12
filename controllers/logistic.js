const Logistic = require("../models/logistic");
const { v4: uuidv4 } = require("uuid");

exports.getProdutos = async (req, res, next) => {
  try {
    const products = await Logistic.getProducts();

    if (products[0].length == 0) {
      const error = new Error(
        "Não foram encontrados produtos cadastrados na base."
      );
      error.statusCode = 401;
      throw error;
    }

    res.status(200).json({ products: products[0] });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getDrivers = async (req, res, next) => {
  try {
    const drivers = await Logistic.getDrivers();

    if (drivers[0].length == 0) {
      const error = new Error(
        "Não foram encontrados motoristas cadastrados na base."
      );
      error.statusCode = 401;
      throw error;
    }

    res.status(200).json({ drivers: drivers[0] });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getDeliveries = async (req, res, next) => {
  try {
    const deliveries = await Logistic.getDeliveries();

    if (deliveries[0].length == 0) {
      const error = new Error(
        "Não foram encontradas entregas cadastradas na base."
      );
      error.statusCode = 401;
      throw error;
    }

    res.status(200).json({ deliveries: deliveries[0] });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getDeliveriesByDriver = async (req, res, next) => {
  const driver = req.body.uuid_driver;
  try {
    const deliveries = await Logistic.getDeliveriesByDriver(driver);

    if (deliveries[0].length == 0) {
      const error = new Error(
        "Não foram encontradas entregas cadastradas na base para esse motorista!"
      );
      error.statusCode = 401;
      throw error;
    }

    res.status(200).json({ deliveries: deliveries[0] });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getDeliveriesByOperator = async (req, res, next) => {
  const operator = req.body.uuid_operator;
  try {
    const deliveries = await Logistic.getDeliveriesByOperator(operator);

    if (deliveries[0].length == 0) {
      const error = new Error(
        "Não foram encontradas entregas cadastradas na base para esse operador logístico!"
      );
      error.statusCode = 401;
      throw error;
    }

    res.status(200).json({ deliveries: deliveries[0] });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.postDelivery = async (req, res, next) => {
  const uuid_driver = req.body.uuid_driver;
  const uuid_product = req.body.uuid_product;
  const uuid_operator = req.body.uuid_operator;
  const status = req.body.status;
  const quantity = req.body.quantity;
  const price = req.body.price;
  const entry = req.body.entry;
  const delivery = req.body.delivery;
  const cep = req.body.cep;
  const address_description = req.body.address_description;

  const uuid = uuidv4();

  const logisticDetails = {
    uuid: uuid,
    uuid_driver: uuid_driver,
    uuid_product: uuid_product,
    status: status,
    quantity: quantity,
    price: price,
    entry: entry,
    delivery: delivery,
    cep: cep,
    address_description: address_description,
    uuid_operator: uuid_operator,
  };
  try {
    const deliveryResponse = await Logistic.postDelivery(logisticDetails);
    res
      .status(200)
      .json({ response: "Entrega cadastrada com sucesso! ", deliveryResponse });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.putStatus = async (req, res, next) => {
  const uuid_delivery = req.body.uuid_delivery;
  const status = req.body.status;

  const logisticDetails = {
    uuid_delivery: uuid_delivery,
    status: status,
  };
  try {
    const deliveryResponse = await Logistic.putStatus(logisticDetails);
    res.status(200).json({
      response: "Status de entrega atualizado com sucesso! ",
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
