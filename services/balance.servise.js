const BALANCE = require('../db/balance.scema');
const SERVICE_BALANCE = require('../db/balance.service.scema');

exports.getAll = (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    BALANCE.find({}, (err, users) => {
        if(err)
        {
            console.log(err);
            if(err) return res.status(500).send({ error: "cant find user in mongoDB" });
        }
        res.send(users);
    })
};

exports.init = (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    let balance = [
        {bl_date: new Date(), bl_pow: 117, bl_time: 1000, bl_price: 0.11},
        {bl_date: new Date("2021-02-25"), bl_pow: 118, bl_time: 1001, bl_price: 0.11},
        {bl_date: new Date("2021-02-26"), bl_pow: 119, bl_time: 1021, bl_price: 0.12}
    ];

    BALANCE.collection.insertMany(balance, (err, docs) => {
        if (err) {
            return console.error(err);
        } else {
            console.log("balances has inserted to Balance collection");
            res.send({msg : "balances has inserted to Balance Collection"});
        }
    });
};

exports.initBalanceService = (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    let balance = [
        {service_bl_sl_id: 524325, service_bl_date: new Date(), service_bl_time_start: 0, service_bl_time_end: 0, service_bl_power: 0, service_bl_status: 0},
        {service_bl_sl_id: 327717, service_bl_date: new Date(), service_bl_time_start: 0, service_bl_time_end: 0, service_bl_power: 0, service_bl_status: 0},
        {service_bl_sl_id: 262181, service_bl_date: new Date(), service_bl_time_start: 0, service_bl_time_end: 0, service_bl_power: 0, service_bl_status: 0},
        {service_bl_sl_id: 393253, service_bl_date: new Date(), service_bl_time_start: 0, service_bl_time_end: 0, service_bl_power: 0, service_bl_status: 0},
        {service_bl_sl_id: 458789, service_bl_date: new Date(), service_bl_time_start: 0, service_bl_time_end: 0, service_bl_power: 0, service_bl_status: 0},
    ];

    SERVICE_BALANCE.collection.insertMany(balance, (err, docs) => {
        if (err) {
            return console.error(err);
        } else {
            console.log("balances has inserted to Balance collection");
            res.send({msg : "balances has inserted to Balance Collection"});
        }
    });
};
