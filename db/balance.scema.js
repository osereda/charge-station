const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const balanceScheme = new Schema(
    {
        bl_date: Date,
        bl_location: String,
        bl_scooter_event: Number,
        bl_pow: Number,
        bl_time: Number,
        bl_price: Number
    },
    {versionKey: false}
);

const Balance = mongoose.model("Balance", balanceScheme);

module.exports = Balance;
