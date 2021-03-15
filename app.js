require('./database/connection');
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const { sessionSecret } = require('./utils/config');
require('./utils/passport')(passport);

const app = express();

// EJS MIDDLEWARES
app.use(expressLayouts);
app.set('view engine', 'ejs');

/// BODYPARSER
app.use(express.urlencoded({ extended: false }));

// EXPRESS SESSION MIDDLEWARE
app.use(session({
    secret: sessionSecret,
    resave: true,
    saveUninitialized: true
}));

// PASSPORT MIDDLEWARES
app.use(passport.initialize());
app.use(passport.session());

// CONNECT FLASH MIDDLEWARE
app.use(flash());

// GLOBAL VARIABLES
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
})

// ROUTES
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/user'));


// CONNECTION PARAMETERES
const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log("server is running on port:", PORT));