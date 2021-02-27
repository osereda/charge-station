const express = require ('express');
const mongoose = require("mongoose");
const config = require('config');
const bodyParser = require('body-parser');
const logger = require('./modules/logger');
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(logger.express);
app.use('/api/stStatus', require('./routes/slot.hardware.routes'));
app.use('/api/scEvent', require('./routes/scooter.hardware.routes'));
app.use('/api/scooter', require('./routes/scooter.routes'));
app.use('/api/slot', require('./routes/slot.routes'));
app.use('/api/user', require('./routes/user.routes'));
app.use('/api/station', require('./routes/station.routes'));
app.use('/api/balance', require('./routes/balance.routes'));



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
