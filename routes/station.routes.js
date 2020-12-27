const querystring = require('querystring');
const url = require('url');
const {Router} = require('express');
const router = Router();
const Station = require('../db/station.scema');

router.get("/stationStatus/:id", (req, res) => {

    res.set('Access-Control-Allow-Origin', '*');

    let stationId;
    let slotId;
    let scooterId;
    let status;
    let slotPower;
    let stationStatus;

    if(req.params.id) {
        const param = req.params.id.replace(/\s/g, '');
        let count = (param.match(/&/g) || []).length;
        stationId = parseInt(param.split('&')[0].split('x')[1], 2);

        for(let i = 1; i < count; ) {
            slotId = parseInt(param.split('&')[i++].split('x')[1], 2);
            scooterId = parseInt(param.split('&')[i++].split('x')[1], 2);
            status = param.split('&')[i++].split('=')[1];
            slotPower = param.split('&')[i++].split('=')[1];

            Station.updateOne({ station_id: stationId, slot_id: slotId},
                {
                    scooter_id: scooterId ? scooterId : 0,
                    slot_status: status ? status : 0,
                    slot_power: slotPower ? slotPower : 0
                }).
                then(stationStatus = 1).
                catch(
                err => console.log(err),
                    res.status(500)
            );
        }
        res.send({st_id: stationId, st_comm: stationStatus});
    }
});

router.get("/stations", (req, res) => {

    const tmp = req.params;
    Station.find({}, (err, station) => {
        if(err)
        {
            console.log(err);
            if(err) return res.status(500).send({ error: "cant find station in mongoDB" });
        }
        res.send(station);
    });
});

router.get("/station/:id", function(req, res){

    const id = req.params.id;
    Station.findOne({station_id: id }, (err, station) => {
        if(err)
        {
            console.log(err);
            return res.status(500).send({error: `cant find station with id ${req.params.id}`});
        }
        if(station == null){
            return res.status(400).send({ error: `station with id:  ${req.params.id} - don't exist` });
        }
        res.send(station);
    });
});

router.post("/station/add", (req, res) => {

    if(!req.body || !req.body.stationId ) res.status(400).send({ error: "invalid request, no body or id" });

    Station.findOne({station_id: req.body.stationId, slot_id:req.body.slotId}, (err, stationIdFind) => {
        if(stationIdFind == null)
        {
            const stationId = req.body.stationId;
            const slotId = req.body.slotId;
            const scooterId = req.body.scooterId;
            const slotStatus = req.body.slotStatus;
            const slotPower = req.body.slotPower ? req.body.slotPower : 0;
            const location = req.body.location;
            const station = new Station({
                station_id: stationId,
                slot_id: slotId,
                scooter_id: scooterId,
                slot_status: slotStatus,
                slot_power: slotPower,
                location : location,
            });
            station.save((err) => {
                if(err) return res.status(500).send({ error: "cant save station in mongoDB" });
                res.send(station);
            });
        }
        else {
            res.status(400).send({ error: `Station id - ${req.body.stationId} already exist` });
        }
    });
});

router.put("/station/update/charge", (req, res) => {
    if(!req.body) res.status(400).send({ error: "invalid request, no body" });
    const stationId = req.body.stationId;
    const slotPower = req.body.slotPower;
    const newStation = {slot_power: slotPower};

    try {
        //Station.updateOne({station_id: stationId}, { slot_power: slotPower});
        Station.findOneAndUpdate({station_id: stationId}, newStation, {new: true}, (err, station) => {
            if (err) {
                return res.status(500).send({error: "cant update info in mongoDB"});
            }
            if (station == null) {
                return res.status(400).send({error: `invalid station id  - ${req.body.stationId}`});
            }
            res.send(station);
        });
    }
    catch (err) {
        console.log(err);
        return res.status(500).send({error: "cant update info in mongoDB"});
    }
});

router.delete("/station/:id", (req, res) => {

    if(!req.params.id) return res.status(400).send({ error: "invalid request, id don't exist" });
    const stationId = req.params.id;
    Station.findByIdAndDelete(stationId, (err, station) => {
        if(err) {
            console.log(err);
            return res.status(500).send({error: "cant delete station in mongoDB"});
        }
        if(station == null){
            return res.status(400).send({ error: `station with id:  ${req.params.id} - don't exist` });
        }
        res.send(station);
    });
});

module.exports = router;
