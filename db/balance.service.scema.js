const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const serviceBalanceScheme = new Schema(
    {
        service_bl_sl_id: Number,
        service_bl_date: Date,
        service_bl_time_start: Number,
        service_bl_time_end: Number,
        service_bl_power: Number,
        service_bl_status: Number
    },
    {versionKey: false}
);

const serviceBalance= mongoose.model("serviceBalance", serviceBalanceScheme);

module.exports = serviceBalance;
