const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bahScheme = new Schema(
    {
        bah_date: Date,
        bah_time: String,
        bah_location: String,
        bah_info: String,
        bah_balance_total: Number,
        bah_balance_amount: Number,
        bah_balance_current: Number,
        bah_balance_rest: Number,
    },
    {versionKey: false}
);

const Bah = mongoose.model("Bah", bahScheme);

module.exports = Bah;
