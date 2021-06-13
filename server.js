//creating a server
const express = require("express");
const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(__dirname + '/public'));


app.get("/", function (req, res) {
    res.sendFile(__dirname + "/splashPage.html");
});
app.get("/newentry", function (req, res) {
    res.sendFile(__dirname + "/newUserLogin.html");
});

app.post("/newentry", function (req, res) {
    var currentdate = (req.body.cdate).toString();
    var sleeptime = (req.body.sleepwalaTime).toString();
    var wakeuptime = (req.body.wakeUpwalaTime).toString();
    var sleepDuration = calcSleepDuration(sleeptime, wakeuptime);
    res.send("Sleep duration = " + sleepDuration);
});


app.listen(3000, function () {
    console.log("Server is running on port 3000");
});



//calculate sleep duration
function calcSleepDuration(sleeptime, wakeuptime) {
    var sleephr = parseFloat(sleeptime.slice(0, 2));
    var sleepmin = parseFloat(sleeptime.slice(3, 5));
    var wakeuphr = parseFloat(wakeuptime.slice(0, 2));
    var wakeupmin = parseFloat(wakeuptime.slice(3, 5));
    if (sleephr > 12 && wakeuphr <= 12) {
        wakeuphr = wakeuphr + 23;
        if (wakeupmin >= sleepmin) {
            wakeuphr = wakeuphr + 1;
        }
        else {
            wakeupmin = wakeupmin + 60;
        }
    }
    else if (sleephr < 12 && wakeuphr <= 12) {
        if (sleepmin > wakeupmin) {
            wakeupmin = wakeupmin + 60;
            wakeuphr = wakeuphr - 1;
        }
    }
    else if (sleephr >= 12 && wakeuphr >= 12) {
        if (sleepmin > wakeupmin) {
            wakeupmin = wakeupmin + 60;
            wakeuphr = wakeuphr - 1;
        }
    }
    var hr = Math.abs(sleephr - wakeuphr);
    var min = Math.abs(sleepmin - wakeupmin);
    if (min === 60) {
        min = 0;
        hr = hr + 1;
    }
    var sleepinterval = hr.toString() + " hours " + min.toString() + " minutes";
    return sleepinterval;
}
