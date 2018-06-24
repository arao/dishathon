var channel_array=[
  "https://youtube.com/embed/nudK0Z6pAlM",
  "https://youtube.com/embed/Bb71r28sXEk",
  "https://youtube.com/embed/7gePmoN9gSk",
  "https://youtube.com/embed/KarZNz_kmlA",
  "https://youtube.com/embed/nudK0Z6pAlM",
  "https://youtube.com/embed/Bb71r28sXEk",
  "https://youtube.com/embed/7gePmoN9gSk",
  "https://youtube.com/embed/KarZNz_kmlA",
  "https://youtube.com/embed/nudK0Z6pAlM",
  "https://youtube.com/embed/Bb71r28sXEk",
  "https://youtube.com/embed/7gePmoN9gSk",
  "https://youtube.com/embed/KarZNz_kmlA",
  "https://youtube.com/embed/7gePmoN9gSk",
  "https://youtube.com/embed/7gePmoN9gSk",
  "https://youtube.com/embed/7gePmoN9gSk"
]

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

var video = document.getElementById("videoFrame");
// const socket = io();
var i=0;
recognition.lang = 'en-US';
recognition.interimResults = false;

$(document).ready(function(){

	// Inserting new thumbnail driver elements
	for(var i=0;i<52;i++){
		$("#mySlider").append("<div id=\""+(i+1)+"\"><a href=vid/"+(387+i)+".mp4"+"><img src=\""+"http://placehold.it/240x100&amp;text=channel "+(i+1)+"\" class=\"img-fluid\"><p>Channel "+(i+1)+"</p></a></div>")
	}
	
	// Dynamic height resizing 
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
	var str = text.match(/\b([0-9])+\b/);
	var play = text.match(/play/);
	var pause = text.match(/stop/);
	var volup = text.match(/up/);
	var voldown = text.match(/less/);
	var viddown = text.match(/back/);
	var vidup = text.match(/next/);
	var j = parseInt(str);
	// console.log(vidup);
	function vidPlay(){
		video.play();
	}

	function vidPause(){
		console.log('pause');
		video.pause();	
	}
	function volUp(){
		if(video.volume<=0.8)
			video.volume = video.volume+0.2;
	}	
  function volDown(){
		if(video.volume>=0.2)
			video.volume = video.volume-0.2;
	}
	function playChannel(j){
		var vid_url =  "vid/"+(386+j)+".mp4";
		$("#myVideo").children("#videoFrame").children("source").attr("src",vid_url);
	      video.load();
	      video.play();
		$('#mySlider').animate({
			scrollTop: ($('#'+(j+1)).offset().top)
		},1000);
	}
	function vidNext(options){
		playChannel(options+1);
	}
	function vidPrev(options){
		playChannel(options-1);
	}

	
	if(play){
		console.log('This is running');
		vidPlay();
	}
	else if(pause){
		console.log(pause+"yahan");
		vidPause();
	}
	else if(voldown){
		volDown();		
	}
	else if(volup){
		volUp();
	}
	else if(vidup){
		var vidurl = $("#myVideo").children("#videoFrame").children("source").attr("src");
		console.log(vidurl);
		var j = vidurl.match(/([0-9])+.mp4/);
		console.log(j);
		var nadd = parseInt(j);
		console.log(nadd);
		nadd=nadd-386;
		console.log('\n');
		console.log(nadd);
		vidNext(nadd+1);
	}
	else if(viddown){
		var vidurl = $("#myVideo").children("#videoFrame").children("source").attr("src");
		var j = vidurl.match(/\b([0-9])+\b/);
		console.log(j);
		var nadd = parseInt(j);
		console.log(nadd);
		nadd=nadd-386;
		console.log('\n');
		console.log(nadd);
		var nadd = parseInt(j)-386;
		vidPrev(nadd-1);
	}
	else{
		playChannel(j);
	}

	// Send it via socket on back end
	// socket.emit('chat message', text);
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

