const   express     = require('express'),
        router      = express.Router({mergeParams: true}),
        Campground  = require('../models/campground'),
        Comment     = require('../models/comment'),
        middleware  = require('../middleware');



//COMMENT NEW
router.get("/new", middleware.isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if (err){
            console.log(err);
        }
        else{
            res.render("comment/new", {campground: campground});      
        }
    });
});

//COMMENT CREATE
router.post("/", middleware.isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if (err){
            console.log(err);
        }
        else{
            Comment.create(req.body.comment, function(err, newComment){
                if (err){
                    console.log(err);
                }
                else{
                    newComment.author.id = req.user._id;
                    newComment.author.username = req.user.username;
                    newComment.save();
                    campground.comments.push(newComment);
                    campground.save();
                    res.redirect("/campgrounds/"+campground._id);
                }
            });
        }
    });
});

//COMMENT EDIT
router.get('/:comment_id/edit', middleware.checkCommentOwnership, function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
        res.render('comment/edit', {campground_id: req.params.id, comment: foundComment});
    });
});

//COMMENT UPDATE
router.put('/:comment_id', middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if (err){
            res.redirect('back');
        }
        else{
            res.redirect('/campgrounds/'+req.params.id);
        }
    });
});

//COMMENT DELETE
router.delete('/:comment_id', function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if (err){
            res.redirect('back');
        }
        else{
            res.redirect('/campgrounds/'+req.params.id);
        }
    });
});

module.exports = router;