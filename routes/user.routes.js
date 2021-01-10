const {Router} = require('express');
const router = Router();
const USER = require('../db/user.scema');

router.get("/all", (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    USER.find({}, (err, users) => {
        if(err)
        {
            console.log(err);
            if(err) return res.status(500).send({ error: "cant find user in mongoDB" });
        }
        res.send(users);
    });
});

router.get("/us/?:id", (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    USER.findOne({username: req.params.id }, (err, user) => {
        if(err)
        {
            console.log(err);
            return res.status(500).send({error: `cant find user with username ${req.params.id}`});
        }
        if(user == null){
            return res.status(400).send({ error: `user with name:  ${req.params.id} - don't exist` });
        }
        res.send(user);
    });
});

router.post("/add", (req, res) => {
    USER.findOne({user_id:req.body.userId}, (err, userFind) => {
        if(userFind == null)
        {
            const userName = req.body.username;
            const password = req.body.password;
            const organization = req.body.org ? req.body.org : "-";
            const info = req.body.info ? req.body.info : "-";
            const newUser = {
                username: userName,
                password: password,
                org: organization,
                info : info

            };
            newUser.save((err) => {
                if(err) return res.status(500).send({ error: "cant save user in mongoDB" });
                res.send(newUser);
            });
        }
        else {
            res.status(400).send({ error: `user id - ${req.body.userId} already exist` });
        }
    });
});

router.put("/update", (req, res) => {
    if(!req.body) res.status(400).send({ error: "invalid request, no body" });
    const userName = req.body.username;
    const password = req.body.password;
    const organization = req.body.org ? req.body.org : "-";
    const info = req.body.info ? req.body.info : "-";
    const newUser = {
        username: userName,
        password: password,
        org: organization,
        info : info

    };
    try {
        USER.updateOne({username: userName}, newUser, (err, user) => {
            if (err) {
                return res.status(500).send({error: "cant update info in mongoDB"});
            }
            if (user == null) {
                return res.status(400).send({error: `invalid user id  - ${req.body.userId}`});
            }
            res.send(user);
        });
    }
    catch (err) {
        console.log(err);
        return res.status(500).send({error: "cant update info in mongoDB"});
    }
});

router.delete("/:id", (req, res) => {
    if(!req.params.id) return res.status(400).send({ error: "invalid request, id don't exist" });
    USER.findOne({user_id: req.params.id}, (err, userIdFind) => {
        if(err){
            console.log(err);
            return res.status(500).send({error: "cant delete user in mongoDB"});
        }
        if(userIdFind) {
            console.log(userIdFind._id);
            user.findByIdAndDelete(userIdFind._id, (err, user) => {
                if (err) {
                    console.log(err);
                    return res.status(500).send({error: "cant delete user in mongoDB"});
                }
                if (user == null) {
                    return res.status(400).send({error: `user with id:  ${req.params.id} - don't exist`});
                }
                res.send(user);
            });
        }
        else {
            return res.status(400).send({error: "invalid request, id don't exist"});
        }
    });
});

router.get("/init", (req, res) => {
    let users = [
        {username: 'roma1', password: 'roma', org: 'lyn', info: 'manager'},
        {username: 'roma2', password: 'roma', org: 'lyn', info: 'manager'},
        {username: 'roma3', password: 'roma', org: 'lyn3', info: ' - '}
    ];

    USER.collection.insertMany(users, (err, docs) => {
        if (err) {
            return console.error(err);
        } else {
            console.log("users has inserted to User collection");
            res.send({msg : "users has inserted to User Collection"});
        }
    });
});

module.exports = router;
