const mongoose=require("mongoose");


const commentSchema=mongoose.Schema({
    comment:{
        type:String
    },
    blogId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"blog"
    },
    createdBy: {
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    }
},{timestamps:true});
const Comment=mongoose.model("comment",commentSchema);
module.exports=Comment;

