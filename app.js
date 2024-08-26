//let's create the large project using   MERN Stack
require("dotenv").config();
const express=require("express");
const app=express();
const port=process.env.PORT || 8000;
const path=require("path");
const userRoute=require("./routes/userRouter")
const {connect}=require("./connect")
const cookieParser=require("cookie-parser")
const {checkForAuthenticationCookie}=require("./middleWare/auth")
app.use(express.urlencoded({extended:false}))
app.use(express.static(path.resolve('./public')))

const blogRoute=require("./routes/blogRoute")
app.use(cookieParser())
app.use(checkForAuthenticationCookie("token"));
const Blog=require("./Models/blog")
//let's connect the mongoDB

connect(process.env.MONGO_URL).then(()=>{
    console.log("connected to database")
}).catch((err)=>console.log(err));

// let's set the view js path 

app.use("/user",userRoute)
app.use("/blog",blogRoute)

 

app.set("view engine","ejs");
app.set("views",path.resolve("./view"))
app.get("/",async(req,res)=>{
  //  console.log(req.user)
    const blogs=await Blog.find({})
    res.render("home",{user:req.user,blog:blogs});
}) 



app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
})

 