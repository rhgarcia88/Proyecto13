const { verifyJwt } = require("../config/jwt");
const User = require("../api/models/user");

const isAuth = async (req, res, next) => {
  try {
    // Verifica si el token está presente
    const token = req.headers.authorization;
    if (!token || !token.startsWith("Bearer ")) {
      return res.status(401).json({ error: "No estás autorizado. Token faltante o inválido." });
    }

    // Extraer el token sin el prefijo 'Bearer '
    const parsedToken = token.replace("Bearer ", "");

    // Verifica y decodifica el token
    const { id } = verifyJwt(parsedToken); // Asegúrate de que verifyJwt retorna un objeto con { id }

    // Busca el usuario en la base de datos
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    // Limpia datos sensibles antes de asignar el usuario al request
    user.password = undefined; // Borra la contraseña por seguridad
    req.user = user; // Agrega el usuario al objeto request para usarlo en los controladores

    next(); // Pasa al siguiente middleware o controlador
  } catch (error) {
    console.error("Error en el middleware de autenticación:", error.message);
    return res.status(401).json({ error: "Token inválido o sesión expirada. Inicia sesión nuevamente." });
  }
};

module.exports = { isAuth };
