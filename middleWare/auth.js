const {getUser}=require("../service/auth")
const User= require ("../Models/user.js")
 function checkForAuthenticationCookie(cookieName){
 return async function(req,res,next){
const cookie=req.cookies[cookieName];
req.user=null;
if(!cookie)return next();
const user=getUser(cookie)
const new_user=await User.find({email:user.email})
//console.log(new_user)
req.user=new_user
return next()
}
 } 

module.exports={
    checkForAuthenticationCookie
} 