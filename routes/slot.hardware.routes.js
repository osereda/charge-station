const {Router} = require('express');
const router = Router();
const Slot = require('../db/slot.scema');
const Scooter = require('../db/scooter.scema');
const loggerXXX = require('../modules/logger');
const log4js = require("log4js");
const logger = log4js.getLogger();
logger.level = "info";
// logger.level = "error";

router.get ("/:id", (req, res) => {

    res.set('Access-Control-Allow-Origin', '*');

    let slotId = 0;
    let scooterId = 0;
    let status = 0;
    let slotPower = 0;
    let stationStatus = null;
    let newSlotCollection = [];
    let countOfSlot = 0;
    let tmp1 = '';
    let tmp2 = '';
    let tmp3 = 0;

    if(req.params.id) {
        logger.info("req.params.id: "+req.params.id);
        const param = req.params.id.replace(/\s/g, '');
        logger.info("param1: "+param);
        let count = (param.match(/&/g) || []).length;
        for(let i = 0; i < count; countOfSlot++) {
            slotId = parseInt(param.split('&')[i++].split('=')[1]);
            // scooterId = parseInt(param.split('&')[i++].split('=')[1]);

            logger.info("param2: "+param);
            tmp1 = param.split('&')[i++];
            logger.info("tmp1: "+tmp1);
            tmp2 = tmp1.split('=')[1];
            logger.info("tmp2: "+tmp2);
            tmp3 = parseInt(tmp2,16);
            logger.info("tmp3: "+tmp3);

            status = param.split('&')[i++].split('=')[1];
            slotPower = param.split('&')[i++].split('=')[1];
            console.log("sl_id:  " + slotId);
            // console.log("sc_id:  " + scooterId);
            logger.info("slot update param - sl_id:" + slotId
                + " sc_id:  " + scooterId + " status: " + status + "slot power: " + slotPower);
            let tmp = {
                slot_id: slotId,
                newDate: {
                    scooter_id: tmp3,
                    slot_status: status,
                    slot_power: slotPower
                }
            }
            newSlotCollection.push(tmp);
        }
        try {
            stationStatus = null;
            Scooter.find({sc_id: tmp3})
                .then ( scooter => {
                    if(tmp3 !== 0 && scooter.length === 0){
                        stationStatus=0;
                        console.log("slot update - scooter not found: " + scooter.length);
                        logger.info("slot update - scooter not found: " + scooterId);
                        res.send({status: 0});
                    } else {
                        newSlotCollection.forEach((item, i) => {
                            Slot.updateOne({slot_id: item.slot_id}, item.newDate, (err, slot) => {
                                if (err) {
                                    logger.error("error - " + err);
                                    stationStatus = 2;
                                    res.send({status: stationStatus});
                                }
                                if (slot == null || slot.nModified === 0 && slot.n === 0) {
                                    stationStatus = 2;
                                    console.log("slot update - SLOT NOT FOUND: " + item.slot_id);
                                    logger.info("slot update - SLOT NOT FOUND: " + item.slot_id);
                                    res.send({status: stationStatus});
                                }
                                else {
                                    logger.info("slot update - OK: " + item.slot_id);
                                    console.log("slot update - OK");
                                    res.send({status: 1});
                                }
                            });
                        });
                    }
                })

        }
        catch (err) {
            console.log(err);
        }
    }
});

module.exports = router;
