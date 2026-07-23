import "dotenv/config";
import passport from "passport";
import { Strategy as GitHubStrategy } from "passport-github2";
import User from "../models/User.js";
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_CALLBACK,
    },
    async (
  accessToken,
  refreshToken,
  profile,
  done
) => {
  try {
    let user = await User.findOne({
      githubId: profile.id,
    });

    if (!user) {
      user = await User.create({
        githubId: profile.id,
        username: profile.username,
        displayName: profile.displayName,
        email: profile.emails?.[0]?.value || "",
        avatar: profile.photos?.[0]?.value || "",
        accessToken,
      });

      console.log("✅ New user created");
    } else {
      user.accessToken = accessToken;
      await user.save();

      console.log("✅ Existing user logged in");
    }

    return done(null, user);
  } catch (err) {
    return done(err, null);
  }
}
  )
);
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);

    done(null, user);
  } catch (err) {
    done(err, null);
  }
});