const {Router} = require('express');
const router = Router();
const Slot = require('../db/slot.scema');

router.get ("/:id", (req, res) => {

    res.set('Access-Control-Allow-Origin', '*');

    let slotId;
    let scooterId;
    let status;
    let slotPower;
    let stationStatus = null;
    let newSlotCollection = [];
    let countOfSlot = 0;

    if(req.params.id) {
        const param = req.params.id.replace(/\s/g, '');
        let count = (param.match(/&/g) || []).length;
        for(let i = 0; i < count; countOfSlot++) {
            slotId = parseInt(param.split('&')[i++].split('=')[1]);
            scooterId = parseInt(param.split('&')[i++].split('=')[1]);
            status = param.split('&')[i++].split('=')[1];
            slotPower = param.split('&')[i++].split('=')[1];

            let tmp = {
                slot_id: slotId,
                newDate: {
                    scooter_id: scooterId,
                    slot_status: status,
                    slot_power: slotPower,
                }
            }
            newSlotCollection.push(tmp);
        }
        try {
            stationStatus = null;
            newSlotCollection.forEach((item, i) => {
                Slot.updateOne({slot_id: item.slot_id}, item.newDate, (err, slot) => {
                    if (err) {
                        stationStatus = 0;
                    }
                    if (slot == null || slot.nModified === 0 && slot.n === 0) {
                        stationStatus = 0;
                    }
                    if (i === countOfSlot - 1 && stationStatus !== 0 && slot.n !== 0) {
                        res.send({status: 1});
                    }
                    if (i === countOfSlot - 1 && stationStatus === 0) {
                        res.send({status: 0});
                    }
                });
            });
        }
        catch (err) {
            console.log(err);
        }

    }

});

module.exports = router;
