const express = require("express");
const subRouter = express.Router();
const {
  createSubscription,
  getSubscriptions,
  getSubscriptionById,
  updateSubscription,
  deleteSubscription,
  updateReminderSettings,
  getSubscriptionStats,
} = require("../controllers/subscription");
const { isAuth } = require('../../middleware/auth');

// Crear una nueva suscripción
subRouter.post("/", isAuth, createSubscription);

// Obtener todas las suscripciones del usuario logueado
subRouter.get("/", isAuth, getSubscriptions);

// Obtener stats generales
subRouter.get("/stats", isAuth, getSubscriptionStats);

// Actualizar configuración de recordatorios
subRouter.put("/:subscriptionId/reminders", isAuth, updateReminderSettings);

// Obtener una suscripción específica por ID
subRouter.get("/:subscriptionId", isAuth, getSubscriptionById);

// Actualizar una suscripción
subRouter.put("/:subscriptionId", isAuth, updateSubscription);

// Eliminar una suscripción
subRouter.delete("/:subscriptionId", isAuth, deleteSubscription);

module.exports = subRouter;
