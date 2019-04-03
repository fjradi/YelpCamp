//not used
const mongoose = require('mongoose'),
    Campground = require("./models/campground"),
    Comment = require("./models/comment");

var data = [
    {
        name: "Wye Valley Camping",
        image: "https://farm9.staticflickr.com/8167/7121865553_e1c6a31f07.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer tristique mi lorem. Nulla lobortis, libero ut hendrerit feugiat, enim lacus vulputate nulla, et suscipit augue sem in enim. Praesent viverra, sem sed aliquam bibendum, felis nunc laoreet dui, nec euismod nisl risus non lorem. Nunc at est nec nisl malesuada consectetur sed ut lectus. Duis ut leo semper, fringilla risus sit amet, fermentum nisl. Nullam nec vehicula magna. Mauris varius gravida neque, ut varius orci accumsan vitae. In hac habitasse platea dictumst. Nam consequat libero erat, in dictum felis fringilla et"
    },{
        name: "Jenny Lake Camp",
        image: "https://farm2.staticflickr.com/1424/1430198323_c26451b047.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer tristique mi lorem. Nulla lobortis, libero ut hendrerit feugiat, enim lacus vulputate nulla, et suscipit augue sem in enim. Praesent viverra, sem sed aliquam bibendum, felis nunc laoreet dui, nec euismod nisl risus non lorem. Nunc at est nec nisl malesuada consectetur sed ut lectus. Duis ut leo semper, fringilla risus sit amet, fermentum nisl. Nullam nec vehicula magna. Mauris varius gravida neque, ut varius orci accumsan vitae. In hac habitasse platea dictumst. Nam consequat libero erat, in dictum felis fringilla et"
    },{
        name: "Occoneechee State Park",
        image: "https://farm4.staticflickr.com/3924/14422533026_9be7d49684.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer tristique mi lorem. Nulla lobortis, libero ut hendrerit feugiat, enim lacus vulputate nulla, et suscipit augue sem in enim. Praesent viverra, sem sed aliquam bibendum, felis nunc laoreet dui, nec euismod nisl risus non lorem. Nunc at est nec nisl malesuada consectetur sed ut lectus. Duis ut leo semper, fringilla risus sit amet, fermentum nisl. Nullam nec vehicula magna. Mauris varius gravida neque, ut varius orci accumsan vitae. In hac habitasse platea dictumst. Nam consequat libero erat, in dictum felis fringilla et"
    }]

function seedDB(){
    Campground.remove({}, function(err){
        if (err){
            console.log(err);
        }
        else{
            console.log("removed campgrounds");
            data.forEach(function(seed){
                Campground.create(seed, function(err, campground){
                    if (err){
                        console.log(err);
                    }
                    else{
                        console.log("added a campground");
                        Comment.create({
                            text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque pharetra commodo varius",
                            author: "Fajar"
                        }, function(err, comment){
                            if (err){
                                console.log(err);
                            }
                            else{
                                campground.comments.push(comment);
                                campground.save();
                                console.log("added a comment");
                            }
                        });
                    }
                });
            });
        }
    });
}

module.exports = seedDB;