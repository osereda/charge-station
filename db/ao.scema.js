const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const invoiceScheme = new Schema(
    {
        ao_date: Date,
        ao_receipt: String,
        ao_info: String,
        ao_status: Boolean,
        ao_amount: Number,
        ao_balance: Number
    },
    {versionKey: false}
);

const Invoice = mongoose.model("ao", invoiceScheme);

module.exports = Invoice;
