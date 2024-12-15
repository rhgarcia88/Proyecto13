const User = require('../models/User');

const checkPremiumStatus = async (req, res, next) => {
  try {
    const userId = req.userId; // El ID del usuario está en req.userId después de autenticación
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json("User not found");
    }

    // Verificar si el usuario es premium y si la suscripción ha expirado
    if (user.isPremium && user.premiumExpiresAt < new Date()) {
      // Si la suscripción ha expirado, actualizar isPremium a false
      user.isPremium = false;
      user.premiumExpiresAt = null;
      await user.save();
    }

    // Permitir el acceso si el usuario es premium
    if (user.isPremium) {
      next();
    } else {
      return res.status(403).json("Access denied: Premium membership required.");
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json("Internal server error");
  }
};

module.exports = checkPremiumStatus;
