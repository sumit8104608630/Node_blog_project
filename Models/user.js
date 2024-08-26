//const { timeStamp, profile, error } = require("console");
const {createHmac,randomBytes} = require('node:crypto');
const mongoose=require("mongoose");
//const { type } = require("os");
const { setUser } = require("../service/auth");
const { throws } = require("assert");
const userSchema=mongoose.Schema({
    fullName:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    sault:{type:String},
    password:{type:String,required:true},
    profileImage:{
        type:String,
        default:"User-avatar.png"
    },
    role:{
        type:String,
        enum:["USER","ADMIN"],
        default:"USER"
    }
},{timestamps:true})

//let's encrypt the password using the custom build-in hash algorithm in node js
userSchema.pre("save",function(next){
    const user=this;
    const salt=randomBytes(16).toString().trim()
    const hashAlgorithm=createHmac("sha256",salt).update(user.password).digest("hex")
    this.sault=salt;
    this.password=hashAlgorithm;
    next()
})

userSchema.static("matchPasswordGenerateToken",async function(email,password){
const user = await this.findOne({email:email});
if(!user)return new Error("user does not exist") 
const sault=user.sault
const userPassword=user.password;
const hashAlgorithm=createHmac("sha256",sault).update(password).digest("hex");
if(hashAlgorithm!=userPassword){
    return throws ("password is incorrect please enter right password")
}

const token=setUser(user);
return token
})


const User=mongoose.model("user",userSchema);
module.exports=User;