 // JavaScript Document

 // Initialize Firebase
 var config = {
     apiKey: "AIzaSyAesU_7OkPR660G1KaJ8SQZg9BV6bL6QhQ",
     authDomain: "fireball-7d56c.firebaseapp.com",
     databaseURL: "https://fireball-7d56c.firebaseio.com",
     projectId: "fireball-7d56c",
     storageBucket: "fireball-7d56c.appspot.com",
     messagingSenderId: "373390257222"
 };

 firebase.initializeApp(config);
 var database = firebase.database();

 var trainName = "";
 var destination = "";
 var firstTrain = "";
 var frequency = "";

 $("#search").on("click", function(event) {
     event.preventDefault();

     trainName = $("#train-input").val().trim();
     destination = $("#destination-input").val().trim();
     firstTrain = $("#firstTrain-input").val().trim();
     frequency = $("#frequency-input").val().trim();

     // Get a reference to the database service

     database.ref().push({
         trainName: trainName,
         destination: destination,
         firstTrain: firstTrain,
         frequency: frequency
     });

 });

 database.ref().on("child_added", function(childSnapshot) {
    console.log(childSnapshot.val());

    var trainName = childSnapshot.val().trainName;
    var destination = childSnapshot.val().destination;
    var frequency = childSnapshot.val().frequency;
    var militaryTime = childSnapshot.val().firstTrain;

    var militaryTime = "14:00";
    var currentDate = moment().format("MM-DD-YYYY");
    var hourMinutes = militaryTime.split(":"); // returns an array ["14", "00"]
    var hour = hourMinutes[0];
    var minutes = hourMinutes[1];
    
    var newHour;
    if (hour > 12) {
        newHour = hour - 12;
    } else {
        newHour = hour;
    }
    
    var meridiem;
    if (hour >= 12) {
        meridiem = "PM";
    } else {
        meridiem = "AM";
    }
    
    console.log(hourMinutes);
    console.log(moment(currentDate + " " + newHour + ":" + minutes + " " + meridiem).format("DD/MM/YY hh:mm A")); 

    var militaryTimeMomentObject = moment(currentDate + " " + newHour + ":" + minutes + " " + meridiem);
    var trainStartingUnixTime = militaryTimeMomentObject.unix();
    var nowUnixTime = moment().unix();
    
    var frequencyInSeconds = frequency * 60; // 15 * 60 = 600 + 300 = 900 seconds
    
    while (trainStartingUnixTime < nowUnixTime) {
        trainStartingUnixTime = trainStartingUnixTime + frequencyInSeconds;
    }
    
    var trainAwayInSeconds = trainStartingUnixTime - nowUnixTime;
    var trainAwayInMinutes = Math.floor(trainAwayInSeconds / 60);
    
    var nextArrivalMoment = moment.unix(trainStartingUnixTime);
    var nextArrivalString = nextArrivalMoment.format("hh:mm A");
    
    // console.log(militaryTimeMomentObject.add(7, 'days');

    $("#TrainName > tbody").append("<tr><td>" + trainName + "</td><td>" + destination + "</td><td>" + frequency + "</td><td>" + nextArrivalString + "</td><td>" + trainAwayInMinutes + "</td></tr>");

 }, function(errorObject) {
     console.log("Failure Alert: " + errorObject.code);
 });
 