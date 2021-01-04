const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const scooterScheme = new Schema(
    {
        sc_id: Number,
        sc_type: String,
        sc_operator: String,
        sc_pow: Number,
        sc_status: Number,
        sc_perm: Number,
        sc_location: String
    },
    {versionKey: false}
);

const Scooter= mongoose.model("Scooter", scooterScheme);

module.exports = Scooter;