let mongoose = require('mongoose');
let keys = require('../config/keys');
let channel  = require('../model/channel');
let actor = require('../model/actor');
let data = require('../lib/data');

console.log(typeof data);

mongoose.connect(`mongodb://${keys.mlab.user}:${keys.mlab.password}@ds117101.mlab.com:17101/${keys.mlab.db}`)
    .then(data=>{
        console.log('connected to db');
    })
    .catch(err=>{
        console.log(`name: ${err.name}, message: ${err.message}`);
    });

async function f() {
    let ch = await channel.findOne({name:"star utsav"});
    let obj = {firstname:"Akshay", 'lastname':"kumar", channel:ch};
    let ac = new actor(obj);
    let res = await ac.save();
    console.log(res);
}

async function addChannel(){
    let news = ['zee news', 'abp news', 'aaj tak']; //'india tv','ibn 7','ndtv india','sahara','india news','tez','cnbc awaz','z business'
    let drama = ['star plus']; //,'sony entertainment','sony','zee network','colors','rishtey','star tv', 'zee tv', 'star utsav'
    let movies = ['star gold', 'sony tv', 'hbo']; //, 'set max','zee cinema','utv action','and pictures','utv movies','star movies'
    let cartoon = ['cartoon network','nick'];//,'disney','pogo','discovery kids','hungama'
    let music = ['mtv','zing'];
    let tempnews = [];
    let tempdrama = [];
    let tempmovies = [];
    let tempcartoon = [];
    let tempmusic = [];

    let i = 10;
    for(ch of news) {
        let temp = new channel({name: ch, weight: 1, category:"news", number:i, link:data.find(o => o.name === ch).link });
        i++;
        tempnews.push(await temp.save());
    }
    console.log("news done");
    for(ch of drama) {
        let temp = new channel({name: ch, weight: 1,category:"drama", number:i, link:data.find(o => o.name === ch).link});
        i++;
        tempdrama.push(await temp.save());
    }
    console.log("drama done");
    for(ch of movies) {
        let temp = new channel({name: ch, weight: 1, category:"movies",  number:i, link:data.find(o => o.name === ch).link});
        i++;
        tempmovies.push(await temp.save());
    }
    console.log("movies done");
    for(ch of cartoon) {
        let temp = new channel({name: ch, weight: 1, category:"cartoon",  number:i, link:data.find(o => o.name === ch).link});
        i++;
        tempcartoon.push(await temp.save());
    }
    console.log("cartoon done");
    for(ch of music) {
        let temp = new channel({name: ch, weight: 1, category:"music",  number:i, link:data.find(o => o.name === ch).link});
        i++;
        tempmusic.push(await temp.save());
    }
    console.log("music done");
}

async function addActor(){
    let obj1 = [
        {
            firstname:"akshay",
            lastname:"kumar",
            channel:await (channel.find({$or:[{name:['star gold']}]}))
        },
        {
            firstname:"salaman",
            lastname:"khan",
            channel:await (channel.find({$or:[{name:['sony tv', 'hbo']}]}))
        },

    ];
    obj2 = [];
    for(let e of obj1){
        for (let ch of e.channel){
            obj2.push({firstname:e.firstname, lastname:e.lastname, channel: ch});
        }
    }
    for(let en of obj2){
        let temp = new actor(en);
        console.log(await temp.save());
    }
}

async function query(){
    console.log( await actor.find({firstname:"akshay"}));
}

async function main(){
    await addChannel();
    await addActor();
}
setTimeout(main, 1000);
