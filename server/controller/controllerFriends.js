
const FriendsId = require('../model/friends_id');
var Userdb = require('../model/user_model');

exports.addfriendsid = async(req, res) => {
    if (!req.body) {
        return res.status(400).json({status :"info" , message: " data Can't be Empty!" });
    }
    else if (!req.body.friendsId) {
        return res.status(400).json({ status :"info" , message: "Username of your friend Can't be Empty!" });
    }
    try{
        const isExistFriendId = await FriendsId.exists({ sitename: "leetcode" , friend_id : req.body.friendsId , username : req.user.username})
        .catch(err =>{
             return res.status(500).json({ message: err.message || "some error Occurred" })
        })
        if (isExistFriendId) {
            return res.status(400).json({ status :"info", message: "This friendId is already added for this user!" });
        } 

        if (req.user) {
            Userdb.findById(req.user._id)
                .then(userdb => {
                    let friendsId = new FriendsId({
                        username : req.user.username,
                        sitename : req.body.sitename,
                        friend_id : req.body.friendsId
                    })
                    friendsId.save()
                    console.log(friendsId);
                    return res.status(200).json({ status: "success" , message : `friends Id ${req.body.friendsId} is added for user ${req.user.username}` })
                })
                .catch(err => {
                    res.status(500).json({
                        status : "error" , message: err.message || "some error Occurred"
                    });
                });
        }
        else {
            return res.status(404).json({ status: "failed", message: "invalid user" })
    
        }

    }
    catch(err){
        return res.status(500).json({ message: err.message || "some error occoured this messege you are seening because you have given it as a default message." })
    }


}


exports.findfriends = async (req, res) => {
    if (req.query.id) {
        const id = req.query.id;
        FriendsId.findById(id)
            .then(data => {
                if (!data) {
                    res.status(404).send({ message: `not found user with this id ${id}` })
                }
                else {
                    res.send(data)
                }
            })
            .catch(err => {
                res.status(500).send({ message: err.message || "error occoured with user id" + id })
            })
    }
    else {
        try{
            const existfriendId = await FriendsId.exists({username : req.user.username})
            
            if(!existfriendId) return res.status(400).json({Status: " success" , message : "No friend Found" , data :[]})
            const data = await FriendsId.find({username : req.user.username})
            return res.status(200).json({Status : "success" , message : "Data found" , data : data})
        }catch(err)
        {
    return res.status(500).json({status : "failed" , "message" : err.message ||"An error Occoured"})
    }
    }
}


exports.updatefriendids = async (req, res) => {
    if (!req.body) {
        return res.status(400).json({ message: "Data Update Cannot  Empaty" })
    }
    const id = await req.params.id;
    const user = req.user.friend_ids;

    Userdb.findOneAndUpdate({ '_id': req.user._id, "friend_ids._id": id },
        {
            $set: {
                "friend_ids.$.username": req.body.username,
                "friend_ids.$.sitename": req.body.sitename
            },
        }
        , {
            new: true
        }).then(data => {
            if (!data) {
                res.status(400).json({ "status": "failed", message: `Cannot Update post with ${id} maybe post cannot found!` })
            }
            else {
                res.json({ "status": "success", message: "successfully updated" })
            }
        })
        .catch(err => {
            res.status(500).json({ "status": "failed", message: "Error Occoured in Update user" })
        })


    // an error is that ki aap kisi bhi id par / laga doge to bhi success hai aayage result


    // Userdb.friend_ids.updateOne(
    //     { "_id": req.user._id },
    //     {
    //         $set: {
    //             "username": req.body.username
    //         }
    //     }
    // ).then(data => {
    //     if (!data) {
    //         res.status(400).json({ "status": "failed", message: `Cannot Update post with ${id} maybe post cannot found!` })
    //     }
    //     else {
    //         res.json(data)
    //     }
    // })
    //     .catch(err => {
    //         res.status(500).json({ "status": "failed", message: "Error Occoured in Update user" })
    //     })

    // if(user[0]._id.toString() === id.toString()){
    //     res.send("true")
    // }
    // else{
    //     res.send("false")
    // }
    // const friend_ids = await user.friend_ids
    // console.log(friend_ids.length)
    // for (let i = 0; i < user.length; i++) {
    //     if (user[i]._id.toString() === id.toString()) {
    //         Userdb.friend_ids.findOneAndUpdate(id, req.body, { useFindAndModify: false })
    //             .then(data => {
    //                 if (!data) {
    //                     res.status(400).json({ "status": "failed", message: `Cannot Update post with ${id} maybe post cannot found!` })
    //                 }
    //                 else {
    //                     res.json(data)
    //                 }
    //             })
    //             .catch(err => {
    //                 res.status(500).json({ "status": "failed", message: "Error Occoured in Update user" })
    //             })
    //     }
    // }
    //   res.status(400).json({ "status": "failed", message: `Cannot Update post with ${id} maybe post cannot found!` })
    // .then(data =>{

    // })
}

exports.deletefriendid = async (req, res) => {
    const friendId = req.params.id
    const userUsername = req.user.username
    try{
        const isexist = await FriendsId.exists({username :  userUsername , friend_id : friendId})
        if(!isexist) return res.status(400).json({ "status": "failed", message: `cant find friend userii ${friendId}` });
        FriendsId.findOneAndDelete({username :  userUsername , friend_id : friendId}).then(result=>{
        return res.status(200).json({ "status": "succes", message: "friendsId Deleted Succesfully" });
        })
    }
    catch(e){
        return res.status(500).json({ "status": "failed", message: e.message||`Cannot delete some error occoured` });
    }
    
    
}