const BahModel = require('../db/models/bah.model');
const Bah = new BahModel;

class BahService {

    async GetAllBah() {
        const result = await Bah.getAll();
        return result;
    };

    async addBah(inputData) {
        if(inputData) {
            const latRecordBah = await Bah.getLastRecord();
            const checkDate = latRecordBah[0]._doc.bah_date.getDate() === new Date().getDate() ? false : true;
            if(checkDate) {
                const currentAld = 100;//latRecordBah[0]._doc.bah_balance_current;
                const amount = inputData * 0.01;
                const currentNew = currentAld - amount;
                let newData = {
                    current: currentNew,
                    amount: amount
                }

                const result = await Bah.create(newData);
                return result;
            } else {
                const filter = latRecordBah[0]._doc._id;
                console.log("filter" + filter);
                const currentAld = latRecordBah[0]._doc.bah_balance_current;
                const amount = (inputData * 0.1) + latRecordBah[0]._doc.bah_balance_amount;
                const currentNew = currentAld - amount;
                const updateData = {
                    filter: filter,
                    current: currentNew,
                    amount: amount
                }
                const result = await Bah.update(updateData);
                return result;
            }
        } else {
            return false;
        }
    };

    async UpdateBah(inputBah) {
        const latRecord = await Bah.getLastRecord();
        console.log(latRecord[0]._doc._id);
        const result = await Bah.update( latRecord[0]._doc._id, inputBah);
        return result;
    };
}

module.exports =  BahService;
