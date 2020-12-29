const {Router} = require('express');
const router = Router();
const Slot = require('../db/slot.scema');

router.get("/slots", (req, res) => {

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

router.get("/slot/:id", function(req, res){

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

router.post("/slot/add", (req, res) => {

    Slot.findOne({slot_id:req.body.slotId}, (err, stationIdFind) => {
        if(stationIdFind == null)
        {
            const slotId = req.body.slotId;
            const scooterId = req.body.scooterId;
            const slotStatus = req.body.slotStatus;
            const slotPower = req.body.slotPower ? req.body.slotPower : 0;
            const scooterEvent = req.body.scooterEvent ? req.body.scooterEvent : 0;
            const station = new Slot({
                slot_id: slotId,
                scooter_id: scooterId,
                slot_status: slotStatus,
                slot_power: slotPower,
                scooter_event : scooterEvent,
            });
            station.save((err) => {
                if(err) return res.status(500).send({ error: "cant save station in mongoDB" });
                res.send(station);
            });
        }
        else {
            res.status(400).send({ error: `Slot id - ${req.body.stationId} already exist` });
        }
    });
});

router.put("/slot/update/charge", (req, res) => {
    if(!req.body) res.status(400).send({ error: "invalid request, no body" });
    const stationId = req.body.stationId;
    const slotPower = req.body.slotPower;
    const newStation = {slot_power: slotPower};

    try {
        //Station.updateOne({station_id: stationId}, { slot_power: slotPower});
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

router.delete("/slot/:id", (req, res) => {

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
