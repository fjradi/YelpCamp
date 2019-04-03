//add dotenv package to protecting Cloudinary API Key
require('dotenv').config();

//all package
var express                     = require("express"),
    app                         = express(),
    bodyParser                  = require("body-parser"),
    mongoose                    = require("mongoose"),
    Campground                  = require("./models/campground"),
    Comment                     = require("./models/comment"),
    seedDB                      = require("./seeds"),
    passport                    = require('passport'),
    localStrategy               = require('passport-local'),
    passportLocalMongoose       = require('passport-local-mongoose'),
    session                     = require('express-session'),
    User                        = require('./models/user'),
    Review                      = require('./models/review'),
    indexRoutes                 = require('./routes/index'),
    campgroundRoutes            = require('./routes/campground'),
    commentRoutes               = require('./routes/comment'),
    reviewRoutes                = require('./routes/review'),
    methodOverride              = require('method-override'),
    flash                       = require('connect-flash'),
    moment                      = require('moment'),
    multer                      = require('multer'),
    cloudinary                  = require('cloudinary');

//connect to mongodb
mongoose.connect(process.env.DATABASEURL);

app.locals.moment = moment;

//Express-Session and PassportJs configuration
app.use(session({
    secret: 'keyboar cat',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//other middleware
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname+"/public"));
app.use(flash());
app.use(function (req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    next();
});
app.use(methodOverride('_method'));
app.set("view engine", "ejs");

//routing
app.use('/', indexRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/comment', commentRoutes);
app.use("/campgrounds/:id/reviews", reviewRoutes);


app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server has started");
});