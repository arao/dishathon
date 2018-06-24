let express = require('express');
let router = express.Router();
let channel = require('../model/channel');

let io = require('../socketApp').io;
/* GET home page. */
router.get('/', async function(req, res, next) {
    let ch = await channel.find({},'id number link name');
    // console.log(ch);
    res.render('index', { title: 'Express', channels:ch});
});

module.exports = router;
