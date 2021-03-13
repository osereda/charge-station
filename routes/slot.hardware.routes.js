const {Router} = require('express');
const router = Router();
const Slot = require('../db/slot.scema');
const Scooter = require('../db/scooter.scema');
const Station = require('../db/station.scema');
const Balance = require('../db/balance.scema');
const serviceBalance = require('../db/balance.service.scema');
const loggerXXX = require('../modules/logger');
const log4js = require("log4js");
const logger = log4js.getLogger();
logger.level = "info";
// logger.level = "error";

const BahService = require('../services/bah.service');
let bahService = new BahService;

const moment = require('moment-timezone');
const dateThailand = moment.tz(Date.now(), "Europe/Kiev");

let paramStr ='';

router.get ("/:id", (req, res) => {

    paramStr = req.params.id;
    logger.info("req.params.id: "+paramStr);
    res.set('Access-Control-Allow-Origin', '*');

    let stationId = 0;
    let slotId = 0;
    let scooterId = 0;
    let status = 0;
    let slotPower = 0;
    let stationStatus = null;
    let newSlotCollection = [];
    let countOfSlot = 0;
    let isChargeStart = false;
    let chargeTimePower = 0;
    let chargeBillingPower = 0;

    if(req.params.id) {
        const param = paramStr.replace(/\s/g, '');
        let count = (param.match(/&/g) || []).length;
        for(let i = 0; i < count; countOfSlot++) {
            slotId = parseInt(param.split('&')[i++].split('=')[1]);
            scooterId = parseInt(param.split('&')[i++].split('=')[1]);
            status = param.split('&')[i++].split('=')[1];
            slotPower = param.split('&')[i++].split('=')[1];
            // logger.info("slot update param - sl_id:" + slotId
            //     + " sc_id:  " + scooterId + " status: " + status + "slot power: " + slotPower);
            let tmp = {
                slot_id: slotId,
                newDate: {
                    scooter_id: scooterId,
                    slot_status: status,
                    slot_power: slotPower
                }
            }
            newSlotCollection.push(tmp);
        }
        try {
            Station.find()
                .then ( stations => {
                    if (stations.length !== 0) {
                        stations.forEach(st => {
                            st._doc.id_slots.forEach( slot =>
                                {newSlotCollection.forEach(item => {
                                    if (slot-0 === item.slot_id) {
                                        serviceBalance.findOne({service_bl_sl_id: item.slot_id})
                                            .then(billingServiceItem => {
                                                if(item.newDate.slot_status-0 === 1 && billingServiceItem.service_bl_status === 0){
                                                    let startDate = (new Date().valueOf())/1000;
                                                    serviceBalance.updateOne({service_bl_sl_id: item.slot_id},
                                                        {
                                                            service_bl_time_start: startDate,
                                                            service_bl_power: item.newDate.slot_power,
                                                            service_bl_status: 1
                                                        }, (err, serviceBilling) => {

                                                        })
                                                }
                                                if(item.newDate.slot_status-0 === 1 && billingServiceItem.service_bl_status === 1){
                                                    serviceBalance.updateOne({service_bl_sl_id: item.slot_id},
                                                        {
                                                            service_bl_power: item.newDate.slot_power,
                                                        }, (err, serviceBilling) => {

                                                        })
                                                }
                                                if(item.newDate.slot_status-0 === 0 && billingServiceItem.service_bl_status === 1){
                                                    let endDate = (new Date().valueOf())/1000;
                                                    chargeBillingPower = chargeBillingPower + item.newDate.slot_power;
                                                    serviceBalance.findOneAndUpdate({service_bl_sl_id: item.slot_id},
                                                        {
                                                            service_bl_time_end: endDate,
                                                            service_bl_power: item.newDate.slot_power,
                                                            service_bl_status: 0
                                                        }, (err, serviceBilling) => {
                                                        if(err){
                                                            console.log("err");
                                                        }
                                                            let tmpDate = (new Date().valueOf())/1000;
                                                            chargeTimePower = (tmpDate - serviceBilling._doc.service_bl_time_start);
                                                            let billingDate = new Date().getDate();
                                                            let dateForFilter = null;
                                                            let powerBilling = 0;
                                                            let timeBilling;
                                                            let countScooterEvent;
                                                            Balance.find().limit(1).sort({$natural:-1})
                                                                .then(billing => {
                                                                    let tmpDate = billing[0] ? billing[0]._doc.bl_date.getDate() : null;
                                                                    dateForFilter = billing[0] ? billing[0]._doc.bl_date : null;
                                                                    timeBilling = chargeTimePower;
                                                                    countScooterEvent = billing[0]._doc.bl_scooter_event;
                                                                    if(tmpDate !== billingDate){
                                                                        powerBilling = (item.newDate.slot_power-0)/1000;
                                                                        let newBillingRecord = new Balance({
                                                                            bl_date: new Date(),
                                                                            bl_location: "-",
                                                                            bl_scooter_event: 1,
                                                                            bl_pow: powerBilling,
                                                                            bl_time: chargeTimePower,
                                                                            bl_price: powerBilling * 0.1,
                                                                            bl_balance: 100
                                                                        })
                                                                        //TODO check result
                                                                        const bahResult = bahService.addBah(powerBilling);
                                                                        newBillingRecord.save((err => {
                                                                            console.log("err" + err);
                                                                        }))
                                                                    } else {
                                                                        powerBilling = billing[0] ? billing[0]._doc.bl_pow + ((item.newDate.slot_power-0)/1000) : null;
                                                                        timeBilling = chargeTimePower + billing[0]._doc.bl_time;
                                                                        //TODO heck result
                                                                        const bahResult = bahService.addBah(powerBilling);
                                                                        Balance.updateOne( {bl_date: dateForFilter}, {
                                                                            bl_pow:  powerBilling,
                                                                            bl_time: timeBilling,
                                                                            bl_price: powerBilling * 0.1,
                                                                            bl_scooter_event: ++countScooterEvent,
                                                                        }, (err, billing) => {

                                                                        })
                                                                    }
                                                                })
                                                        })
                                                }
                                            })


                                         // billingService("XXX");

                                        // var now = new Date()
                                        // var today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).valueOf()
                                        // // var other = otherDay.valueOf()
                                        // if (other < today - 86400000) { // 24*60*60*1000
                                        //     console.log("err")
                                        //     // раньше чем вчера
                                        // } else if (other < today) {
                                        //     console.log("err1")
                                        //     // вчера
                                        // } else {
                                        //     // сегодня или потом
                                        // }

                                        Scooter.updateOne({sc_id: item.newDate.scooter_id},
                                            {sc_location: (item.newDate.slot_status-0 === 1 ? st._doc.st_id : "-")}, (err, scoot) => {
                                            if (err) {
                                                logger.error("error - " + err);
                                                console.log(("error - " + err));
                                            } else {
                                                logger.info("scooter # "+ item.newDate.scooter_id +"  update location to: " + st._doc.st_id);
                                            }
                                        })
                                    }
                                })}
                            )
                        })
                    }
                })
            stationStatus = null;
            Scooter.find({sc_id: scooterId})
                .then ( scooter => {
                    if(scooterId !== 0 && scooter.length === 0){
                        stationStatus=0;
                        console.log("slot update - scooter not found: " + scooter.length);
                        logger.info("slot update - scooter not found: " + scooterId);
                        res.send({status: 0});
                    } else {
                        newSlotCollection.forEach((item) => {
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
                            });
                        });
                        res.send({status: 1});
                    }
                })

        }
        catch (err) {
            console.log(err);
        }
    }
});

module.exports = router;


const billingService = (input) => {
    console.log("billingService" + input);
}
