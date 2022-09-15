const express = require("express");
const connectDB = require('./server/database/conection')
const bodyParser = require("body-parser");
const path = require('path')
const dotenv = require("dotenv");

dotenv.config({path : 'config.env'})
const app = express();
app.use(require('cors')());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));



const PORT = process.env.PORT ||8080


// app.use(bodyParser.urlencoded({extended : false}))

// mongodb connection
connectDB();


// load routes 
app.use('/api', require('./server/routes/router'))
app.use('/api/friend', require('./server/routes/friendsRoutes'))
app.listen(PORT, ()=> {console.log(`listing on port  localhost:${PORT}`)})