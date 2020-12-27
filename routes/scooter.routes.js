const querystring = require('querystring');
const url = require('url');
const {Router} = require('express');
const router = Router();
const Scooter = require('../db/scooter.scema');

router.get("/scooterEvent/:id", (req, res) => {

    res.set('Access-Control-Allow-Origin', '*');

    let stationId;
    let slotId;
    let scooterId;
    let scooterEvent;

    if(req.params.id) {
        const param = req.params.id.replace(/\s/g, '');
        stationId = parseInt(param.split('&')[0].split('x')[1], 2);
        slotId = parseInt(param.split('&')[1].split('x')[1], 2);
        scooterId = parseInt(param.split('&')[2].split('x')[1], 2);
        scooterEvent = param.split('&')[i++].split('=')[1];

        Scooter.save({
            station_id: stationId,
            slot_id: slotId ? slotId : 0,
            scooter_id: scooterId ? scooterId : 0,
            slot_status: scooterId ? scooterId : 0,
        }).
        then(scooter => Scooter.findOne({station_id: stationId}),
            res.send({st_id: stationId})).
        catch(
            err => console.log(err),
            res.status(500)
        );
        res.send({st_id: stationId});
    }
});

module.exports = router;
