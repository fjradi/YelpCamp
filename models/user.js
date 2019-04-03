const   mongoose                = require('mongoose'),
        passportLocalMongoose   = require('passport-local-mongoose');
    

var UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    email: String,
    firstName: String,
    lastName: String,
    avatar: String,
    avatarId: String,
    isAdmin: {
        type: Boolean,
        default: false
    }
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('user', UserSchema);