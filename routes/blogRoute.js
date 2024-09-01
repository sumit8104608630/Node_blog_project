const express=require("express");
const blogRoute=express.Router();
const path=require("path")
const Blog=require("../Models/blog");
const { MongoClient, ObjectId } = require('mongodb');

const multer=require("multer")
const Comment=require("../Models/comment");
const { ConnectionStates } = require("mongoose");

const storage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,path.resolve(`./public/upload`));
    },
    filename:function(req,file,cb){
        const fileName=`${Date.now()}-${file.originalname}`
     cb(null,fileName)

    }
})
blogRoute.use(express.static(path.resolve('./public')))

const upload=multer({storage:storage})

blogRoute.get("/addblog",(req,res)=>{
    res.render("addBlog",{user:req.user});
})

.post("/",upload.single("coverImage"),async(req,res)=>{
    const{title,content}=req.body;
    console.log(req.user[0].id)
   const blog= await Blog.create({
        title:title,
        content:content,
        createdById:req.user[0].id,
        coverImage:`./upload/${req.file.filename}`
    }) 
   // console.log(req.body) 
   res.redirect(`/blog/${blog._id}`);
}) 
 
  
.get("/:id",async(req,res)=>{
    const id=req.params.id;
   // console.log(id)
  //  console.log(req.user)
    const blog=await Blog.findById(id).populate("createdById");
    const comments=await Comment.find({blogId:id}).populate("createdBy")
    //console.log(blog)
    res.render("blog",{ 
        blog,
        user:req.user,
        comments:comments
    })
})

.post("/comment/:blogId",async(req,res)=>{
    const blogId=req.params.blogId;
    const {comment}=req.body;
    const comments=await Comment.create({
        comment,
        blogId:blogId,
        createdBy:req.user[0].id
    })
    res.redirect(`/blog/${blogId}`)
}).post("/delete/:blog_id",async(req,res)=>{
    const blogId=req.params.blog_id;
    console.log(blogId)
                    await Comment.deleteMany({ blogId: new ObjectId('66d46007329b9505543cee34') })
                    await Blog.findByIdAndDelete(blogId);
res.redirect("/")
})


module.exports=blogRoute;      