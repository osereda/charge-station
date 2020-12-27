const express = require ('express');
const mongoose = require("mongoose");
const config = require('config');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/api/charge', require('./routes/station.routes'));
app.use('/api/scooter', require('./routes/scooter.routes'));

const PORT = config.get('port') || 5000;

async  function start() {
    try {
        mongoose.connect(config.get('dbUrl'),
            { useNewUrlParser: true }, (err) => {
            if(err) return console.log(err);
            else console.log("Connected to the database" + config.get('dbName'));
            app.listen(PORT, () => console.log(`App has been started on port ${PORT}`));
        });

    } catch (err) {
        console.error('Unable to connect to the database:', err);
    }
}
start();
