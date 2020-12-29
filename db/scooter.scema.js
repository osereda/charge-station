const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;

const scooterScheme = new Schema(
    {
        scooter_id: Number,
        scooter_type: String,
        scooter_operator: String
    },
    {versionKey: false}
);

const Scooter= mongoose.model("Scooter", scooterScheme);

module.exports = Scooter;