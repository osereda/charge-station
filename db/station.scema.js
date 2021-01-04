const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const stationScheme = new Schema(
    {
        st_id: Number,
        id_slots: [String],
        arr_slots: [{}],
        location: String,
        picture: String,
        info: String
    },
    {versionKey: false}
);

const Station= mongoose.model("Station", stationScheme);

module.exports = Station;