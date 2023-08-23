var Userdb = require('../model/user_model');
var jwt = require('jsonwebtoken');

exports.checkuserauth = async (req,res ,next)=>{
    let token 
    const {authorization} = req.headers
    if(authorization && authorization.startsWith('token')){
        try {
            token = authorization.split(' ')[1]
            const {userID} = jwt.verify(token, process.env.LOGIN_SECRET_KEY)
            req.user = await Userdb.findById(userID).select('-password')
            next()
        } 
        catch (error) {
            res.status(500).json({"status":"failed", "message": error.message ||"Unauthorized User" });
        }
    }
    if(!token){
        res.status(401).json({"status":"failed", "message": "Unauthorized User , No token" });
    }
}