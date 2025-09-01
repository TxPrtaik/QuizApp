let mongoose=require("mongoose");

//mongodb+srv://pratikchindhe44:pratik123@cluster0.z8syx.mongodb.net/QuizApp?retryWrites=true&w=majority&appName=Cluster0
mongoose.connect("mongodb://localhost:27017/QuizApp");
let Schema=mongoose.Schema;
let User_schema=new Schema({
    "name":String,
    "email":String,
    "password":String
});
let model=mongoose.model("Admin",User_schema);
module.exports=model;