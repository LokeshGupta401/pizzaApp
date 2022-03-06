require("dotenv").config();
const express = require("express");
const ejs = require("ejs");
const expressLayout = require("express-ejs-layouts");
const path = require("path");
const mongoose = require("mongoose");
const session = require("express-session");
const flash = require("express-flash");
const MongoDbStore = require("connect-mongo");

//Database connection

const url = "mongodb://localhost/pizza";

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

// global middle ware

app.use((req,res,next)=>{
  res.locals.session=req.session;
  next()
})

// express flash middleware

app.use(flash());

// Assets

app.use(express.static("public"));
app.use(express.json())

app.use(expressLayout);

// console.log(path.join(__dirname,'/resources/views'))
app.set("views", path.join(__dirname, "/resources/views"));
app.set("view engine", "ejs");

require("./routes/web")(app);

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
