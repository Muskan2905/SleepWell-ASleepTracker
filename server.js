//creating a server
//load environment variables and set them into dotenv
if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

//requiring modules
const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const passport = require("passport");
const flash = require("express-flash");
const session = require("express-session");
const methodOverride = require("method-override");


const initializePassport = require("./passport-config");

initializePassport(
    passport,
    email => users.find(user => user.email === email),
    id => users.find(user => user.id === id)
);

//representing methods
const app = express();
//array to store user input credentials/data temporarily unless user is using app
//needs to signup every time when user browse
const users = [];

var flag = 0;  //status flag that tells whether request is authenticated or not

//tells server to use ejs syntax
app.set("view engine", "ejs");

//static folders
app.use(express.static(__dirname + "/views"));

//using method of taken modules
app.use(bodyParser.urlencoded({ extended: true }));

app.use(flash());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(methodOverride("_method"));


//get requests
app.get("/", checkSplashAuthentication, function (req, res) {
    res.render("splashPage", { flagValue: flag });
});
app.get("/report", checkAuthentication, function (req, res) {
    res.render("report", { flagValue: flag })
});
app.get("/newentry", checkAuthentication, function (req, res) {
    res.render("newUserLogin", { flagValue: flag });
});
app.get("/signup", checkNonAuthentication, function (req, res) {
    res.render("signup");
});
app.get("/login", checkNonAuthentication, function (req, res) {
    res.render("login");
});


//post requests
app.post("/report", function (req, res) {

});
app.post("/newentry", function (req, res) {
    var currentdate = (req.body.cdate).toString();
    var sleeptime = (req.body.sleepwalaTime).toString();
    var wakeuptime = (req.body.wakeUpwalaTime).toString();
    var sleepDuration = calcSleepDuration(sleeptime, wakeuptime);
    res.send("Sleep duration = " + sleepDuration);
});
app.post("/signup", checkNonAuthentication, async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        users.push({
            id: Date.now().toString(),
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        });
        res.redirect("/login");
    }
    catch {
        res.redirect("/signup");
    }
    console.log(users);
});
app.post("/login", checkNonAuthentication, passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true
}));

//delete request
app.delete("/logout", function (req, res) {
    req.logOut();
    flag = 0;
    res.redirect("/");
});


//Authenication fxns
function checkAuthentication(req, res, next) {
    if (req.isAuthenticated()) {
        flag = 1;
        next();
    }
    else {
        res.redirect("/login");
    }
}
function checkSplashAuthentication(req, res, next) {
    if (req.isAuthenticated()) {
        flag = 1;
    }
    next();
}
function checkNonAuthentication(req, res, next) {
    if (req.isAuthenticated()) {
        flag = 1;
        res.redirect("/");
    }
    else {
        next();
    }
}


//listen to port number
app.listen(3000, function () {
    console.log("Server is running on port 3000");
});



//calculate sleep duration for sleep tracker modal container
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

