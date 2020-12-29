const {Router} = require('express');
const router = Router();
const Slot = require('../db/slot.scema');

router.get ("/:id", (req, res) => {

    res.set('Access-Control-Allow-Origin', '*');

    let slotId;
    let scooterId;
    let status;
    let slotPower;
    let stationStatus;

    if(req.params.id) {
        const param = req.params.id.replace(/\s/g, '');
        let count = (param.match(/&/g) || []).length;

        for(let i = 0; i < count; ) {
            slotId = parseInt(param.split('&')[i++].split('x')[1], 3);
            scooterId = parseInt(param.split('&')[i++].split('x')[1], 3);
            status = param.split('&')[i++].split('=')[1];
            slotPower = param.split('&')[i++].split('=')[1];

            Slot.updateOne({ slot_id: slotId },
                {
                    scooter_id: scooterId ? scooterId : 0,
                    slot_status: status ? status : 0,
                    slot_power: slotPower ? slotPower : 0
                }).
            then(stationStatus = 1).
            catch(err => console.log(err));

        }
        res.send({status: stationStatus});
    }

});

module.exports = router;
