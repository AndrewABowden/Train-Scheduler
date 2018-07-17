let config = {
  apiKey: "AIzaSyCgciZdnm-mZmU1fBlN01-YaXcjMJ1LtEI",
  authDomain: "andrewfirstproject.firebaseapp.com",
  databaseURL: "https://andrewfirstproject.firebaseio.com",
  projectId: "andrewfirstproject",
  storageBucket: "andrewfirstproject.appspot.com",
  messagingSenderId: "798218207140"
};
firebase.initializeApp(config);
let database = firebase.database();


$("#submit").on("click", function (event) {
  event.preventDefault();

  let trainName = $("#trainName").val().trim();
  let destination = $("#destination").val().trim();
  let time = $("#time").val().trim();
  let frequency = parseInt($("#frequency").val().trim());
  console.log(trainName)
  console.log(destination)
  console.log(time)
  console.log(frequency)

  database.ref().push({
    dataTrainName: trainName,
    dataDestination: destination,
    dataTime: time,
    dataFrequency: frequency,
    dateAdded: firebase.database.ServerValue.TIMESTAMP
  });
});



database.ref().on("child_added", function (childSnapShot) {
//firebase snapshots to record data
  let trainName = childSnapShot.val().datatrainName;
  let destination = childSnapShot.val().dataDestination;
  let time = childSnapShot.val().dataTime;
  let frequency = childSnapShot.val().dataFrequency;

  console.log(trainName);
  console.log(destination);
  console.log(time);
  console.log(frequency);

 

  // Moment.js time conversions
  let timeConversion = moment(time, "hh:mm").subtract(1, "years");
  let currentTime = moment(); // CT
  console.log("Current time: " + moment(currentTime).format("hh:mm"));
  let diff = moment().diff(moment(timeConversion), "minutes"); // Current time - converted time
  console.log("diff in time: " + diff);
  let remains = diff % frequency
  console.log("Time Remaining: " + remains);// Calculates time remaining
  let minsAway = frequency - remains;
  console.log("mins away till next train: " + minsAway);// Calculates time remaining
  let nextTrain = moment().add(minsAway, "minutes"); // Arrival time formul
  console.log("arrival time: " + moment(nextTrain).format('HH:mm A'));

                 
  // Creates td for each value
  let tableRow = $("<tr>");
  let trainNameTd = $("<td>").text(childSnapShot.val().dataTrainName);
  let newDestinationTd = $("<td>").text(childSnapShot.val().dataDestination);
  let newFrequencyTd = $("<td>").text(childSnapShot.val().dataFrequency);
  let newArrivalTd = $("<td>").text(moment(nextTrain).format("hh:mm"));
  let newMinutesTd = $("<td>").text(minsAway);

  if (minsAway == NaN) {
    let newMinutesTd = $("<td>").text("No data to display");
    console.log(newMinutesTd);
  }

  // Adds data to chart
  tableRow.append(trainNameTd, newDestinationTd, newFrequencyTd, newArrivalTd, newMinutesTd);
  $("#data").append(tableRow);

}, function (error) {
  console.log("Read Unsuccesful" + error.code);
});
// clears out database info
$("#clearBtn").on("click", function () {
  database.ref().remove();
});


    
