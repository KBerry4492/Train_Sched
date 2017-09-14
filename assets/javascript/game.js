$(document).ready(function(){

// Declare Variables

var schedArray = [];

var name = "";
var dest = "";
var freq = 0;
var nextA = 0;
var minAway = 0;

console.log(moment().format("X")); //check moment works

// Functions

//Firebase linkup
var config = {
	  apiKey: "AIzaSyCfWhWIebuM8W9B4SpgxGhr15FVOOsKzCU",
	  authDomain: "prototype-cf9a3.firebaseapp.com",
	  databaseURL: "https://prototype-cf9a3.firebaseio.com",
	  projectId: "prototype-cf9a3",
	  storageBucket: "prototype-cf9a3.appspot.com",
	  messagingSenderId: "1066270105301"
	};

firebase.initializeApp(config);

var database = firebase.database();

var firePush = function(){

	database.ref().push({
      data_name: name,  
      data_dest: dest,
      data_freq: freq,
      data_nextA: nextA,
      data_time: firebase.database.ServerValue.TIMESTAMP
    });
}

var trainTime = function(){

	name = $("#name").val().trim();
	dest = $("#dest").val().trim();
	first = $("#first").val().trim();
	freq = $("#freq").val().trim();

	var firstTrainTime = Math.floor((moment(first, "HH/mm").unix())/60);
	var currentTime = Math.floor((moment().unix())/60);

	minAway = (freq-((currentTime-firstTrainTime)%freq));

	nextA = moment().add(minAway, 'minutes').format("h:mm");

	schedArray = [name, dest, freq, nextA, minAway];

}

// Event Listeners

$(document).on("click", "#submit", function(event){

	event.preventDefault(); //stop refresh

	trainTime();

	firePush();

});

database.ref().on("child_added", function(snapshot) {

	name = snapshot.val().data_name;
	dest = snapshot.val().data_dest;
	freq = snapshot.val().data_freq;
	nextA = snapshot.val().data_nextA;

	var newRow = $("<tr>");

	for (var i = 0; i < schedArray.length; i++) {
		
		newRow.append("<td>" + schedArray[i] + "</td>");
	}

	$("#tBod").append(newRow);

	$("#name").val("");
	$("#dest").val("");
	$("#first").val("");
	$("#freq").val(""); 

	    // Create Error Handling
	  },  function(errorObject) {
	  console.log("The read failed: " + errorObject.code);
	
});

});