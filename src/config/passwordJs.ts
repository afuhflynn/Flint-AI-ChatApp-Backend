// import passport from "passport";
// import { Strategy as GitHubStrategy } from "passport-github2";
// import { config } from "dotenv";
// import { Request, Response } from "express";
// // import User from "../models/user.model.js";
// config();

// const githubAuth = async (req: Request, res: Response) => {
//   try {
//     passport.use(
//       new GitHubStrategy(
//         {
//           clientID: process.env.GITHUB_CLIENT_ID as string,
//           clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
//           callbackURL: "http://127.0.0.1:3000/auth/github/callback",
//         },
//         function (accessToken, refreshToken, profile, done) {
//           console.log(profile);
//           // User.findOrCreate({ githubId: profile.id }, function (err, user) {
//           //   return done(err, user);
//           // });
//           return done(null, profile);
//         }
//       )
//     );
//   } catch (error) {}
// };

// export default githubAuth;
