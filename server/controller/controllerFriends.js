

var Userdb = require('../model/user_model');
// const bcrypt = require('bcrypt');
// var jwt = require('jsonwebtoken');
// const nodemailer = require("nodemailer");
// const dotenv = require("dotenv");
// dotenv.config({ path: 'config.env' })


exports.addfriendsid = (req, res) => {
    if (!req.body) {
        return res.status(400).json({ message: " data Contant be Empty!" });
    }
    else if (!req.body.sitename) {
        return res.status(400).json({ message: "sitename Contant be Empty!" });
    }
    else if (!req.body.username) {
        return res.status(400).json({ message: "Username of your friend Contant be Empty!" });
    }
    else if (req.user) {
        Userdb.findById(req.user._id)
            .then(userdb => {
                userdb.friend_ids.push(req.body)
                userdb.save()
                console.log(req.user)
                console.log(userdb);
                return res.status(200).json({ status: "success" })
            })
            .catch(err => {
                res.status(500).json({
                    message: err.message || "some error occoured this messege you are seening because you have given it as a default message."
                });
            });
    }
    else {
        return res.status(404).json({ status: "failed", message: "invalid user" })

    }


}


exports.findfriends = (req, res) => {
    if (req.query.id) {
        const id = req.query.id;
        Friendiddb.findById(id)
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
        return res.status(200).json(req.user.friend_ids)
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

// exports.deletefriendid = (req, res) => {
//     const id = req.params.id
//     const friend_ids = req.user.friend_ids
//     console.log(friend_ids)
//     for (let i = 0; i < friend_ids.length; i++) {
//         if (friend_ids[i]._id.toString() === id.toString()) {
//             Userdb.findById(req.user._id)
//             .then(data=>{
//                 data.friend_ids.splice(i,1)
//                 .then(data => {
//                     if (!data) {
//                         res.status(404).json({ "status": "failed", message: `Cannot delete friend id with ${id} maybe post cannot found!` })
//                     }
//                     else {
//                         data.save()
//                         res.json(data)
//                     }
//                 })
//                 .catch(err => {
//                     res.status(500).json({ "status": "failed", message: "Error Occoured in deleting friend id" })
//                 })
//             })
//             .catch(e =>{
//                 res.status(500).json({ "status": "failed", message: "User not Found" })
//             })
            
//         }
//     }
//     return res.status(400).json({ "status": "failed", message: `Cannot Update post with ${id} maybe post cannot found!` });
// }