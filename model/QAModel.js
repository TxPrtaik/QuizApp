let mongoose=require("mongoose");
let Schema=mongoose.Schema;
let QA_Schema=new Schema({
    "quiz_id":String,
"que":String,
"opt_1":String,
"opt_2":String,
"opt_3":String,
"opt_4":String,
"cor_opt":String,
})
module.exports=mongoose.model("Questions",QA_Schema);
