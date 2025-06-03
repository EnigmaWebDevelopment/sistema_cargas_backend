const db = require("../util/database");

module.exports = class User {
  constructor(uuid, name, email, password, cpf, birth) {
    this.uuid = uuid;
    this.name = name;
    this.email = email;
    this.password = password;
    this.cpf = cpf;
    this.birth = birth;
    this.tipe = tipe;
  }

  static find(email) {
    return db.execute("SELECT * FROM users WHERE email = ?", [email]);
  }

  static save(user) {
    return db.execute(
      "INSERT INTO users (uuid, name, email, password, cpf, birth, tipe) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [
        user.uuid,
        user.name,
        user.email,
        user.password,
        user.cpf,
        user.birth,
        user.tipe,
      ]
    );
  }
};
