const express = require('express');
const session = require('express-session');
const app = express();

const path = require('path');
const flash = require('connect-flash');


app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));

app.use(session({   // also store all session in any one variable
    secret: 'mysuperseceretstring',
     resave: false, 
     saveUninitialized: true 
    })
);
app.use(flash());

app.use((req, res, next) => {
    res.locals.message = req.flash("success");
    res.locals.errMsg = req.flash("error");
    next();
});

app.get("/register", (req, res) => {
    let {name = 'anoyomous'} = req.query;
    req.session.name = name;
    //store flash message
    if(name === 'anoyomous'){
        req.flash("error", "Not registered!");
    }else{
        req.flash("success", "user register sucessfully!");
    }
    res.redirect("/hello");
});

app.get("/hello", (req, res) => {
    // const message = req.flash("success");
    res.render("page.ejs", {
        name: req.session.name
    });
});
// app.get('/reqcount',(req, res) => {
//     if(req.session.count){
//         req.session.count++;
//     }else{
//         req.session.count = 1;
//     };

//     res.send(`you send a request ${req.session.count} times.`);
// });
app.listen("3000", () => {
    console.log("App is listen on port no 3000");
});