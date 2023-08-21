const mongoose = require('mongoose');

var friendsidSchema = new mongoose.Schema({
    username :{
        type : String,
        require: true
    },
    sitename :{
        type : String,
        require : true,
        enum : ["leetcode"],
        default : "leetcode"
    },
    friend_id :{
        type : String,
        require: true
    }
})


const FriendsId = mongoose.model('friendsid', friendsidSchema);
module.exports = FriendsId;