var Userdb = require('../model/user_model');
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config({ path: 'config.env' })



exports.register = async (req, res) => {
    try {
      const { username, name, email, password } = req.body;
      if (!username || !name || !email || !password) {
        return res.status(400).json({
          status: "Failed",
          message: "field is missing in registration",
          });
      }
      const userNameExist = await Userdb.exists({ username: username });
      if (userNameExist) return res.status(200).json({
          status: "succes",
          message: "username Already taken! Try another one",
        });
  
      const emailExist = await Userdb.exists({ email: email });
      if (emailExist) {
          return res.status(200).json({
              status: "succes",
              message: "Email Already taken! Try another one",
            });
      }
      const salt = await bcrypt.genSalt(12);
      const hashpass = await bcrypt.hash(password, salt);
      let data = new Userdb({
        username: req.body.username,
        name: req.body.name,
        email: req.body.email,
        password: hashpass,
      });
      await data.save();
      const user = await Userdb.findOne({ email: email });
      const secret = process.env.EMAIL_VERIFY_SECRET_KEY;
      const token = jwt.sign({ userID: user._id }, secret, { expiresIn: "15m" });
      const link = `${process.env.base_url}/verifyemail/${token}`;
      let transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: true,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });
      let info = await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: user.email,
        subject: "Please Verify Your Email",
        html: `<a href = ${link}>click here <a/>to verify your email `,
      });
      res.status(200).json({
          status: "success",
          message: "Verification Email sent to your mail id",
        });
      // res.status(201).json({ "status": "Success", "message": "Registrain Successfully", "token": token });
    } catch (error) {
      res
        .status(500)
        .json({ message: error.message || "Error Occoured in registiring user" });
    }
  };
  
  exports.confirmemail = async (req, res) => {
    const { token } = req.params;
    const secret = process.env.EMAIL_VERIFY_SECRET_KEY;
    try {
      const {userID} = jwt.verify(token, secret);
      if(!userID) return res.send(400).json({status : failed ,message : "invalid token or token expired"})
      const user = await Userdb.findById(userID);
      if (user.status === "active") {
        res.status(200).json({ status: "success", message: "Already Verifyied" });
      } else {
        await Userdb.findByIdAndUpdate(
          user._id,
          { status: "active" },
          { useFindAndModify: false }
        );
        const token = jwt.sign({ userID: user._id }, process.env.JWT_SECRET_KEY, {
          expiresIn: "10d",
        });
        res
          .status(200)
          .json({
            status: "success",
            message: "Email Verfiyed successfully",
            token: token,
          });
      }
    } catch (error) {
      res
        .status(500)
        .json({
          message:
            error.message ||
            "error Occoured in verifing email maybe verification link expire",
        });
    }
  };
  


exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        if (username != " " & password != "") {
            const user = await Userdb.findOne({ username: username })
            if (user?.status === "inactive") {
                return res.status(404).json({ "status": "failed", "message": "please verify your email" })
            }
            else if (user != null) {
                ismatch = await bcrypt.compare(password, user.password)
                if (ismatch && user.username == username) {
                    const token = jwt.sign({ userID: user._id },
                        process.env.JWT_SECRET_KEY, { expiresIn: '10d' })
                    return res.status(200).json({ "status": "succes", "message": "user login successfully", "token": token })
                }
                else {
                    return res.status(400).json({"status": "failed", "message": "username or password is wrong" })
                }
            } else {
                return res.status(404).json({ "status": "failed" , "message": "user not found" })
            }
        }
        else {
            return res.status(400).json({ "message": "Data Cannot ne empty" })
        }
    }
    catch (error) {
        console.log(error)
        res.status(500).json({ "message": "An error occured in login a user" });
    }

};



exports.forgotPasswordmail = async (req, res) => {
    const { email } = req.body;
    if (email) {
        const user = await Userdb.findOne({ email: email })
        if (user) {
            const secret = user._id + process.env.JWT_SECRET_KEY
            const token = jwt.sign({ userID: user._id }, secret, { expiresIn: '10m' })
            const link = `${process.env.base_url}api/verifypassword/${user._id}/${token}`
            console.log(link)

            let transporter = nodemailer.createTransport({
                host: process.env.EMAIL_HOST,
                port: process.env.EMAIL_PORT,
                secure: true,
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS,
                },
            })
            let info = await transporter.sendMail({
                from: process.env.EMAIL_FROM,
                to: user.email,
                subject: "Reset your Password",
                html: `<a href = ${link}>click here <a/>to reset your password `
            })
            res.status(200).json({ "status": "succes", "message": "Email sent to your mail id", "info": info })
        }
        else {
            res.status(400).json({ "message": "User does not exist with this email" })
        }
    }
    else {
        res.status(400).json({ "message": "email Cannot be empty" })
    }
};

exports.passwordreset = async (req, res) => {
    const { password, confirm_password } = req.body
    const { id, token } = req.params
    const user = await Userdb.findById(id)
    const new_secret = user._id + process.env.JWT_SECRET_KEY
    try {
        jwt.verify(token, new_secret)
        if (password && confirm_password) {
            if (password !== confirm_password) {
                res.status(400).json({ "message": "new password and confirm password doesnot match" })
            }
            else {
                const salt = await bcrypt.genSalt(12)
                const hashpass = await bcrypt.hash(password, salt)
                await Userdb.findByIdAndUpdate(user._id, { password: hashpass, status: "active" }, { useFindAndModify: false })
                res.status(200).json({ "message": "password reset successfully" })
            }
        }
        else {
            res.status(400).json({ "message": "Password and Confirm Password Cannot be empty" })
        }
    } catch (error) {
        res.status(500).json({ "message": error.message || "error Occoured in verifing user" })
    }
}


exports.changepassword = async (req, res) => {
    const { password, confirm_password } = req.body;
    if (password && confirm_password) {
        if (password !== confirm_password) {
            res.status(400).json({ "message": "new password and confirm password doesnot match" })
        }
        else {
            const salt = await bcrypt.genSalt(12)
            const hashpass = await bcrypt.hash(password, salt)
            res.status(200).json({ "message": "password changed successfully" })
            await Userdb.findByIdAndUpdate(req.user._id, { password: hashpass }, { useFindAndModify: false })
        }
    }
    else {
        res.status(400).json({ "message": "Password and Confirm Password Cannot be empty" })
    }
}


exports.loggeduser = (req, res) => {
    res.status(200).json(req.user)
}

exports.find = (req, res) => {
    if (req.query.id) {
        const id = req.query.id;
        Userdb.findById(id)
            .then(data => {
                if (!data) {
                    res.status(404).send({ message: `not found user with this id ${id}` })
                }
                else {
                    res.send(data)
                }
            })
            .catch(err => {
                res.status(500).send({ message: "error occoured with user id" + id })
            })
    }
    else {
        Userdb.find()
            .then(user => {
                res.send(user)
            })
            .catch(err => {
                res.status(500).json({ message: err.message || "some error occoured this messege you are seening because you have given it as a default message." })
            })
    }
}


exports.update = (req, res) => {
    if (!req.body) {
        res.status(400).json({ message: "Data Update Cannot  Empaty" })
        return
    }
    const id = req.params.id;
    Userdb.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
        .then(data => {
            if (!data) {
                res.status(400).json({ message: `Cannot Update User with ${id} maybe user cannot found!` })
            }
            else {
                res.json(data)
            }
        })
        .catch(err => {
            res.status(500).json({ message: "Error Occoured in Update user" })
        })
}


exports.delete = (req, res) => {
    const id = req.params.id;
    Userdb.findByIdAndDelete(id)
        .then(data => {
            if (!data) {
                res.status(404).json({ message: `cannot delete with id ${id} maybe id is wrong` })
            } else {
                res.json({ message: "User Deleted succesfully!" })
            }
        })
        .catch(err => {
            res.status(500).json({ message: `Cannot delete User with id = ${id}` })
        })
}

