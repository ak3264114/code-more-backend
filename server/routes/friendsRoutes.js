const express = require("express");
const route = express.Router()
const controller = require('../controller/controllerFriends');
const { checkuserauth } = require("../middlewares/auth-middleware");
const fetchGraphQLData = require("../controller/leetcodeFetchData/graphql.controller");

// middleware 

route.use('/' , checkuserauth)

// routes for  friends ids
route.post('/add', controller.addfriendsid)
route.get('/all', fetchGraphQLData) //querry id for getting a single
route.get('/all/:id', controller.findfriends) //querry id for getting a single
route.put('/all/:id', controller.updatefriendids)
// route.get('/graphqldata/:username', fetchGraphQLData)
route.delete('/delete/:id', controller.deletefriendid) //querry id for deleting

module.exports = route