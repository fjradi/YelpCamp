const   express     = require('express'),
        router      = express.Router(),
        User        = require('../models/user'),
        Campground  = require('../models/campground'),
        passport    = require('passport'),
        middleware  = require('../middleware'),
        multer      = require('multer'),
        cloudinary  = require('cloudinary');

//Multer and Cloudinary Configuration
var storage = multer.diskStorage({
  filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
});

var imageFilter = function (req, file, cb) {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};

var upload = multer({ storage: storage, fileFilter: imageFilter});
cloudinary.config({ 
  cloud_name: 'fjradi', 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});

//LANDING
router.get("/", function(req, res){
    res.render("landing");
});

//REGISTER FORM
router.get('/register', function(req, res){
    res.render("register", {page: 'register'}); 
});

//REGISTER LOGIC
router.post('/register', upload.single('avatar'), function(req, res){
    cloudinary.v2.uploader.upload(req.file.path, function(err, result){
        if(err) {
            req.flash('error', err.message);
            return res.redirect('back');
        }
        var newUser = new User({
            username: req.body.username,
            email: req.body.email,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            avatar: result.secure_url,
            avatarId: result.public_id
        });
        if (req.body.adminCode === 'adadeh'){
            newUser.isAdmin = true;
        }
        User.register(newUser, req.body.password, function(err, user){
            if (err){
                console.log(err);
                req.flash('error', err.message);
                return res.redirect('/register');
            }
            passport.authenticate('local')(req, res, function(){
                req.flash('success', 'Welcome to YelpCamp ' + user.username);
                res.redirect('/campgrounds');
            });
        });
    });
});

//LOGIN FORM
router.get('/login', function(req, res){
    res.render("login", {page: 'login'}); 
});

//LOGIN LOGIC
router.post('/login', passport.authenticate('local', {
    successRedirect: '/campgrounds',
    failureRedirect: '/login'
}), function(req, res){
});

//LOGOUT
router.get('/logout', function(req, res){
    req.logout();
    req.flash('success', 'You Logged Out');
    res.redirect('/campgrounds');
});

//PROFILE SHOW
router.get('/users/:id', middleware.isLoggedIn, function(req, res){
    User.findById(req.params.id, function(err, user){
        if (err){
            req.flash('error', 'No user found');
            return res.redirect('/');
        }
        Campground.find().where('author.id').equals(user._id).exec(function(err, campgrounds){
             if (err){
                req.flash('error', err.message);
                return res.redirect('/');
            }
            res.render('user/show', {user: user, campgrounds: campgrounds});
        });
    });
});

//PROFILE EDIT
router.get('/users/:id/edit', middleware.isLoggedIn, middleware.checkUserOwnership, function(req, res){
    User.findById(req.params.id, function(err, user){
        res.render('user/edit', {user: user});
    });
});

//PROFILE UPDATE
router.put('/users/:id', middleware.checkUserOwnership, upload.single('avatar'), function(req, res){
    User.findById(req.params.id, async function(err, user){
        if(err){
            req.flash("error", err.message);
            res.redirect("back");
        } else {
            if (req.file) {
              try {
                  await cloudinary.v2.uploader.destroy(user.avatarId);
                  var result = await cloudinary.v2.uploader.upload(req.file.path);
                  user.avatarId = result.public_id;
                  user.avatar = result.secure_url;
              } catch(err) {
                  req.flash("error", err.message);
                  return res.redirect("back");
              }
            }
            user.username = req.body.username;
            user.email = req.body.email;
            user.firstName = req.body.firstName;
            user.lastName = req.body.lastName;
            user.save();
            req.flash("success","Successfully Updated!");
            res.redirect("/users/" + user._id);
        }
    });
});

module.exports = router;