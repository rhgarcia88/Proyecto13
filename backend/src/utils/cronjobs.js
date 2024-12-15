const cron = require("node-cron");
const User = require("../api/models/user");
const Subscription = require("../api/models/subscription");
const sendReminder = require("./sendReminder");

// Truncar a medianoche UTC
function truncateToMidnight(date) {
  if (!date) return null;
  const d = new Date(date);
  d.setUTCHours(0, 0, 0, 0);
  return d;
}

function addFrequency(date, frequency) {
  const d = new Date(date);
  switch (frequency) {
    case "daily":
      d.setUTCDate(d.getUTCDate() + 1);
      break;
    case "weekly":
      d.setUTCDate(d.getUTCDate() + 7);
      break;
    case "monthly":
      d.setUTCMonth(d.getUTCMonth() + 1);
      break;
    case "yearly":
      d.setUTCFullYear(d.getUTCFullYear() + 1);
      break;
    default:
      console.warn(`Frecuencia de renovación desconocida: ${frequency}`);
  }
  return truncateToMidnight(d);
}

function calculateReminderDate(nextRenewalDate, daysBefore) {
  if (!nextRenewalDate || daysBefore == null) return null;
  const d = new Date(nextRenewalDate);
  d.setUTCDate(d.getUTCDate() - daysBefore);
  return truncateToMidnight(d);
}

const initializeCronJobs = () => {
  // Ejecutar a medianoche UTC todos los días
  cron.schedule("0 0 * * *", async () => {
    console.log("=== Cron Job Diario Iniciado ===", new Date().toISOString());

    try {
      const today = truncateToMidnight(new Date());
      console.log("Hoy (UTC):", today.toISOString(), "->", today.getTime());

      // 1. Actualizar estados de usuarios premium
      console.log("Verificando estado de usuarios premium...");
      try {
        const now = truncateToMidnight(new Date());
        const expiredUsers = await User.find({ isPremium: true });

        for (const user of expiredUsers) {
          const userExpireDate = truncateToMidnight(user.premiumExpiresAt);
          if (userExpireDate && userExpireDate.getTime() < now.getTime()) {
            user.isPremium = false;
            user.premiumExpiresAt = null;
            await user.save();
            console.log(`Usuario ${user._id} ya no es premium (expiró el ${userExpireDate.toISOString()}).`);
          }
        }
      } catch (err) {
        console.error("Error actualizando estados premium:", err.message);
      }

      // 2. Manejar recordatorios
      console.log("Buscando suscripciones para enviar recordatorios...");
      try {
        const subscriptionsToRemind = await Subscription.find({
          "reminderSettings.isActive": true,
          reminderDate: today, // Directamente las que tengan reminderDate == hoy
        }).populate("user");

        console.log(`Se encontraron ${subscriptionsToRemind.length} suscripciones para enviar recordatorio.`);

        for (const subscription of subscriptionsToRemind) {
          try {
            console.log(`Enviando recordatorio a ${subscription.user.email} para ${subscription.name}`);
            await sendReminder(subscription.user.email, subscription.name, subscription.nextRenewalDate);

            // Desactivar el recordatorio después de enviar
            subscription.reminderSettings.isActive = false;
            await subscription.save();
            console.log(`Recordatorio enviado y desactivado para ${subscription.name}`);
          } catch (error) {
            console.error(`Error enviando recordatorio para ${subscription.name}:`, error.message);
          }
        }
      } catch (error) {
        console.error("Error en envío de recordatorios:", error.message);
      }

      // 3. Manejar renovaciones
console.log("Buscando suscripciones para renovar...");
try {
  const subscriptionsToRenew = await Subscription.find({
    nextRenewalDate: today
  }).populate("user");

  console.log(`Se encontraron ${subscriptionsToRenew.length} suscripciones para renovar.`);

  for (const subscription of subscriptionsToRenew) {
    try {
      console.log(`Renovando suscripción ${subscription.name}. Fecha actual: ${subscription.nextRenewalDate.toISOString()}`);

      // 1. Guardar en el historial
      const currentDate = new Date();
      const existingRecord = subscription.paymentHistory.find(
        (record) => record.amount === subscription.cost
      );

      if (existingRecord) {
        existingRecord.times += 1;
        existingRecord.paidDates.push(currentDate.toISOString().split("T")[0]);
      } else {
        subscription.paymentHistory.push({
          times: 1,
          amount: subscription.cost,
          paidDates: [currentDate.toISOString().split("T")[0]],
        });
      }

      // 2. Calcular la nueva fecha de renovación
      console.log(`Calculando nueva fecha para ${subscription.name}:`);
      console.log(`Fecha actual: ${subscription.nextRenewalDate}`);
      const nextDate = addFrequency(subscription.nextRenewalDate, subscription.renewalFrequency);
      if (!nextDate) {
        console.error(`Error: No se pudo calcular la nueva fecha de renovación para ${subscription.name}`);
        continue; // Salta esta suscripción si falla el cálculo
      }
      subscription.nextRenewalDate = nextDate;
      console.log(`Nueva fecha de renovación: ${subscription.nextRenewalDate}`);

      // 3. Recalcular la fecha de recordatorio
      const newReminderDate = calculateReminderDate(nextDate, subscription.reminderSettings.daysBefore);
      subscription.reminderDate = newReminderDate;
      console.log(`Nueva fecha de recordatorio: ${newReminderDate ? newReminderDate.toISOString() : 'N/A'}`);

      // 4. Reactivar el recordatorio
      subscription.reminderSettings.isActive = true;

      // Guardar los cambios
      await subscription.save();
      console.log(`Renovación completada: ${subscription.name}, próxima renovación: ${nextDate.toISOString()}, reminderDate: ${newReminderDate ? newReminderDate.toISOString() : 'N/A'}`);
    } catch (error) {
      console.error(`Error renovando la suscripción ${subscription.name}:`, error.message);
    }
  }

  console.log("Procesamiento de renovaciones completado.");
} catch (error) {
  console.error("Error en renovaciones:", error.message);
}


    } catch (error) {
      console.error("Error general en el cron job diario:", error.message);
    }

    console.log("=== Cron Job Diario Finalizado ===");
  });
};

module.exports = initializeCronJobs;
