require("dotenv").config();
const express = require("express");
const cors = require("cors");
const session = require("express-session");

const passport = require("passport");
const routes = require("./routes");
const cookieParser = require("cookie-parser");

const app = express();
app.set("trust proxy", 1);

app.use(
  cors({ origin: "https://welcome.pickinguptime.com", credentials: true })
);

app.use(function (req, res, next) {
  res.header(
    "Access-Control-Allow-Origin",
    "https://welcome.pickinguptime.com"
  );
  res.header("Access-Control-Allow-Credentials", true);

  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  next();
});

app.use(cookieParser(process.env.SECRET_KEY));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  session({
    store: new (require("connect-pg-simple")(session))({
      conString: process.env.DATABASE_URL,
    }),
    secret: process.env.SECRET_KEY,
    saveUninitialized: true,
    resave: false,
    cookie: {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
      secure: true,
      domain: ".pickinguptime.com",
    },
  })
);

require("./config/passport");

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  console.log(req.session);
  console.log(req.user);
  next();
});

app.use(routes);

app.listen(process.env.PORT);
