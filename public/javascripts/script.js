const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

var video = document.getElementById("videoFrame");
const socket = io();
var i=0;
recognition.lang = 'en-US';
recognition.interimResults = false;
recognition.continuous = true;

$(document).ready(function(){

    // for(var i=0;i<52;i++){
    //     $("#mySlider").append("<div id=\""+(i+1)+"\"><a href=vid/"+(387+i)+".mp4"+"><img src=\""+"http://placehold.it/240x100&amp;text=channel "+(i+1)+"\" class=\"img-fluid\"><p>Channel "+(i+1)+"</p></a></div>")
    // }

	$(window).resize(function() {
    $('#videoFrame').height($(window).height() - 156);
    $('#mySlider').height($(window).height() - 91);
	});
	$(window).trigger('resize');

	// Setting the action onclick for each thumbnail
  $("#mySlider").find("div").each(function(){
    var innerDivId = $(this).children().click(function(e){
        e.preventDefault();
        var video_url = $(this).attr("href");
        $("#myVideo").children("#videoFrame").children("source").attr("src",video_url);
        var current = $("#myVideo").children("#videoFrame").children("source").attr("src");
        video.load();
        video.play();
    });
  });  

	// window.setInterval(function(){
	// 	console.log(video.currentTime);
	// 	console.log("its been 50 sec");
	// }, 50000);
});

// function change(){
//     $("#mySlider").find("div").each(function(){
//         var innerDivId = $(this).children().click(function(e){
//             e.preventDefault();
//             var video_url = $(this).attr("href");
//             $("#myVideo").children("#videoFrame").children("source").attr("src",video_url);
//             var current = $("#myVideo").children("#videoFrame").children("source").attr("src");
//             video.load();
//             video.play();
//         });
//     });
// }

function changeChannel(src){
    var player = $('#playerSource');
    player.attr('src', src);
}

// Start the voice recognition
document.querySelector('#myButton').addEventListener('click', () => {
	console.log('button cliked');
  recognition.start();
});

// Process the result from speech recognition
recognition.addEventListener('result', (e) => {
	console.log('recognition');
  let last = e.results.length - 1;
  let text = e.results[last][0].transcript;
	console.log(text);
  console.log('Confidence: ' + e.results[0][0].confidence);
  if(localParser(text)){
      socket.emit('request',text.toLowerCase());
      socket.on('response',(obj)=>{
          playChannel(obj);
      });
  }
});


// Recieve the output from the back end
// socket.on('bot reply', function(replyText) {
// 	console.log(replyText);
//   synthVoice(replyText);
// });

// Give a voice feedback of the output
function synthVoice(text) {
  const synth = window.speechSynthesis;
  const utterance = new SpeechSynthesisUtterance();
  utterance.text = text;
  synth.speak(utterance);
}

function localParser(string){
    var positive = /\b(next)|(up)|(increase)|(forward)\b/gmi;
    var negative = /\b(previous)|(down)|(decrease)|(backward)|(back)\b/gmi;
    var comm = /\b(next)|(up)|(increase)|(forward)|(previous)|(down)|(decrease)|(backward)|(back)|(mute)|(volume)|(channel)|(stop)|(pause)|(resume)\b/gmi;
    if(string.match(comm)){
        if(string.match(/\b(stop)|(pause)\b/i)){
            video.pause();
        }else if(string.match(/\bresume\b/igm)){
            video.play();
        }else if(string.match(/\bmute\b/gmi)){
            console.log("mute kjkj");
            video.volume = 0.0;
        }else if(string.match(positive)){  //if there is poitive commnad
            if(string.match(/\bvolume\b/gmi)){
                video.volume += 0.2 ;
            }
            if(string.match(/\bchannel\b/gmi)){
                var currnumber = getChannelName();
                playChannel(currnumber+1);
            }
        }else if(string.match(negative)){
            if(string.match(/\bvolume\b/gmi)){
                if(video.volume > 0) {
                    console.log("downl");
                    video.volume -= 0.2;
                }
            }
            if(string.match(/\bchannel\b/gmi)){
                var currnumber = getChannelName();
                playChannel(currnumber-1);
            }

        }
        else if(string.match(/(volume)/gmi)){
            video.volume += 0.2 ;
        }
        else if(string.match(/([0-9])+/)){
            var ch = string.match(/([0-9])+/);
            ch = parseInt(ch);
            console.log(ch);
            playChannel(ch);
        }
        else {
            var currnumber = getChannelName();
            playChannel(currnumber+1);
        }
        return 0;
    }
    return 1;
}

function getChannelName(){
    var vidurl = $("#videoFrame").children("source").attr("src");
    console.log(vidurl);
    var j = vidurl.match(/([0-9])+.mp4/);
    var nadd = parseInt(j);
    nadd=nadd-389;
    return nadd;
}


function playChannel(j){
    if(j>=10 <= 20) {
        var vid_url = "vid/" + (389 + j) + ".mp4";
        $("#videoFrame").children("source").attr("src", vid_url);
        video.load();
        video.play();
        $('#mySlider').animate({
            scrollTop: ($('#' + (j + 1)).offset().top)
        }, 1000);
    }
}
