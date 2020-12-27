const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const scooterScheme = new Schema(
    {
        station_id: Number,
        slot_id: Number,
        scooter_id: Number,
        slot_status : Number
    },
    {versionKey: false}
);

const Scooter= mongoose.model("Scooter", scooterScheme);

module.exports = Scooter;