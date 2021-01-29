const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const slotScheme = new Schema(
    {
        slot_id: Number,
        scooter_id: Number,
        slot_status: Number,
        slot_power : Number,
        slot_info : Number,
        scooter_event : Number
    },
    {versionKey: false}
);

const Slot = mongoose.model("Slot", slotScheme);

module.exports = Slot;
