const express = require("express");
const route = express.Router()
const controller = require('../controller/controller');
const { checkuserauth } = require("../middlewares/auth-middleware");

// middleware 
route.use('/change-password' , checkuserauth)
route.use('/loggeduser' , checkuserauth)
// route.use('/users' , checkuserauth)

// auth api

route.post('/signup', controller.register)
route.post('/login', controller.login)
route.post('/forgot-password', controller.forgotPasswordmail)
route.post('/verifypassword/:id/:token', controller.passwordreset)
route.get('/verifyemail/:id/:token', controller.confirmemail)

// api user 
route.get('/loggeduser', controller.loggeduser)
route.get('/users', controller.find)
route.put('/users/:id', controller.update)
route.delete('/users/:id', controller.delete)
//protected Routes
route.post('/change-password', controller.changepassword)


// routes for  friends ids


module.exports = route