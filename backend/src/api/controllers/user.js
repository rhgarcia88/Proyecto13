const { generateSign } = require("../../config/jwt");
const bcrypt = require("bcrypt");
const User = require("../models/user");

// Helper para unificar errores
const sendError = (res, status, code, message) => {
  return res.status(status).json({ error: { code, message } });
};

// Obtener listado de monedas
const getCurrencies = async (req, res) => {
  try {
    const currencies = require("../../utils/currencies.json");
    return res.status(200).json(currencies);
  } catch (error) {
    console.error(error);
    return res.status(500).json("Error al obtener las monedas");
  }
};

// Obtener perfil del usuario autenticado
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    return res.status(200).json(user);
  } catch (err) {
    console.error(err);
    return res.status(500).json("Error al obtener el perfil del usuario");
  }
};

// Registrar nuevo usuario
const register = async (req, res) => {
  try {
    const exists = await User.findOne({
      $or: [
        { userName: req.body.userName },
        { email: req.body.email }
      ]
    });
    if (exists) {
      return sendError(
        res,
        409,
        "USER_ALREADY_EXISTS",
        "Ya existe un usuario con ese email o nombre de usuario."
      );
    }

    const newUser = new User({
      userName: req.body.userName,
      email: req.body.email,
      password: req.body.password,
    });
    const saved = await newUser.save();
    const { password, ...userWithoutPassword } = saved.toObject();
    return res.status(201).json({ user: userWithoutPassword });
  } catch (err) {
    console.error(err);
    return sendError(
      res,
      500,
      "REGISTER_FAILED",
      "Error al crear la cuenta. Inténtalo más tarde."
    );
  }
};

// Login de usuario
const login = async (req, res) => {
  try {
    const lookup = req.body.email
      ? { email: req.body.email }
      : { userName: req.body.userName };
    const user = await User.findOne(lookup);

    if (!user) {
      return sendError(
        res,
        404,
        "USER_NOT_FOUND",
        "No hay ninguna cuenta con ese correo o usuario."
      );
    }

    const isMatch = bcrypt.compareSync(req.body.password, user.password);
    if (!isMatch) {
      return sendError(
        res,
        401,
        "INVALID_PASSWORD",
        "La contraseña es incorrecta."
      );
    }

    const token = generateSign(user._id);
    const { password, ...userWithoutPassword } = user.toObject();
    return res.status(200).json({ userWithoutPassword, token });
  } catch (err) {
    console.error(err);
    return sendError(
      res,
      500,
      "LOGIN_FAILED",
      "Error al iniciar sesión. Inténtalo de nuevo más tarde."
    );
  }
};

// Actualizar moneda preferida
const setCurrency = async (req, res) => {
  try {
    if (!req.body.currency) {
      return res.status(400).json({ error: "Currency is required" });
    }
    const updated = await User.findByIdAndUpdate(
      req.user.id,
      { currency: req.body.currency },
      { new: true }
    ).select("-password");
    if (!updated) {
      return res.status(404).json({ error: "User not found" });
    }
    return res.status(200).json(updated);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Error actualizando la moneda" });
  }
};

// Convertir usuario a premium
const makePremium = async (req, res) => {
  try {
    const userId = req.params.userId;
    const premiumDuration = 30; // días
    const premiumExpiresAt = new Date();
    premiumExpiresAt.setDate(premiumExpiresAt.getDate() + premiumDuration);

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { isPremium: true, premiumExpiresAt },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json("User not found");
    }

    return res.status(200).json(updatedUser);
  } catch (err) {
    console.error(err);
    return res.status(500).json("Error al actualizar a usuario premium");
  }
};

module.exports = {
  getCurrencies,
  getUserProfile,
  register,
  login,
  setCurrency,
  makePremium,
};
