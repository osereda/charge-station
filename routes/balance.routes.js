const {Router} = require('express');
const router = Router();
const BALANCE = require('../services/balance.servise');

router.get("/all", [
    BALANCE.getAll
]);

router.get("/init", [
    BALANCE.init
]);

router.get("/initservice", [
    BALANCE.initBalanceService
]);

module.exports = router;
