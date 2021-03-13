const {Router} = require('express');
const router = Router();
const BahService = require('../services/bah.service');
let billing = new BahService;

router.get("/all", async(req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    const bah = await billing.GetAllBah();
    res.send(bah);
});

router.post("/add", async(req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    const inputData = req.body;
    const bah = await billing.addBah(inputData);
    res.send(bah);
});

module.exports = router;
