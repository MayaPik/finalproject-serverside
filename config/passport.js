require("dotenv").config();
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");

const knex = require("knex")({
  client: "pg",
  connection: process.env.DATABASE_URL,
});

// const options = {
//   usernameField: "username",
//   passwordField: "password",
// };

// passport.use(
//   new LocalStrategy(options, async (username, password, done) => {
//     const user = await knex("guide").where({ username: username }).first();
//     if (!user) {
//       return done(null, false);
//     }

//     const match = await bcrypt.compare(password, user.password);
//     if (match) {
//       return done(null, user);
//     } else {
//       return done(null, false);
//     }
//   })
// );

passport.use(
  new LocalStrategy(
    {
      usernameField: "username",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, username, password, done) => {
      const userType = req.query.userType;
      const user = await knex(userType).where({ username: username }).first();
      if (!user) {
        return done(null, false);
      }
      const match = await bcrypt.compare(password, user.password);
      if (match) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.guideid);
});

passport.deserializeUser((guideid, done) => {
  console.log("sttart");
  knex("guide")
    .where({ guideid: guideid })
    .first()
    .then((user) => {
      console.log(user);
      done(null, user);
    })
    .catch((err) => {
      console.log(err);
      done(err);
    });
});

// passport.serializeUser((user, done) => {
//   console.log(user.user_id);
//   done(null, user.user_id);
// });
// passport.deserializeUser((id, done) => {
//   console.log("2" + id);
//   Promise.all([
//     knex("admin").where({ user_id: id }).select(),
//     knex("child").where({ user_id: id }).select(),
//     knex("guide").where({ user_id: id }).select(),
//   ])
//     .then(([admin, child, guide]) => {
//       const user = admin[0] || child[0] || guide[0];
//       if (!user) {
//         console.log("deserializeUser user:", error);
//         return done(null, false);
//       }
//       console.log("deserializeUser user:", user);
//       done(null, user);
//     })
//     .catch((err) => {
//       done(err);
//     });
// });

module.exports = passport;
