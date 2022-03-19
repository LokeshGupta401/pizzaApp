require("dotenv").config();
const express = require("express");
const ejs = require("ejs");
const expressLayout = require("express-ejs-layouts");
const path = require("path");
const mongoose = require("mongoose");
const session = require("express-session");
const flash = require("express-flash");
const MongoDbStore = require("connect-mongo");
const passport=require('passport')

//Database connection

const url = 'mongodb://IAmdigidomDBAdmin:digidomDB%2a116%2523pwd@localhost:27017/pizza?authSource=admin'

//"mongodb://localhost/pizza";

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
const connection = mongoose.connection;

try {
  connection.once("open", () => {
    console.log("Database Connected");
  });
} catch (error) {
  console.log("Database connection failed ", error);
}

// set up express
const app = express();

const PORT = process.env.PORT || 3000;

// session store

// session config
app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    store: MongoDbStore.create({
      mongoUrl: url,
    }),
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
  })
);



// passport setup

const passportInit=require('./app/config/passport');
passportInit(passport)
app.use(passport.initialize())
app.use(passport.session())

// express flash middleware

app.use(flash());

// global middle ware

app.use((req,res,next)=>{
  res.locals.session=req.session;  

  console.log(req.session.passport)
  console.log(req.user)
  res.locals.user=req.user;
 return next()
})

// Assets

app.use(express.static("public"));
app.use(express.urlencoded({extended:false}))
app.use(express.json())

app.use(expressLayout);

// console.log(path.join(__dirname,'/resources/views'))
app.set("views", path.join(__dirname, "/resources/views"));
app.set("view engine", "ejs");

require("./routes/web")(app);

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
