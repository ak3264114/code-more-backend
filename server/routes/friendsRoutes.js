const express = require("express");
const route = express.Router()
const controller = require('../controller/controllerFriends');
const { checkuserauth } = require("../middlewares/auth-middleware");

// middleware 

route.use('/' , checkuserauth)

// auth api


// api user 


//protected Routes


// routes for  friends ids
route.post('/add', controller.addfriendsid)
route.get('/all', controller.findfriends) //querry id for getting a single
route.put('/all/:id', controller.updatefriendids)
// route.delete('/delete/:id', controller.deletefriendid) //querry id for deleting

module.exports = route