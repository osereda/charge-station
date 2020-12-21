const {Router} = require('express');
const router = Router();
const Station = require('../db/station.scema');

router.get("/stations", (req, res) => {

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
    Station.findOne({_id: id}, (err, station) => {
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

    Station.findOne({station_id: req.body.stationId}, (err, stationIdFind) => {
        if(stationIdFind == null)
        {
            const stationId = req.body.stationId;
            const statusOfStation = req.body.status;
            const sizeOfCharge = req.body.sizeOfCharge ? req.body.sizeOfCharge : 0;
            const passWord = req.body.passWord;
            const addInf = req.body.addInf ? req.body.addInf : "-";
            const station = new Station({
                station_id: stationId,
                status: statusOfStation,
                size_og_charge : sizeOfCharge,
                pass : passWord,
                add_inf : addInf
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
    const sizeOfCharge = req.body.sizeOfCharge;
    const newStation = {size_og_charge: sizeOfCharge};

    try {
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
