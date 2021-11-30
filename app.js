require("dotenv").config();
const express = require("express");
const app = express();
app.use(express.json());
const port = 5001;
const mongoose = require("mongoose");

const userModel= require("./models/user");

mongoose
  .connect(process.env.MONGOURL)
  .then(() => console.log("mongo db connected"));

app.get("/", (req, res) => res.send("Hello World!"));

//get all Users
app.get("/userList",  async (req,res)=>{
    const userList= await userModel.find({},{username:true});

    if(userList.length === 0){
        return res.json({data:"no user in fullstack"});
    }
    return res.json({data:userList});
});

//register user
app.post("/registration",(req,res)=>{
    const {newUser}=req.body;
    userModel.create(newUser);
    return res.json({data:"registration successfully",newUser,body:req.body});
});

//login user
app.post("/login", async (req,res)=>{
    const uname = req.body.username;
    const pwd=req.body.password;

    const user = await userModel.findOne({ username: uname, password: pwd });

    if(user){
        return res.json( {data:"login successfully"});
    }
    return res.json({dsts:"wrong credential"})
});

//update user
app.put("/user/changepassword/:uname", async(req,res)=>{
    const uname=req.params.uname;
    const pwd=req.body.password;
    const updateUser= await userModel.findOneAndUpdate(
        {uasename:uname},
        {password:pwd},
        {new: true}
    );
    return res.json({data:"user pwd update successfully"});
});

//delete user
app.delete("/user/delete/:uname",async(req,res) => {
    const uname = req.params.uname;
    const delUser=await userModel.findOneAndDelete({username:uname});
    return   res.json({data:"user del user successfully"});
})


app.listen(port, () => console.log(`server running on port ${port}`));