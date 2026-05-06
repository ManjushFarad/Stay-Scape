const express = require('express');
const app = express();
const port = 3000;
const flash = require('connect-flash');

const session = require('express-session');

const sessionOptions = {
    secret: "secretkey",
    resave: false,
    saveUninitialized: true
};

app.use(session(sessionOptions));
app.use(flash());

app.use((req, res, next) => {
    res.locals.successMsg = req.flash('success');
    res.locals.errorMsg = req.flash('error');
    next();
})

app.get("/register", (req, res) => {
    let { name = "anonymous" } = req.query;
    req.session.name = name;
    if (name === "anonymous") {
        req.flash('error', 'User not registered');
    } else {
        req.flash('success', 'User Registered successfully');
    }
    res.redirect("/hello");

});

app.get("/hello", (req, res) => {
    let { name } = req.session;
    res.render("page.ejs", { name });
})

// app.get("/count", (req, res) => {
//     if (req.session.count) {
//         req.session.count = req.session.count + 1;
//     }
//     else {
//         req.session.count = 1;
//     }
//     res.send(`You have visited this page ${req.session.count} times`);
// })


// app.get("/signedcookies",(req,res)=>{
//     res.cookie("Country","India",{signed:true});
//     res.send("Signed Cookie Set");
// })

// app.get("/verify",(req,res)=>{
//     console.log(req.signedCookies);
//     res.send("Signed Cookie Verified");
// })

// app.get("/home", (req, res) => {
//     console.log(req.cookies);
//     res.send("Working Fine");
// });

// app.get("/route", (req, res) => {
//     let { name = "anonymous" } = req.cookies;
//     let { location } = req.cookies;
//     res.send(`name : ${name} and location : ${location}`);
// });

// app.get("/cookies", (req, res) => {
//     res.cookie("location", "vangani");
//     res.send("Cookie Set");
// });

app.listen(port, () => {
    console.log(`Server is Working on port ${port}`);
});