let mongoose=require("mongoose")
let Schema=mongoose.Schema;
let StudentResSchema=new Schema({
    "stu_name":String,
    "stu_email":String,
    "marks":String,
    "quiz_id":String,
    "answers":[],
    "date":String
})
module.exports=mongoose.model("StudentResponse",StudentResSchema);