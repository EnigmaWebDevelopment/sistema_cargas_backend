const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const User = require("../models/user");

exports.signup = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.error(errors);
    return;
  }

  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  const cpf = req.body.cpf;
  const birth = req.body.birth;
  const tipe = req.body.tipe;

  try {
    const hashedPassword = await bcrypt.hash(password, 12);

    const uuid = uuidv4();

    const userDetails = {
      name: name,
      email: email,
      password: hashedPassword,
      uuid: uuid,
      cpf: cpf,
      birth: birth,
      tipe: tipe,
    };

    const result = await User.save(userDetails);

    res.status(201).json({ message: "Usuário registrado!" });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.login = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  try {
    const user = await User.find(email);

    if (user[0].length !== 1) {
      const error = new Error("Não foi encontrado um usuário com esse e-mail.");
      error.statusCode = 401;
      throw error;
    }

    const storedUser = user[0][0];

    const isEqual = await bcrypt.compare(password, storedUser.password);

    if (!isEqual) {
      const error = new Error("Senha incorreta!");
      error.statusCode = 401;
      throw error;
    }

    const token = jwt.sign(
      {
        email: storedUser.email,
        userId: storedUser.uuid,
      },
      "secretfortoken",
      { expiresIn: "1h" }
    );
    res.status(200).json({
      token: token,
      userId: storedUser.uuid,
      tipeUser: storedUser.tipe,
      name: storedUser.name,
      email: storedUser.email,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
