const express = require("express");
const router = express.Router();
const User = require("../models/user");
const authController = require("../controllers/auth");
const { body, validationResult } = require("express-validator");

function isValidCPF(cpf) {
  cpf = cpf.replace(/[^\d]+/g, "");
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;

  let sum = 0;
  for (let i = 0; i < 9; i++) sum += parseInt(cpf.charAt(i)) * (10 - i);
  let rev = 11 - (sum % 11);
  if (rev === 10 || rev === 11) rev = 0;
  if (rev !== parseInt(cpf.charAt(9))) return false;

  sum = 0;
  for (let i = 0; i < 10; i++) sum += parseInt(cpf.charAt(i)) * (11 - i);
  rev = 11 - (sum % 11);
  if (rev === 10 || rev === 11) rev = 0;
  return rev === parseInt(cpf.charAt(10));
}

function isOver18(dateString) {
  const today = new Date();
  const birthDate = new Date(dateString);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age >= 18;
}

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      errors: errors.array().map((err) => ({
        campo: err.param,
        mensagem: err.msg,
      })),
    });
  }
  next();
};

router.post(
  "/signup",
  [
    body("name").trim().not().isEmpty().withMessage("O nome é obrigatório."),

    body("email")
      .isEmail()
      .withMessage("Por favor, insira um e-mail válido.")
      .custom(async (email) => {
        const user = await User.find(email);
        if (user[0].length > 0) {
          return Promise.reject("Este e-mail já está cadastrado.");
        }
      })
      .normalizeEmail(),

    body("password")
      .trim()
      .isLength({ min: 8 })
      .withMessage("A senha deve ter pelo menos 8 caracteres.")
      .matches(/[A-Z]/)
      .withMessage("A senha deve conter pelo menos uma letra maiúscula.")
      .matches(/[a-z]/)
      .withMessage("A senha deve conter pelo menos uma letra minúscula.")
      .matches(/[0-9]/)
      .withMessage("A senha deve conter pelo menos um número.")
      .matches(/[@$!%*?&]/)
      .withMessage(
        "A senha deve conter pelo menos um caractere especial (@, $, !, %, *, ?, &)."
      ),

    body("cpf").custom((cpf) => {
      if (!isValidCPF(cpf)) {
        throw new Error("CPF inválido.");
      }
      return true;
    }),

    body("birth")
      .isISO8601()
      .withMessage("Data de nascimento inválida. Use o formato AAAA-MM-DD.")
      .custom((value) => {
        if (!isOver18(value)) {
          throw new Error("Você deve ter pelo menos 18 anos.");
        }
        return true;
      }),

    body("tipe")
      .trim()
      .notEmpty()
      .withMessage("O tipo de usuário é obrigatório."),
    validateRequest,
  ],
  authController.signup
);

router.post("/login", authController.login);

module.exports = router;
