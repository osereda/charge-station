const AO = require('../ao.scema');

class AoModel {
    async getAll() {
        try {
            const result = await AO.find({});
            return result;
        } catch (err) {
            console.log(err);
            return err;
        }
    };

    async getLastRecord() {
        try {
            const result = await AO.find().limit(1).sort({$natural:-1});
            return result;
        } catch (err) {
            console.log(err);
            return err;
        }
    };

    async create(data) {
        try {
            let newBillingRecord = new AO({
                ao_date: new Date(),
                ao_receipt: "amount for period",
                ao_info: "info",
                ao_status: 100,
                ao_amount: data.amount,
                ao_balance: data.current
            })
            let newBilling = await newBillingRecord.save();
            return newBilling;
        } catch(err) {
            console.log('err' + err);
            return err;
        }
    }

    async save(data) {
        try {
            let newBillingRecord = new AO({
                ao_date: new Date(),
                ao_receipt: data.receipt,
                ao_info: data.info,
                ao_status: data.status,
                ao_amount: data.amount,
                ao_balance: data.balance

            })
            let newBilling = await newBillingRecord.save();
            return newBilling;
        } catch(err) {
            console.log('err' + err);
            return err;
        }
    }

    async update(data) {
        try {
            let updateBillingRecord = {
                ao_amount: data.amount,
                ao_current: data.current,
            }
            let updateBilling = await AO.update({_id: data.filter}, updateBillingRecord);
            return updateBilling;
        } catch(err) {
            console.log('err' + err);
            return err;
        }
    }
}

module.exports =  AoModel;
