const mongoose = require('mongoose');
const MongoClient = require("mongodb").MongoClient;

let url = 'mongodb://localhost:27017/test';
let dbName = "testdb";

MongoClient.connect(url,function(err, client){

    const db = client.db(dbName);
    const collection = db.collection("testcoll");

    let user = {name: "Tom1", age: 213, XXX: "111"};
    collection.insertOne(user, function(err, result){

        if(err){
            return console.log(err);
        }
        console.log(result.ops);
        client.close();
    });
});

module.exports = MongoClient;