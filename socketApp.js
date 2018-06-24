let socket_io = require('socket.io');
let io = socket_io();
let socketApi = {};
let debug = require('debug')('dishathon:socket');
let Parser = require('./lib/parser');
let channel = require('./model/channel');
let actor = require('./model/actor');


socketApi.io = io;

let parser = new Parser();


io.on('connection', function(socket){
    debug('A user connected');
    socket.on('request', async (text)=>{
        parser.String = text;
        debug(parser.output);
        if(typeof parser.output[0].specification === 'object'){
            let temp = await getChannel(parser.output[0].specification);
            parser.output = {action:'channel', specification: temp };
            socket.emit('response', parser.output.specification);
        }else{
            socket.emit('response', parser.output.specification);
        }

    });

    socket.on('learn',async (obj)=>{
        let channel = await channel.findById(obj._id);
        channel.weight+= Math.floor(Math.log2(channel.weight));
        channel.save();
    });
});

async function common(a,b) {
    a.sort((a,b)=>{return ((a._id < b._id) ? -1 : (a._id === b._id?0:1))});
    b.sort((a,b)=>{return ((a._id < b._id) ? -1 : (a._id === b._id?0:1))});
    commonvalue = [];
    for(element of a){
        for(let x of b){
            if(element._id === x._id){
                common.push(a);
                break;
            }
        }
    }
return commonvalue;
}

async function getChannel(obj){
    let actorChannel=[];
    let categoryChannel=[];
    debug("object");
    debug(obj);
    if(obj.actor != null) {
        let temp = await actor.find({$or:[{'firstname':obj.actor}, {'lastname':obj.actor}]});
        debug(temp);
        let channels = temp.map((x)=>{return x.channel});
        // debug(channels);
        actorChannel = await channel.find( { '_id':channels } );
    }
    if(obj.category != null){
        categoryChannel = await channel.find({'category':obj.category});
    }

    actorChannel.sort((a,b)=>{return ((a._id < b._id) ? -1 : (a._id === b._id?0:1))});
    categoryChannel.sort((a,b)=>{return ((a._id < b._id) ? -1 : (a._id === b._id?0:1))});

    let commonChannel = common(actorChannel, categoryChannel);
    if(!commonChannel.length) {
        commonChannel = actorChannel;
        commonChannel.push(...categoryChannel);

    }
    commonChannel.sort((a,b)=>{return ((a.weight < b.weight) ? -1 : (a.weight === b.weight?0:1))});
    return Promise.resolve(commonChannel[0].number);
}



module.exports = socketApi;