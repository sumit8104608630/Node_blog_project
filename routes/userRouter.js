const express=require("express");
const route=express.Router();
const path=require("path")
const User=require("../Models/user")
const multer=require("multer");
const { profile } = require("console");


const storage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,path.resolve("./public"))
    },filename:function(req,file,cb){
        const fileName=`${Date.now()}-${file.originalname}`
        cb(null,fileName)
    }
})
route.use(express.static(path.resolve('./public')))

const upload=multer({storage:storage})

route.post("/signup",async(req,res)=>{
const {fullName,email,password}=req.body;
try{
await User.create({
   fullName,
   email,
   password,
})
res.redirect("/")
}
catch(error){
    res.render("signup",{error:error})
}
})
.get("/signin",(req,res)=>{
    res.render("signin");
})
.get("/signup",(req,res)=>{
    res.render("signup")
})
.post("/signin",async (req,res)=>{ 
    const {email,password}=req.body;

    try{
    const token= await User.matchPasswordGenerateToken(email,password);
 
        res.cookie("token",token).redirect("/")

    }catch(error){
        console.log(error)
        res.render("signin",{error:error})
    }
   
}).get("/logout",(req,res)=>{
    res.clearCookie("token").redirect("/")
})
.get("/profile",(req,res)=>{
    res.render("profile")
})
.post("/upload",upload.single("profileImage"),async(req,res)=>{
const {fullName}=req.body 
const email=req.user[0].email;
await User.updateOne(
    { email: email },             // Filter
    { $set: { fullName: fullName ,profileImage:`${req.file.filename}`} }             // Update operation
).then((result) => {
    console.log("Update successful:");
}).catch((err) => {
    console.error("Update failed:");
});
res.redirect("/") 
}) 

module.exports=route