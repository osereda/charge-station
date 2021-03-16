const {Router} = require('express');
const router = Router();
const AoService = require('../services/ao.service');
let invoice = new AoService;

router.get("/all", async(req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    const ao = await invoice.GetAllInvoice();
    res.send(ao);
});

router.post("/add", async(req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    const inputData = req.body.power;
    const ao = await invoice.addInvoice(inputData);
    res.send(ao);
});

router.post("/set", async(req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    const data = req.body.invoice;
    const ao = await invoice.setInvoice(data);
    res.send(ao);
});

router.post("/pay", async(req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    const data = req.body.invoice;
    const ao = await invoice.payInvoice(data);
    res.send(ao);
});

module.exports = router;
