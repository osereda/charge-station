const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const stationScheme = new Schema(
        {
            station_id: Number,
            status: String,
            size_og_charge : Number,
            pass : String,
            add_inf : String
        },
        {versionKey: false}
    );

const Station = mongoose.model("Station", stationScheme);

module.exports = Station;