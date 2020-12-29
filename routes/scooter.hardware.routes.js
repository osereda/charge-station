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

module.exports = router;