const {Router} = require('express');
const router = Router();
const Slot = require('../db/slot.scema');
const Scooter = require('../db/scooter.scema');

router.get("/all", (req, res) => {
    Slot.find({}, (err, station) => {
        if(err)
        {
            console.log(err);
            if(err) return res.status(500).send({ error: "cant find station in mongoDB" });
        }
        res.send(station);
    });
});

router.get("/sc/:id", (req, res) => {
    Scooter.findOne({scooter_id: req.params.id }, (err, slot) => {
        if(err)
        {
            console.log(err);
            return res.status(500).send({error: `cant find station with id ${req.params.id}`});
        }
        if(slot == null){
            return res.status(400).send({ error: `slot with id:  ${req.params.id} - don't exist` });
        }
        res.send(slot);
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
            res.status(400).send({ error: `Station id - ${req.body.scooterId} already exist` });
        }
    });
});

router.put("/update", (req, res) => {

    if(!req.body) res.status(400).send({ error: "invalid request, no body" });
    const scooterId = req.body.scooterId;
    const slotPower = req.body.slotPower;
    const newStation = {slot_power: slotPower};

    try {
        Slot.findOneAndUpdate({station_id: scooterId}, newStation, {new: true}, (err, station) => {
            if (err) {
                return res.status(500).send({error: "cant update info in mongoDB"});
            }
            if (station == null) {
                return res.status(400).send({error: `invalid station id  - ${req.body.scooterId}`});
            }
            res.send(station);
        });
    }
    catch (err) {
        console.log(err);
        return res.status(500).send({error: "cant update info in mongoDB"});
    }
});

router.delete("/:id", (req, res) => {
    if(!req.params.id) return res.status(400).send({ error: "invalid request, id don't exist" });
    Scooter.findOne({scooter_id: req.params.id}, (err, scooterIdFind) => {
        if(err){
            console.log(err);
            return res.status(500).send({error: "cant delete Scooter in mongoDB"});
        }
        if(scooterIdFind) {
            Scooter.findByIdAndDelete(scooterIdFind._id, (err, scooter) => {
                if (err) {
                    console.log(err);
                    return res.status(500).send({error: "cant delete Scooter in mongoDB"});
                }
                if (scooter == null) {
                    return res.status(400).send({error: `Scooter with id:  ${req.params.id} - don't exist`});
                }
                res.send(scooter);
            });
        }
        else {
            return res.status(400).send({error: "invalid request, id don't exist"});
        }
    });
});

router.get("/deleteall", (req, res) => {
    Scooter.remove({}, (err) => {
        if(err) {
            console.log("delete all error - " + err);
            return res.status(500).send({error: "cant delete all Scooter in mongoDB"});
        }
        res.status(200).send("all Scooter hes deleted ");
    });
});

router.get("/init", (req, res) => {
    let scooters = [
        {scooter_id: 0, scooter_type: "type 1", scooter_operator: "operator 1"},
        {scooter_id: 1, scooter_type: "type 1", scooter_operator: "operator 2"},
        {scooter_id: 2, scooter_type: "type 1", scooter_operator: "operator 3"},
        {scooter_id: 3, scooter_type: "type 2", scooter_operator: "operator 3"},
        {scooter_id: 4, scooter_type: "type 2", scooter_operator: "operator 3"},
    ];

    Scooter.collection.insertMany(scooters, (err, docs) => {
        if (err) {
            return console.error(err);
        } else {
            console.log("new slots has inserted to collection Scooters");
            res.send({msg : "slots has inserted to Scooters collection"});
        }
    });
});

module.exports = router;