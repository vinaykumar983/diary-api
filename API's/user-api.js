const exp=require("express");
const expressAsyncHandler = require("express-async-handler");
const userApp=exp.Router();
userApp.use(exp.json());
let bcryptjs=require("bcryptjs");
let jwt=require("jsonwebtoken");

require("dotenv").config();

let key=process.env.KEY;

userApp.get("/get-user",expressAsyncHandler(async(request,response)=>{
    let userCollectionObj=request.app.get("userCollectionObj");
    let users=await userCollectionObj.find().toArray();
    response.send({message:"All users",payload:users})
}))



userApp.post("/login",expressAsyncHandler(async(request,response)=>{
    let user=request.body;
    let userCollectionObj=request.app.get("userCollectionObj");
    let userObj=await userCollectionObj.findOne({username:user.username});
    if(userObj==null){
        response.send({message:"Invalid username"});
    }
    else{
        let status=await bcryptjs.compare(user.password, userObj.password);
        if(status==false){
            response.send({message:"Invalid password"});
        }
        else{
            let token=jwt.sign({username:userObj.username},key,{expiresIn:7200});
            console.log(userObj)
            response.send({message:"success",payload:token,user:userObj});
        }
    } 
}))

userApp.post("/create-user",expressAsyncHandler(async(request,response)=>{
    let user=request.body;
    let userCollectionObj=request.app.get("userCollectionObj");
    let availableUser=await userCollectionObj.findOne({username : user.username});
    if(availableUser!==null){
        response.send({message:"Please choose another username"});
    }
    else{
        let hashedPassword=await bcryptjs.hash(user.password,5);
        user.password=hashedPassword;
        await userCollectionObj.insertOne(user);
        response.send({message:"User created successfully"});
    }
}))


module.exports={userApp};