

// Initialize Firebase
var config = {
    apiKey: "AIzaSyALixaz3CcbTix4zuY9pVtlJfb9zKfZ1oU",
    authDomain: "ap-gtcbc.firebaseapp.com",
    databaseURL: "https://ap-gtcbc.firebaseio.com",
    projectId: "ap-gtcbc",
    storageBucket: "ap-gtcbc.appspot.com",
    messagingSenderId: "531683095752"
};
firebase.initializeApp(config);

var database = firebase.database();

$(document).ready(function () {
    $('#add').on('click', function () {

        console.log("add click");
        // get the textbox values
        var name = $('#nameInput').val().trim();
        var dest = $('#destInput').val().trim();
        var startTime = $('#startTimeInput').val().trim();
        var freq = $('#freqInput').val().trim();

        var anyFieldsMissing = (name == "" || dest == "" || startTime == "" || freq == "");

        if (anyFieldsMissing) {
            $("#error").html("All fields are required");
            $("#error").css("color", "red");
        }
        else {
            database.ref("/trainData").push({
                trainName: name,
                trainDest: dest,
                trainStartTime: startTime,
                trainFreq: freq
            });

            $('#nameInput').val("");
            $('#destInput').val("");
            $('#startTimeInput').val("");
            $('#freqInput').val("");
            $("#error").html("");

        }


    });
});

database.ref("/trainData").on("child_added", function (childSnapshot) {
    
    // Store everything into a variable.
    var trainName = childSnapshot.val().trainName;
    var trainDest = childSnapshot.val().trainDest;
    var trainStartTime = childSnapshot.val().trainStartTime;
    var trainFreq = childSnapshot.val().trainFreq;

    //Calculate all arrivals time using the start time
    var startTime = moment(trainStartTime, "HH:mm");
    var currentTime = moment();
    //How many min are between the first train and now?
    var diffInMinutes = currentTime.diff(moment(startTime), "m");
    //Find remainder and subtract from the frequency to tell us how many min away it is
    var remainder = diffInMinutes % trainFreq;
    var minAway = trainFreq - remainder;
    //add minutes away to the current time to find next arrival time
    var nextArrival = currentTime.add(minAway, "m").format("h:mm A");
    console.log("nextArr " + nextArrival);

    // Add each train's data into the table
    $("#trainGrid").append("<tr><td>" + trainName + "</td><td>" + trainDest + "</td><td>" +
        trainFreq + "</td><td>" + nextArrival + "</td><td>" + minAway + "</td></tr>");
});


// function startTimer(){
//     clearInterval(intervalId);
//     timer = 60;
//     intervalId = setInterval(timerCountdown, 1000);

// }

// function timerCountdown(){
//     timer--;
//     if(timer === 0){
//         var currentTime = moment().format("hh:mm:ss");
//         ref.update({lastUpdate: currentTime})
//         startTimer();        
//     }
// }
