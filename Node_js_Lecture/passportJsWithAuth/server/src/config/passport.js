import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/User.models.js";
import bcrypt from "bcryptjs";

// Local Strategy

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      try {
        const user = User.findOne({ email });
        if (!user) {
          return done(null, false, { message: "Invalid Email" });
        }
        if (!user.password) {
          return done(null, false, { message: "No Password yet." });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
          return done(null, false, { message: "Invalid password" });
        }

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    },
  ),
);

// google strategy

passport.use(
  new GoogleStrategy(
    {
      clientID:process.env.CLIENT_ID,
      clientSecret:process.env.CLIENT_KEY,
      callbackURL:"/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ googleId: profile.id });
        if (user) {
          user.googleId = profile.id;
          await user.save();
          return done(null, user);
        }

        const newUser = new User({
          googleId: profile.id,
          email: profile.emails[0].value,
          name: profile.displayName,
        });

        await newUser.save();

        return done(null, newUser);
      } catch (err) {
        return done(err);
      }
    },
  ),
);

passport.serializeUser((user , done) => {
  done(null , user.id)
})

passport.deserializeUser(async(id , done) => {
  try{
    const user = await User.findById(id)
    done(null , user)
  }catch(err){
    return done(err)
  }
})
