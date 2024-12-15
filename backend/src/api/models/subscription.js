const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    cost: { type: Number, required: true, min: 0 },
    startDate: { type: Date, required: true },
    renewalFrequency: { 
      type: String, 
      enum: ["daily", "weekly", "monthly", "yearly"], 
      required: true 
    },
    nextRenewalDate: { type: Date },
    reminderDate: { type: Date }, 
    category: { type: String, enum: ["Entertainment", "Work", "Utilities", "Other"], default: "Other" },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    notes: { type: String, trim: true, default: "" },
    defaultSubscription: { type: mongoose.Schema.Types.ObjectId, ref: "DefaultSubscription", default: null },
    logoURL: { type: String, default: "https://example.com/default-logo.png" },
    reminderSettings: {
      isActive: { type: Boolean, default: true },
      daysBefore: { type: Number, enum: [1, 2, 3, 5, 10, 15], default: 1 }, 
    },
    paymentHistory: [
      {
        times: { type: Number, default:0 },
        amount: { type: Number, min: 0 },
        paidDates: [{ type: String }],
      },
    ],
  },
  { timestamps: true }
);

function truncateToMidnightUTC(date) {
  const d = new Date(date);
  d.setUTCHours(0,0,0,0);
  return d;
}

subscriptionSchema.pre("save", function (next) {
  // Solo recalcular si es nuevo o si se modificó startDate o renewalFrequency
  if (this.isNew || this.isModified('startDate') || this.isModified('renewalFrequency')) {
    if (this.startDate && this.renewalFrequency) {
      const nextDate = new Date(this.startDate);

      switch (this.renewalFrequency) {
        case "daily":
          nextDate.setUTCDate(nextDate.getUTCDate() + 1);
          break;
        case "weekly":
          nextDate.setUTCDate(nextDate.getUTCDate() + 7);
          break;
        case "monthly":
          nextDate.setUTCMonth(nextDate.getUTCMonth() + 1);
          break;
        case "yearly":
          nextDate.setUTCFullYear(nextDate.getUTCFullYear() + 1);
          break;
        default:
          break;
      }

      this.nextRenewalDate = truncateToMidnightUTC(nextDate);

      if (this.reminderSettings && this.reminderSettings.daysBefore != null) {
        const reminderDays = this.reminderSettings.daysBefore;
        const reminderD = new Date(this.nextRenewalDate);
        reminderD.setUTCDate(reminderD.getUTCDate() - reminderDays);
        this.reminderDate = truncateToMidnightUTC(reminderD);
      }
    }
  }

  next();
});

module.exports = mongoose.model("Subscription", subscriptionSchema);
