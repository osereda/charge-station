const AOModel = require('../db/models/ao.model');
const AO = new AOModel;

class AoService {

    async GetAllInvoice() {
        const result = await AO.getAll();
        return result;
    };

    async setInvoice(data) {
        let receipt = Math.floor(Math.random() * Math.floor(10000));
        let newData = {
            info: ("invoice " + receipt),
            receipt: receipt,
            status: true,
            amount: data * (-1),
            balance: data * (-1)
        }
        const result = await AO.save(newData);
        return result;
    };

    async payInvoice(data) {
        const lastRecord = await AO.getLastRecord();
        const receipt = lastRecord[0]._doc.ao_receipt;
        const amount = lastRecord[0]._doc.ao_amount;
        let newData = {
            info: ("pay " + receipt),
            receipt: "PR " + receipt,
            status: true,
            amount: data,
            balance: data + amount
        }
        const result = await AO.save(newData);
        return result;
    };

    async addInvoice(inputData) {
        if(inputData) {
            const latRecordBah = await AO.getLastRecord();
            const checkDate = latRecordBah[0]._doc.ao_date.getDate() === new Date().getDate() ? false : true;
            if(checkDate) {
                const currentAld = latRecordBah[0]._doc.ao_balance_current;
                const amount = inputData * 0.01;
                const currentNew = currentAld - amount;
                let newData = {
                    current: currentNew,
                    amount: amount
                }

                const result = await AO.create(newData);
                return result;
            } else {
                const filter = latRecordBah[0]._doc._id;
                console.log("filter" + filter);
                const currentAld = latRecordBah[0]._doc.ao_balance_current;
                const amount = (inputData * 0.1) + latRecordBah[0]._doc.ao_balance_amount;
                const currentNew = currentAld - amount;
                const updateData = {
                    filter: filter,
                    current: currentNew,
                    amount: amount
                }
                const result = await AO.update(updateData);
                return result;
            }
        } else {
            return false;
        }
    };

    async UpdateInvoice(inputAO) {
        const latRecord = await AO.getLastRecord();
        console.log(latRecord[0]._doc._id);
        const result = await AO.update( latRecord[0]._doc._id, inputAO);
        return result;
    };
}

module.exports =  AoService;
