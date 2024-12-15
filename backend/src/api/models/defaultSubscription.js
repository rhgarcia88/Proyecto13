const mongoose = require("mongoose");

const defaultSubscriptionSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        category: { type: String, enum: ["Entertainment", "Work", "Utilities", "Other"], default: "Other" },
        logoURL: { type: String, trim: true },
    },
    { timestamps: true }
);

module.exports = mongoose.model("DefaultSubscription", defaultSubscriptionSchema);
