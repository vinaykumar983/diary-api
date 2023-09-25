const exp=require("express");
const expressAsyncHandler = require("express-async-handler");
const diaryApp=exp.Router();
diaryApp.use(exp.json());

diaryApp.post("/create-data",expressAsyncHandler(async(request,response)=>{
    let diaryData=request.body;
    let diaryCollectionObj=request.app.get("diaryCollectionObj");
    await diaryCollectionObj.insertOne(diaryData);
    response.send({message:"Data saved successfully"});
}))

diaryApp.get("/get-data",expressAsyncHandler(async(request,response)=>{
    let diaryCollectionObj=request.app.get("diaryCollectionObj");
    let allData=await  diaryCollectionObj.find().toArray();
    response.send({message:"Diary data",payload : allData});
}));


diaryApp.delete("/del-data/:username/:date",expressAsyncHandler(async(request,response)=>{
    let diaryCollectionObj=request.app.get("diaryCollectionObj");
    let name=request.params.username;
    let userDate=request.params.date;
    await diaryCollectionObj.deleteOne({$and:[{username:name},{date:userDate}]});
    response.send({message:"Data deleted successfully"});
}));

module.exports={diaryApp};