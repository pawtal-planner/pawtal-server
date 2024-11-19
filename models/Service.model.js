const { Schema, model } = require("mongoose");

const serviceSchema = new Schema({ 
    provider: [{
        type: Schema.Types.ObjectId,
        required: true,
    }],
    description: {
        type: String,   
        required: true,
    },
    rate: {
        type: Number,
    },
    location: {
        type: String,   
        required: true,
    },
    review: [{
        type: Schema.Types.ObjectId,
    }],

});

module.exports = model("Service", appointmentSchema);