const   express                     = require('express'),
        router                      = express.Router(),
        Campground                  = require('../models/campground'),
        Comment                     = require('../models/comment'),
        Review                      = require("../models/review"),
        middleware                  = require('../middleware'),
        multer                      = require('multer'),
        cloudinary                  = require('cloudinary');

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

//Regular Expression for Fuzzy Search
function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

//CAMPGROUND INDEX
router.get("/", function(req, res){
    if (req.query.search){
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        Campground.find({name: regex}, function(err, allCampgrounds){
            if (err){
                req.flash('error', err.message);
            }
            else{
                var error;
                if (allCampgrounds.length < 1){
                    error = 'No campgrounds match query';
                }
                res.render('campground/index', {campgrounds: allCampgrounds, page: 'campgrounds', error: error});
            }
        });
    }
    else{
        Campground.find({}, function(err, allCampgrounds){
            if (err){
                console.log(err);
            }
            else{
                res.render("campground/index", {campgrounds: allCampgrounds, page: 'campgrounds'});     
            }
        });   
    }
});

//CAMPGROUND CREATE
router.post("/", middleware.isLoggedIn, upload.single('image'), function(req, res){
   cloudinary.v2.uploader.upload(req.file.path, function(err, result) {
        if(err) {
            req.flash('error', err.message);
            return res.redirect('back');
        }
        // add cloudinary url for the image to the campground object under image property
        req.body.campground.image = result.secure_url;
        // add image's public_id to campground object
        req.body.campground.imageId = result.public_id;
        // add author to campground
        req.body.campground.author = {
            id: req.user._id,
            username: req.user.username
        };
        Campground.create(req.body.campground, function(err, campground) {
            if (err) {
              req.flash('error', err.message);
              return res.redirect('back');
            }
            req.flash('success', 'Successfully create campground');
            res.redirect('/campgrounds/' + campground.id);
        });
    });
});

//CAMPGROUND NEW
router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("campground/new");
});

//CAMPGROUND SHOW
router.get("/:id", function(req, res){
    Campground.findById(req.params.id).populate("comments").populate({
        path: "reviews",
        options: {sort: {createdAt: -1}}
    }).exec(function(err, foundCamp){
        if (err){
            console.log(err);
        }
        else{
            res.render("campground/show", {campground: foundCamp});
        }
    });
});

//CAMPGROUND EDIT
router.get('/:id/edit', middleware.checkCampgroundOwnership,function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        res.render('campground/edit', {campground: campground});
    });
});

//CAMPGROUND UPDATE
router.put('/:id', middleware.checkCampgroundOwnership, upload.single('image'), function(req, res){
    delete req.body.campground.rating;
    Campground.findById(req.params.id, async function(err, campground){
        if(err){
            req.flash("error", err.message);
            res.redirect("back");
        } else {
            if (req.file) {
              try {
                  await cloudinary.v2.uploader.destroy(campground.imageId);
                  var result = await cloudinary.v2.uploader.upload(req.file.path);
                  campground.imageId = result.public_id;
                  campground.image = result.secure_url;
              } catch(err) {
                  req.flash("error", err.message);
                  return res.redirect("back");
              }
            }
            campground.name = req.body.campground.name;
            campground.price = req.body.campground.price;
            campground.description = req.body.campground.description;
            campground.save();
            req.flash("success","Successfully Updated!");
            res.redirect("/campgrounds/" + campground._id);
        }
    });
});

//CAMPGROUND DELETE
router.delete('/:id', middleware.checkCampgroundOwnership, function(req, res){
    Campground.findById(req.params.id, async function(err, campground) {
        if(err) {
          req.flash("error", err.message);
          return res.redirect("back");
        }
        try {
            await cloudinary.v2.uploader.destroy(campground.imageId);
            Comment.remove({"_id": {$in: campground.comments}}, function (err) {
                if (err) {
                    console.log(err);
                    return res.redirect("/campgrounds");
                }
                // deletes all reviews associated with the campground
                Review.remove({"_id": {$in: campground.reviews}}, function (err) {
                    if (err) {
                        console.log(err);
                        return res.redirect("/campgrounds");
                    }
                    //  delete the campground
                    campground.remove();
                    req.flash("success", "Campground deleted successfully!");
                    res.redirect("/campgrounds");
                });
            });
        } catch(err) {
            if(err) {
              req.flash("error", err.message);
              return res.redirect("back");
            }
        }
      });
});

module.exports = router;