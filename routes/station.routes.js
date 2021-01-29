const {Router} = require('express');
const router = Router();
const Station = require('../db/station.scema');
const Slot = require('../db/slot.scema');


const Nominatim = require('nominatim-geocoder')
const geocoder = new Nominatim()

router.get("/all", (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    let stArr = [];
    let slArr = [];
    Station.find({} )
        .then ( station => {
            stArr = station;
         })
        .then ( Slot.find({} )
                .then(slot => {
                    slArr = slot;
                    stArr.forEach(station => {
                        station.id_slots.forEach(idslot => {
                            slArr.forEach(slot => {
                                if(idslot-0 === slot.slot_id-0) {
                                    station.arr_slots.push(slot);
                                }

                            })
                        })
                    })
                    res.send(stArr);
                }
            )
        )
});

router.get("/all1", (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    Station.find({ }, (err, station) => {
        if(err){
            console.log(err);
            return res.status(500).send({error: `cant find station with id ${req.params.id}`});
        }
        if(station == null){
            return res.status(400).send({ error: `station with id:  ${req.params.id} - don't exist` });
        }
        res.send(station);
    });
});

router.get("/st/:id", (req, res) => {
    Station.findOne({st_id: req.params.id }, (err, station) => {
        if(err){
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
    Station.findOne({st_id: req.body.stId}, (err, stationFind) => {
        if(stationFind == null)
        {
            const stId = req.body.stId;
            const slots = req.body.slots;
            const location = req.body.loc;
            const pic = req.body.pic ? req.body.pic : 'pic1.png';
            const inf = req.body.inf ? req.body.inf : " - ";
            let geodata = '';

            geocoder.search( { q: location })
                .then(result => {
                    if(result) {
                        geodata = result[0].lat + "," + result[0].lon;
                    }
                    const station = new Station({
                        st_id: stId,
                        id_slots: slots,
                        arr_slots: [],
                        location: location,
                        picture: pic,
                        info : inf,
                        geodata: geodata
                    });

                    station.save((err) => {
                        if(err) return res.status(500).send({ error: "cant save station in mongoDB" });
                        res.send(station);
                    });
                }).catch((error) => {
                    console.log(error);
                })

        }
        else {
            res.status(400).send({ error: `station id - ${req.body.stId} already exist` });
        }
    });
});

router.put("/update", (req, res) => {
    if(!req.body) res.status(400).send({ error: "invalid request, no body" });
    const stId = req.body.stId;
    const slots = req.body.slots;
    const location = req.body.loc;
    const pic = req.body.pic ? req.body.pic : 'pic1.png';
    const inf = req.body.inf ? req.body.inf : " - ";
    const newStation = new Station({
        st_id: stId,
        st_slots: slots,
        location: location,
        picture: pic,
        info : inf,
    });
    try {
        Station.updateOne({slot_id: slotId}, newStation, (err, station) => {
            if (err) {
                return res.status(500).send({error: "cant update info in mongoDB"});
            }
            if (station == null) {
                return res.status(400).send({error: `invalid station id  - ${req.body.stId}`});
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
    Station.findOne({st_id: req.params.id}, (err, stationIdFind) => {
        if(err){
            console.log(err);
            return res.status(500).send({error: "cant delete station in mongoDB"});
        }
        if(stationIdFind) {
            console.log(stationIdFind._id);
            Station.findByIdAndDelete(stationIdFind._id, (err, station) => {
                if (err) {
                    console.log(err);
                    return res.status(500).send({error: "cant delete station in mongoDB"});
                }
                if (station == null) {
                    return res.status(400).send({error: `station with id:  ${req.params.id} - don't exist`});
                }
                res.send(station);
            });
        }
        else {
            return res.status(400).send({error: "invalid request, id don't exist"});
        }
    });
});

router.get("/init", (req, res) => {
    let station = [
        {st_id: 0, id_slots: [1, 2, 1], arr_slots: [], location: "Oslo,Karla-Uhana,1 ", picture: "pic1.png", info: "-", geodata: "51.4949045, 31.2946714"},
        {st_id: 1, id_slots: [3, 2], arr_slots: [],  location: "London,Piccadilly,10", picture: "pic2.png", info: "-", geodata: "51.0, 31.0"}
    ];

    Station.collection.insertMany(station, (err, docs) => {
        if (err) {
            return console.error(err);
        } else {
            console.log("stations has inserted to Collection");
            res.send({msg : "stations has inserted to Collection"});
        }
    });
});

router.get("/deleteall", (req, res) => {
    Station.remove({}, (err) => {
        if(err) {
            console.log("delete all error - " + err);
            return res.status(500).send({error: "cant delete all in mongoDB"});
        }
        res.status(200).send("all stations hes deleted ");
    });
});

module.exports = router;
