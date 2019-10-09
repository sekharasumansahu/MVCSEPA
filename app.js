"use strict";

const express = require('express');
const bodyparser = require('body-parser');
const app = express();
global.router = express.Router();

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended : true}));

app.use(require('./router/signUp'));

app.listen(3000, (err)=>{
    if(err) throw err;
    else console.log("Server connected to PORT 3000");
})

