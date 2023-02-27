require("dotenv").config();
const express = require("express");
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");
const routes = require("./routes");
const app = express();

app.use(
  session({
    store: new (require("connect-pg-simple")(session))({
      conString: process.env.DATABASE_URL,
    }),
    secret: "cat",
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      sameSite: "none",
      httpOnly: false,
      secure: true,
    },
  })
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
require("./config/passport");

app.use(cors({ origin: "http://localhost:3001", credentials: true }));

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:3001");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Credentials", true);
  next();
});

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  console.log(req.session);
  console.log(req.user);
  next();
});
app.use(routes);

app.listen(process.env.PORT);
