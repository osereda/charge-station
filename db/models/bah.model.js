const BAH = require('../bah.scema');

class BahModel {
    async getAll() {
        try {
            const result = await BAH.find({});
            return result;
        } catch (err) {
            console.log(err);
            return err;
        }
    };

    async getLastRecord() {
        try {
            const result = await BAH.find().limit(1).sort({$natural:-1});
            return result;
        } catch (err) {
            console.log(err);
            return err;
        }
    };

    async create(data) {
        try {
            let newBillingRecord = new BAH({
                bah_date: new Date(),
                bah_time: "-",
                bah_info: "amount for period",
                bah_location: 1,
                bah_balance_total: 100,
                bah_balance_amount: data.amount,
                bah_balance_current: data.current,
                bah_balance_rest: data.current
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
                bah_balance_amount: data.amount,
                bah_balance_current: data.current,
            }
            let updateBilling = await BAH.update({_id: data.filter}, updateBillingRecord);
            return updateBilling;
        } catch(err) {
            console.log('err' + err);
            return err;
        }
    }
}

module.exports =  BahModel;
