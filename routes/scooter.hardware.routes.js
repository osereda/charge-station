const {Router} = require('express');
const router = Router();
const Slot = require('../db/slot.scema');
const Scooter = require('../db/scooter.scema');

router.get("/:id", (req, res) => {

    let scooterId;
    let slotId;
    let scooterEvent;
    let status = null;

    const param = req.params.id.replace(/\s/g, '');

    if(req.params.id) {
        slotId = parseInt(param.split('&')[0].split('=')[1]);
        scooterId = parseInt(param.split('&')[1].split('=')[1]);
        scooterEvent = parseInt(param.split('&')[2].split('=')[1]);
        let updatedSlot = {
            slot_status: scooterEvent,
            sc_id: scooterId,
            scooter_event: scooterEvent
        }

        Scooter.findOne({sc_id: scooterId}, (err, scooter) => {
            if (err) {
                console.log(err);
            }
            if (scooter == null) {
                return res.send({status: 0})
            }

            Slot.updateOne({slot_id: slotId}, updatedSlot, (err, slot) => {
                if (err) {
                    status = 0;
                }
                if (slot == null || slot.nModified === 0 && slot.n === 0) {
                    status = 0;
                }
                if (status !== 0) {
                    res.send({status: 1});
                }
                if (status === 0) {
                    res.send({status: 0});
                }
            });
        });
    }
});

module.exports = router;
