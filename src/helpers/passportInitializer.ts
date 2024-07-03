import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import connection from "../db";

const opts = {
  // jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  jwtFromRequest: ExtractJwt.fromHeader("authorization"),

  secretOrKey: process.env.ACCESS_TOKEN_SECRET!,
};

passport.use(
  new JwtStrategy(opts, async (jwt_payload, done) => {
    console.log(jwt_payload);
    try {
      const userId = jwt_payload.payload.id;

      // Query user from the database
      const [rows] = await connection
        .promise()
        .query<any>("SELECT * FROM users WHERE id = ?", [userId]);

      if ((rows as any[]).length > 0) {
        console.log(rows[0]);
        return done(null, rows[0]);
      } else {
        return done(null, false);
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      return done(error, false);
    }
  })
);
