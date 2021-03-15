const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

// USER MODEL
const User = require('../models/user');

module.exports = (passport) => {
    passport.use(new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
        try {
            // MATCH USER
            const user = await User.findOne({ email });
            if(!user) {
                // null => error
                // false => user
                // options => a JS object
                return done(null, false, { message: 'That email is not registered!'});
            }
            // MATCH PASSWORD
            await bcrypt.compare(password, user.password, (err, same) => {
                if(err) {
                    throw err;
                }
                if(same) {
                    return done(null, user);
                } else {
                    return done(null, false, { message: 'Password is incorrect' });
                }
            })
        } catch (error) {
            console.log(error);
        }
    }));

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser(async (id, done) => {
        await User.findById(id, (err, user) => {
            done(err, user);
        });
    });
}
