const Subscription = require("../models/subscription");
const DefaultSubscription = require("../models/defaultSubscription");

// Crear una nueva suscripción
const createSubscription = async (req, res) => {
  try {
    const { defaultSubscriptionId, name, cost, startDate, renewalFrequency, category, notes } = req.body;
    let subscriptionData = {};

    if (defaultSubscriptionId) {
      // Caso: Basado en una DefaultSubscription
      const defaultSub = await DefaultSubscription.findById(defaultSubscriptionId);
      if (!defaultSub) {
        return res.status(404).json({ error: "Default subscription not found" });
      }

      subscriptionData = {
        name: defaultSub.name,
        cost,
        startDate: new Date(startDate),
        renewalFrequency,
        category: defaultSub.category,
        notes,
        logoURL: defaultSub.logoURL,
        defaultSubscription: defaultSub._id,
        user: req.user.id, // ID del usuario logueado (proporcionado por middleware auth)
      };
    } else {
      // Caso: Personalizado
      subscriptionData = {
        name,
        cost,
        startDate: new Date(startDate),
        renewalFrequency,
        category,
        notes,
        logoURL: "https://example.com/default-logo.png", // Imagen predeterminada
        user: req.user.id,
      };
    }

    const newSubscription = new Subscription(subscriptionData);
    await newSubscription.save();

    return res.status(201).json(newSubscription);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error creando la suscripción" });
  }
};

// Obtener todas las suscripciones del usuario logueado
const getSubscriptions = async (req, res) => {
  try {
    const subscriptions = await Subscription.find({ user: req.user.id }).populate("defaultSubscription");
    return res.status(200).json(subscriptions);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error obteniendo las suscripciones" });
  }
};


// Obtener una suscripción específica con estadísticas
const getSubscriptionById = async (req, res) => {
  try {
    const { subscriptionId } = req.params;

    // Buscar la suscripción por ID y usuario
    const subscription = await Subscription.findOne({ _id: subscriptionId, user: req.user.id }).populate("defaultSubscription");

    if (!subscription) {
      return res.status(404).json({ error: "Suscripción no encontrada" });
    }

    // Estadísticas básicas (para todos los usuarios)
    const totalPaid = subscription.paymentHistory.reduce(
      (sum, record) => sum + record.amount * record.times,
      0
    );

    const totalPayments = subscription.paymentHistory.reduce(
      (sum, record) => sum + record.times,
      0
    );

    const averageCostPerPayment = totalPayments > 0 ? (totalPaid / totalPayments).toFixed(2) : 0;

    const reminder = {
      isActive: subscription.reminderSettings.isActive,
      nextReminderDate: subscription.reminderDate,
    };

    const recentPayments = subscription.paymentHistory
      .slice(-3)
      .map((record) => ({
        date: record.paidDates.slice(-1)[0], // Última fecha en el array
        amount: record.amount,
      }));

    const category = subscription.category || "Other";

    // Estadísticas avanzadas (solo para premium)
    let advancedStats = {};
    if (req.user.isPremium) {
      // Calcular meses activos desde el inicio
      const startDate = new Date(subscription.startDate);
      const today = new Date();
      const monthsActive =
        (today.getFullYear() - startDate.getFullYear()) * 12 +
        (today.getMonth() - startDate.getMonth()) +
        1; // +1 para contar el mes actual

      const averageMonthlyCost = monthsActive > 0 ? (totalPaid / monthsActive).toFixed(2) : 0;

      const annualProjectedCost = (averageMonthlyCost * 12).toFixed(2);

      // Comparación del costo
      const subscriptions = await Subscription.find({ user: req.user.id });
      const allCosts = subscriptions.map((sub) => sub.cost);
      const maxCost = Math.max(...allCosts);
      const minCost = Math.min(...allCosts);

      let costComparison = "Average";
      if (subscription.cost === maxCost) costComparison = "Most Expensive";
      if (subscription.cost === minCost) costComparison = "Least Expensive";

      // Determinar la tendencia de costos
      const paymentAmounts = subscription.paymentHistory.map((record) => record.amount);
      let costTrend = "Stable";
      if (paymentAmounts.length > 1) {
        const lastPayment = paymentAmounts[paymentAmounts.length - 1];
        const previousPayment = paymentAmounts[paymentAmounts.length - 2];
        if (lastPayment > previousPayment) costTrend = "Increasing";
        else if (lastPayment < previousPayment) costTrend = "Decreasing";
      }

      advancedStats = {
        averageMonthlyCost,
        annualProjectedCost,
        costComparison,
        costTrend,
      };
    }

    // Respuesta con estadísticas
    return res.status(200).json({
      subscription,
      stats: {
        totalPaid: totalPaid.toFixed(2),
        totalPayments,
        averageCostPerPayment,
        recentPayments,
        reminder,
        category,
        ...advancedStats, // Incluye avanzadas solo si es premium
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error obteniendo la suscripción" });
  }
};



// Actualizar una suscripción
const updateSubscription = async (req, res) => {
  try {
    const { subscriptionId } = req.params;
    const { name, cost, startDate, renewalFrequency, category, notes, reminderSettings } = req.body;

    const subscription = await Subscription.findOneAndUpdate(
      { _id: subscriptionId, user: req.user.id },
      { name, cost, startDate, renewalFrequency, category, notes, reminderSettings },
      { new: true }
    );

    if (!subscription) {
      return res.status(404).json({ error: "Suscripción no encontrada" });
    }

    return res.status(200).json(subscription);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error actualizando la suscripción" });
  }
};

// Eliminar una suscripción
const deleteSubscription = async (req, res) => {
  try {
    const { subscriptionId } = req.params;

    const subscription = await Subscription.findOneAndDelete({ _id: subscriptionId, user: req.user.id });

    if (!subscription) {
      return res.status(404).json({ error: "Suscripción no encontrada" });
    }

    return res.status(200).json({ message: "Suscripción eliminada correctamente" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error eliminando la suscripción" });
  }
};

// Actualizar configuración de recordatorios
const updateReminderSettings = async (req, res) => {
  try {
    const { subscriptionId } = req.params;
    const { isActive, daysBefore } = req.body;

    const subscription = await Subscription.findOneAndUpdate(
      { _id: subscriptionId, user: req.user.id },
      { "reminderSettings.isActive": isActive, "reminderSettings.daysBefore": daysBefore },
      { new: true }
    );

    if (!subscription) {
      return res.status(404).json({ error: "Suscripción no encontrada" });
    }

    return res.status(200).json(subscription);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error actualizando los recordatorios" });
  }
};


const getUserSubscriptionStats = async (req, res) => {
  try {
    const userId = req.user.id;
    const subscriptions = await Subscription.find({ user: userId });

    if (!subscriptions.length) {
      return res.status(200).json({ message: "No se encontraron suscripciones para el usuario." });
    }

    // 1. Número Total de Suscripciones
    const totalSubscriptions = subscriptions.length;

    // 2. Gasto Total Mensual
    const totalMonthlyCost = subscriptions.reduce((acc, sub) => {
      const monthlyCost = sub.renewalFrequency === "daily"
        ? sub.cost * 30
        : sub.renewalFrequency === "weekly"
        ? sub.cost * 4.33
        : sub.renewalFrequency === "yearly"
        ? sub.cost / 12
        : sub.cost; // "monthly" o default
      return acc + monthlyCost;
    }, 0);

    // 3. Categorías de Suscripciones
    const categories = subscriptions.reduce((acc, sub) => {
      acc[sub.category] = (acc[sub.category] || 0) + 1;
      return acc;
    }, {});

    // 4. Suscripción Más Costosa
    const mostExpensiveSubscription = subscriptions.reduce((max, sub) =>
      sub.cost > max.cost ? sub : max
    );

    // 5. Suscripción Más Económica
    const cheapestSubscription = subscriptions.reduce((min, sub) =>
      sub.cost < min.cost ? sub : min
    );

    // 6. Próximas Renovaciones (Top 3)
    const upcomingRenewals = subscriptions
      .filter((sub) => sub.nextRenewalDate)
      .sort((a, b) => new Date(a.nextRenewalDate) - new Date(b.nextRenewalDate))
      .slice(0, 3)
      .map((sub) => ({
        name: sub.name,
        nextRenewalDate: sub.nextRenewalDate,
      }));

    // 7. Promedio de Costo por Suscripción
    const averageCostPerSubscription = totalMonthlyCost / totalSubscriptions;

    // 9. Historial de Pagos Totales
    const totalPayments = subscriptions.reduce((acc, sub) => {
      const historyTotal = sub.paymentHistory.reduce(
        (sum, record) => sum + record.amount * record.times,
        0
      );
      return acc + historyTotal;
    }, 0);

    // 11. Porcentaje de Categorías
    const categoryPercentage = Object.entries(categories).reduce((acc, [key, value]) => {
      acc[key] = ((value / totalSubscriptions) * 100).toFixed(2);
      return acc;
    }, {});

    // 12. Mes con Más Gastos
    const monthlySpending = {};
    subscriptions.forEach((sub) => {
      sub.paymentHistory.forEach((record) => {
        record.paidDates.forEach((date) => {
          const month = new Date(date).toLocaleString("en-US", { month: "long", year: "numeric" });
          monthlySpending[month] = (monthlySpending[month] || 0) + record.amount;
        });
      });
    });

    const [mostExpensiveMonth, mostExpensiveMonthSpent] = Object.entries(monthlySpending).reduce(
      (max, [month, spent]) => (spent > max[1] ? [month, spent] : max),
      ["", 0]
    );

    // Respuesta Final
    return res.status(200).json({
      totalSubscriptions,
      totalMonthlyCost: totalMonthlyCost.toFixed(2),
      categories,
      mostExpensiveSubscription: {
        name: mostExpensiveSubscription.name,
        cost: mostExpensiveSubscription.cost,
      },
      cheapestSubscription: {
        name: cheapestSubscription.name,
        cost: cheapestSubscription.cost,
      },
      upcomingRenewals,
      averageCostPerSubscription: averageCostPerSubscription.toFixed(2),
      totalPayments: totalPayments.toFixed(2),
      categoryPercentage,
      mostExpensiveMonth: {
        month: mostExpensiveMonth,
        totalSpent: mostExpensiveMonthSpent.toFixed(2),
      },
    });
  } catch (error) {
    console.error("Error obteniendo estadísticas de suscripciones:", error.message);
    return res.status(500).json({ error: "Error obteniendo estadísticas de suscripciones." });
  }
};

const getFreeSubscriptionStats = async (req, res) => {
  try {
    const userId = req.user.id;
    const subscriptions = await Subscription.find({ user: userId });

    if (!subscriptions.length) {
      return res.status(200).json({ message: "No se encontraron suscripciones para el usuario." });
    }

    // Número Total de Suscripciones
    const totalSubscriptions = subscriptions.length;

    // Gasto Total Mensual
    const totalMonthlyCost = subscriptions.reduce((acc, sub) => {
      const monthlyCost = sub.renewalFrequency === "daily"
        ? sub.cost * 30
        : sub.renewalFrequency === "weekly"
        ? sub.cost * 4.33
        : sub.renewalFrequency === "yearly"
        ? sub.cost / 12
        : sub.cost;
      return acc + monthlyCost;
    }, 0);

    // Categorías Básicas
    const categories = subscriptions.reduce((acc, sub) => {
      acc[sub.category] = (acc[sub.category] || 0) + 1;
      return acc;
    }, {});

    // Próximas Renovaciones (1-3 Máximo)
    const upcomingRenewals = subscriptions
      .filter((sub) => sub.nextRenewalDate)
      .sort((a, b) => new Date(a.nextRenewalDate) - new Date(b.nextRenewalDate))
      .slice(0, 3)
      .map((sub) => ({
        name: sub.name,
        nextRenewalDate: sub.nextRenewalDate,
      }));

    return res.status(200).json({
      totalSubscriptions,
      totalMonthlyCost: totalMonthlyCost.toFixed(2),
      categories,
      upcomingRenewals,
    });
  } catch (error) {
    console.error("Error obteniendo estadísticas gratuitas:", error.message);
    return res.status(500).json({ error: "Error obteniendo estadísticas gratuitas." });
  }
};

const getSubscriptionStats = async (req, res) => {
  try {
    if (req.user.isPremium) {
      // Usuario Premium: Retorna estadísticas completas
      return getUserSubscriptionStats(req, res);
    } else {
      // Usuario Free: Retorna estadísticas básicas
      return getFreeSubscriptionStats(req, res);
    }
  } catch (error) {
    console.error("Error obteniendo estadísticas:", error.message);
    return res.status(500).json({ error: "Error obteniendo estadísticas." });
  }
};


module.exports = {
  createSubscription,
  getSubscriptions,
  getSubscriptionById,
  updateSubscription,
  deleteSubscription,
  updateReminderSettings,
  getSubscriptionStats,

};
