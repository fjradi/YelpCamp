const   Campground  = require('../models/campground'),
        Comment     = require('../models/comment'),
        User        = require('../models/user'),
        Review      = require("../models/review");

var middlewareObj = {};

//Log In Check
middlewareObj.isLoggedIn = function(req, res, next){
    if (req.isAuthenticated()){
        return next();
    }
    req.flash('error', 'Please Log In First');
    res.redirect('/login');
};

//Campground Ownership Check
middlewareObj.checkCampgroundOwnership = function(req, res, next){
    if (req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, foundCampground){
            if (err){
                res.redirect('back');
            }
            else{
                if (foundCampground.author.id.equals(req.user._id) || req.user.isAdmin){
                    next();
                }
                else{
                    req.flash('error', 'You dont have permission');
                    res.redirect('back');
                }
            }
        });
    }
    else{
        req.flash('error', 'Please Log In First');
        res.redirect('back');
    }
};

//User Check
//for update profile
middlewareObj.checkUserOwnership = function(req, res, next){
    if (req.isAuthenticated()){
        User.findById(req.params.id, function(err, foundUser){
            if (err){
                res.redirect('back');
            }
            else{
                if (foundUser._id.equals(req.user._id) || req.user.isAdmin){
                    next();
                }
                else{
                    req.flash('error', 'You dont have permission');
                    res.redirect('back');
                }
            }
        });
    }
    else{
        req.flash('error', 'Please Log In First');
        res.redirect('back');
    }
};

//Review Ownership Check
middlewareObj.checkReviewOwnership = function(req, res, next){
    if (req.isAuthenticated()){
        Review.findById(req.params.review_id, function(err, foundReview){
            if (err || !foundReview){
                res.redirect('back');
            }
            else{
                if (foundReview.author.id.equals(req.user._id) || req.user.isAdmin){
                    next();
                }
                else{
                    req.flash('error', 'You dont have permission');
                    res.redirect('back');
                }
            }
        });
    }
    else{
        req.flash('error', 'Please Log In First');
        res.redirect('back');
    }
};

//Review Existence Check
//to check whether the user has reviewed
middlewareObj.checkReviewExistence = function (req, res, next) {
    if (req.isAuthenticated()) {
        Campground.findById(req.params.id).populate("reviews").exec(function (err, foundCampground) {
            if (err || !foundCampground) {
                req.flash("error", "Campground not found.");
                res.redirect("back");
            } else {
                // check if req.user._id exists in foundCampground.reviews
                var foundUserReview = foundCampground.reviews.some(function (review) {
                    return review.author.id.equals(req.user._id);
                });
                if (foundUserReview) {
                    req.flash("error", "You already wrote a review.");
                    return res.redirect("/campgrounds/" + foundCampground._id);
                }
                // if the review was not found, go to the next middleware
                next();
            }
        });
    } else {
        req.flash("error", "Please Log In First");
        res.redirect("back");
    }
};

//Comment Ownership
middlewareObj.checkCommentOwnership = function(req, res, next){
    if (req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if (err){
                res.redirect('back');
            }
            else{
                if (foundComment.author.id.equals(req.user._id) || req.user.isAdmin){
                    next();
                }
                else{
                    req.flash('error', 'You dont have permission');
                    res.redirect('back');
                }
            }
        });
    }
    else{
        req.flash('error', 'Please Log In First');
        res.redirect('back');
    }
};

module.exports = middlewareObj;