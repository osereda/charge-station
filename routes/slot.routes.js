const {Router} = require('express');
const router = Router();
const Slot = require('../db/slot.scema');
var ObjectId = require('mongodb').ObjectID;

router.get("/all", (req, res) => {
    Slot.find({}, (err, slots) => {
        if(err)
        {
            console.log(err);
            if(err) return res.status(500).send({ error: "cant find slot in mongoDB" });
        }
        res.send(slots);
    });
});

router.get("/sl/:id", (req, res) => {
    Slot.findOne({slot_id: req.params.id }, (err, slot) => {
        if(err)
        {
            console.log(err);
            return res.status(500).send({error: `cant find slot with id ${req.params.id}`});
        }
        if(slot == null){
            return res.status(400).send({ error: `slot with id:  ${req.params.id} - don't exist` });
        }
        res.send(slot);
    });
});

router.post("/add", (req, res) => {
    Slot.findOne({slot_id:req.body.slotId}, (err, slotFind) => {
        if(slotFind == null)
        {
            const slotId = req.body.slotId;
            const scooterId = req.body.scooterId;
            const slotStatus = req.body.slotStatus;
            const slotPower = req.body.slotPower ? req.body.slotPower : 0;
            const scooterEvent = req.body.scooterEvent ? req.body.scooterEvent : 0;
            const slot = new Slot({
                slot_id: slotId,
                scooter_id: scooterId,
                slot_status: slotStatus,
                slot_power: slotPower,
                scooter_event : scooterEvent,
            });
            slot.save((err) => {
                if(err) return res.status(500).send({ error: "cant save slot in mongoDB" });
                res.send(slot);
            });
        }
        else {
            res.status(400).send({ error: `Slot id - ${req.body.slotId} already exist` });
        }
    });
});

router.put("/update", (req, res) => {
    if(!req.body) res.status(400).send({ error: "invalid request, no body" });
    const slotId = req.body.slotId;
    const scooterId = req.body.scooterId;
    const slotStatus = req.body.slotStatus;
    const slotPower = req.body.slotPower ? req.body.slotPower : 0;
    const scooterEvent = req.body.scooterEvent ? req.body.scooterEvent : 0;
    const newSlot = {
        scooter_id: scooterId,
        slot_status: slotStatus,
        slot_power: slotPower,
        scooter_event : scooterEvent,
    };
    try {
        Slot.updateOne({slot_id: slotId}, newSlot, (err, slot) => {
            if (err) {
                return res.status(500).send({error: "cant update info in mongoDB"});
            }
            if (slot == null) {
                return res.status(400).send({error: `invalid slot id  - ${req.body.slotId}`});
            }
            res.send(slot);
        });
    }
    catch (err) {
        console.log(err);
        return res.status(500).send({error: "cant update info in mongoDB"});
    }
});

router.delete("/:id", (req, res) => {
    if(!req.params.id) return res.status(400).send({ error: "invalid request, id don't exist" });
    Slot.findOne({slot_id: req.params.id}, (err, slotIdFind) => {
        if(err){
            console.log(err);
            return res.status(500).send({error: "cant delete slot in mongoDB"});
        }
        if(slotIdFind) {
            console.log(slotIdFind._id);
            Slot.findByIdAndDelete(slotIdFind._id, (err, slot) => {
                if (err) {
                    console.log(err);
                    return res.status(500).send({error: "cant delete slot in mongoDB"});
                }
                if (slot == null) {
                    return res.status(400).send({error: `slot with id:  ${req.params.id} - don't exist`});
                }
                res.send(slot);
            });
        }
        else {
            return res.status(400).send({error: "invalid request, id don't exist"});
        }
    });
});

router.get("/init", (req, res) => {
    let slots = [
            {slot_id: 0, scooter_id: 11, slot_status: 0, slot_power: 100, scooter_event: 0},
            {slot_id: 1, scooter_id: 12, slot_status: 0, slot_power: 100, scooter_event: 0},
            {slot_id: 2, scooter_id: 13, slot_status: 0, slot_power: 100, scooter_event: 0}
        ];

    Slot.collection.insertMany(slots, (err, docs) => {
        if (err) {
            return console.error(err);
        } else {
            console.log("3 slots has inserted to Collection");
            res.send({msg : "slots has inserted to Collection"});
        }
    });
});

router.get("/deleteall", (req, res) => {
    Slot.remove({}, (err) => {
        if(err) {
            console.log("delete all error - " + err);
            return res.status(500).send({error: "cant delete all in mongoDB"});
        }
        res.status(200).send("all slots hes deleted ");
    });
});

module.exports = router;
