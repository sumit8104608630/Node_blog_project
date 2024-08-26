//const { timeStamp, profile, error } = require("console");
const {createHmac,randomBytes} = require('node:crypto');
const mongoose=require("mongoose");
//const { type } = require("os");
const { setUser } = require("../service/auth");
const { throws } = require("assert");
const { create } = require('node:domain');
const blogSchema=mongoose.Schema({
title:{
    type:String,
    required:true
},
content:{
    type:String,
    required:true
},
coverImage:{
    type:String,
},
createdById:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"user",
}
},{timestamps:true})

const Blog=mongoose.model("blog",blogSchema);

module.exports=Blog