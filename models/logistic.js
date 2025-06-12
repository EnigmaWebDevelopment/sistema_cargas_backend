const db = require("../util/database");

module.exports = class Logistic {
  constructor() {}

  static getProducts() {
    {
      return db.execute("SELECT * FROM products");
    }
  }

  static getDeliveries() {
    {
      return db.execute("SELECT * FROM deliveries");
    }
  }

  static getDrivers() {
    {
      return db.execute(
        "SELECT uuid as uuid_driver, name FROM users where tipe = 'M'"
      );
    }
  }

  static getDeliveriesByDriver(uuid_driver) {
    return db.execute(
      `SELECT deliveries.price, deliveries.quantity, deliveries.address_description, deliveries.status, 
                              deliveries.entry, deliveries.delivery, deliveries.cep, deliveries.uuid_driver,
                              deliveries.uuid_product, deliveries.uuid_operator, deliveries.uuid,
                              users.name as 'username_driver',
                              products.description as 'product_description'
                         FROM deliveries 
                        INNER JOIN users on users.uuid = deliveries.uuid_driver
                        INNER JOIN products on products.uuid = deliveries.uuid_product
                        WHERE uuid_driver = ?`,
      [uuid_driver]
    );
  }

  static getDeliveriesByOperator(uuid_operator) {
    return db.execute(
      `SELECT deliveries.price, deliveries.quantity, deliveries.address_description, deliveries.status, 
                              deliveries.entry, deliveries.delivery, deliveries.cep, deliveries.uuid_driver,
                              deliveries.uuid_product, deliveries.uuid_operator,
                              users.name as 'username_driver',
                              products.description as 'product_description'
                         FROM deliveries 
                        INNER JOIN users on users.uuid = deliveries.uuid_driver
                        INNER JOIN products on products.uuid = deliveries.uuid_product
                        WHERE uuid_operator = ?`,
      [uuid_operator]
    );
  }

  static postDelivery(logisticDetails) {
    return db.execute(
      "INSERT INTO deliveries (uuid, uuid_driver, uuid_product, uuid_operator, status, quantity, price, entry, delivery, cep, address_description) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        logisticDetails.uuid,
        logisticDetails.uuid_driver,
        logisticDetails.uuid_product,
        logisticDetails.uuid_operator,
        logisticDetails.status,
        logisticDetails.quantity,
        logisticDetails.price,
        logisticDetails.entry,
        logisticDetails.delivery,
        logisticDetails.cep,
        logisticDetails.address_description,
      ]
    );
  }

  static putStatus(logisticDetails) {
    return db.execute("UPDATE deliveries SET status = ? WHERE uuid = ?", [
      logisticDetails.status,
      logisticDetails.uuid_delivery,
    ]);
  }
};
