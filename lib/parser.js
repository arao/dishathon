/*
    input: Text String containing keywords
    output: keywords in different categories
 */
let keywords = require('./keywords');

class Grammer{
    constructor(){
        this.createRegex();
    }
    createRegex(){
        this.regex = {
            channelNumber:/\b[0-9]+\b/gmi
        };
        for(let item in keywords){
            let temp = "";
            for(let value of keywords[item] ){
                temp+='('+value+')|';
            }
            temp = temp.substring(0,temp.length-1);
            this.regex[item] = new RegExp('\\b'+temp+'\\b', 'gim');
        }
    }

}

class Parser{
    constructor(string='') {
        this.string = string;
        this.output=[];
        this.grammer = new Grammer();
    };

    set String(string){
        this.output = [];
        this.string = string;
        this.parser();
    }

    get String(){
        return this.string;
    }

    parser() {
        // if string mach actions
        // if(this.string.match(this.grammer.regex.command)) {   // if there is a command
        //     let positive = /\b(next)|(up)|(increase)|(forward)\b/gmi;
        //     let negative = /\b(previous)|(down)|(decrease)|(backward)|(back)\b/gmi;
        //
        //     // //handle mute command
        //     // if(this.string.match(/\bmute\b/)){
        //     //     this.output.push({action:"volume", specification:"0"});
        //     // }else if(this.string.match(positive)){  //if there is poitive commnad
        //     //     if(this.string.match(/\bvolume\b/)){
        //     //         this.output.push({action:"volume", specification:"up"});
        //     //     }
        //     //     if(this.string.match(/\bchannel\b/)){
        //     //         this.output.push({action:"channel", specification:"up"});
        //     //     }
        //     // }else if(this.string.match(negative)){
        //     //     if(this.string.match(/\bvolume\b/)){
        //     //         this.output.push({action:"volume", specification:"down"});
        //     //     }
        //     //     if(this.string.match(/\bchannel\b/)){
        //     //         this.output.push({action:"channel", specification:"down"});
        //     //     }
        //     // }
        // }
        if(this.string.match(this.grammer.regex.action)){
            let keywords = {};
            keywords.channelNumber = this.string.match(this.grammer.regex.channelNumber);
            keywords.channelName = this.string.match(this.grammer.regex.channelName);
            keywords.actor = this.string.match(this.grammer.regex.actor);
            keywords.category = this.string.match(this.grammer.regex.category);

            this.output.push({action:"channel", specification:keywords});
        }

    }
}
module.exports = Parser;