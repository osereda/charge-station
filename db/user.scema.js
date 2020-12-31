const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const slotScheme = new Schema(
    {
        username: String,
        password: String,
        org: String,
        info : String
    },
    {versionKey: false}
);

const User = mongoose.model("User", slotScheme);

module.exports = User;