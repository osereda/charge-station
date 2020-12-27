const querystring = require('querystring');
const url = require('url');
const {Router} = require('express');
const router = Router();
const Slot = require('../db/slot.scema');
const Scooter = require('../db/scooter.scema');

router.get("/:id", function(req, res){

    let scooterId;
    let slotId;
    let scooterEvent;

    const param = req.params.id.replace(/\s/g, '');

    if(req.params.id) {
        slotId = parseInt(param.split('&')[0].split('x')[1], 3);
        scooterId = parseInt(param.split('&')[1].split('x')[1], 3);
        scooterEvent = param.split('&')[2].split('=')[1] - 0;

        Scooter.findOne({scooter_id: scooterId}, (err, scooter) => {
            if (err) {
                console.log(err);
            }
            if (scooter == null) {
                return res.send({status: 0})
            }

            Slot.updateOne({ slot_id: slotId },
                {
                    slot_status: scooterEvent,
                    scooter_id: scooterId,
                    scooter_event: scooterEvent
                }).
            then( console.log("Add scooter event- slot id:" + slotId)).
            catch(
                err => console.log(err)
            );

            res.send({status: 1})
        });

    }
});

router.get("/stations", (req, res) => {

    const tmp = req.params;
    Slot.find({}, (err, station) => {
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
    Slot.findOne({station_id: id }, (err, station) => {
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

router.post("/add", (req, res) => {

    Scooter.findOne({scooter_id: req.body.scooterId}, (err, scooterIdFind) => {
        if(scooterIdFind == null)
        {

            const scooterId = req.body.scooterId;
            const scooterType = req.body.scooterType;
            const scooterOperator = req.body.scooterOperator;

            const scooter = new Scooter({
                scooter_id: scooterId,
                scooter_type: scooterType,
                scooter_operator: scooterOperator
            });
            scooter.save((err) => {
                if(err) return res.status(500).send({ error: "cant save station in mongoDB" });
                res.send(scooter);
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
        //Slot.updateOne({station_id: stationId}, { slot_power: slotPower});
        Slot.findOneAndUpdate({station_id: stationId}, newStation, {new: true}, (err, station) => {
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
    Slot.findByIdAndDelete(stationId, (err, station) => {
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