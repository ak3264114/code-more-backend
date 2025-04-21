const express = require("express");
const connectDB = require('./server/database/conection')
const dotenv = require("dotenv");
const morgan = require('morgan')
dotenv.config()
const app = express();
app.use(require('cors')());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(morgan("common"))


const PORT = process.env.PORT ||8080


// mongodb connection
connectDB();


// load routes 
app.use('/api', require('./server/routes/router'))
app.use('/api/friend', require('./server/routes/friendsRoutes'))
app.listen(PORT, ()=> {console.log(`listing on port  localhost:${PORT}`)})