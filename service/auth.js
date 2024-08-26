const jwt=require("jsonwebtoken");
const secret="sumitblogapplication@123";


function setUser(user){
    const payload={
        id:user._id,
        name:user.fullName,   
        email:user.email,
        profileImage:user.profileImage,
        role:user.role,     
    }; 
    const token =jwt.sign(payload,secret);
    return token
}

function getUser(token){
    if(!token)return null
    const payload=jwt.verify(token,secret);
    return payload

} 
module.exports={
    setUser,
    getUser
}