let mongoose=require("mongoose");
let Schema=mongoose.Schema;
let Quiz_Schema=new Schema({
    "quiz_name":String,
    "quiz_time":String,
    "mark_per_que":String,
    "total_mark":String,
 

})
module.exports=mongoose.model("Quiz",Quiz_Schema);