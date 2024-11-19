const { Schema, model } = require("mongoose");

const appointmentSchema = new Schema({ 
    service: [{
        type: Schema.Types.ObjectId,
        ref: "Service",
        required: true,
    }],
    pet: [{
        type: Schema.Types.ObjectId,
    }],
    date: {
        type: Date,
        required: true,
    },
    time: {
        type: String,
        required: true,
        match: /^([01]\d|2[0-3]):([0-5]\d)$/,
    },
    status: {
        enum: ["pending", "confirmed", "completed", "cancelled", "rescheduled"],
        default: "pending",
    },
    notes: {
        type: String,
    },
});

module.exports = model("Appointment", appointmentSchema);