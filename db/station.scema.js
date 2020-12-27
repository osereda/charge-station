const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const stationScheme = new Schema(
        {
            station_id: Number,
            slot_id: Number,
            scooter_id: Number,
            slot_status: String,
            slot_power : Number,
            location : String
        },
        {versionKey: false}
    );

const Station = mongoose.model("Station", stationScheme);

module.exports = Station;