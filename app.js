const exp=require("express");
let app=exp();
app.use(exp.json());
const cors=require("cors");

app.use(cors(
    {
        origin:'*'
    }
));

require("dotenv").config();

const DBURL=process.env.DBURL;
const mclient=require("mongodb").MongoClient;

mclient.connect(DBURL)
.then((obj)=>{
    let dbobj=obj.db("diary2023");
    let userCollection=dbobj.collection("users");
    let diaryCollection=dbobj.collection("diary");
    app.set("userCollectionObj",userCollection);
    app.set("diaryCollectionObj",diaryCollection);
    console.log("DB connection successful");
})
.catch((err)=>{
    console.log("Error in DB connection");
})

const {userApp}=require("./API's/user-api");
const {diaryApp}=require("./API's/diary-api");

app.get("/",(req,res)=>{
    
    res.send("Hello");
})

app.use('/users',userApp);
app.use('/diary',diaryApp);


app.use((request,response,next)=>{
    response.send({message:`path ${request.url} is invalid`})
});

app.use((error,request,response,next)=>{
    response.send({message:error.message})
});

const port=process.env.PORT || 4000;

app.listen(port,()=>{
    console.log("Server listening on port "+port);
})
