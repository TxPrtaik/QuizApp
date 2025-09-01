let express=require("express");
let route=express.Router();
let jwt=require("jsonwebtoken");
let admin=require("../model/AdminModel");
let Quiz=require("../model/QuizModel")
let QueModel=require("../model/QAModel")
let StuRes=require("../model/StudentResponse");
const QAModel = require("../model/QAModel");
const QuizModel = require("../model/QuizModel");
function authenticateAdmin(req,res,next){
let token=req.cookies.token;

if (!token) return res.redirect("/admin/login");
 jwt.verify(token,"pratik@123",(err,user)=>{
if(err){
  
    res.redirect("/admin/login");
}
req.user=user;
next();
 })

}
route.get("/login",async(req,res)=>{

res.render("admin/login.ejs");
})
route.post("/sign-up",async(req,res)=>{
   
    let data=await admin.findOne({"email":req.body.email,"password":req.body.password});

if(data==null){
    res.redirect("/admin/login")
}
else{
    let token=jwt.sign({"_id":data._id,"name":data.name,"email":data.email,"password":data.password},"pratik@123",{expiresIn:"1h"})
    res.cookie("token",token)
    res.redirect("/admin/")
}
})
route.get("/",authenticateAdmin,async(req,res)=>{
let obj={
    "admin":req.user
}

    res.redirect("/admin/quiz")
})
route.get("/quiz",authenticateAdmin,async(req,res)=>{
    res.render("admin/quiz.ejs");
})
route.post("/add-quiz",authenticateAdmin,async(req,res)=>{
let {quiz_name,quiz_time,mark_per_que,total_mark}=req.body;
let quiz_data=await Quiz({"quiz_name":quiz_name,"quiz_time":quiz_time,"mark_per_que":mark_per_que,"total_mark":total_mark}).save();

for(let i=0;i<req.body.que.length;i++){
    
    let obj={
  "quiz_id":quiz_data._id,
    "que":req.body.que[i],
    "opt_1":req.body.opt_1[i],
    "opt_2":req.body.opt_2[i],
    "opt_3":req.body.opt_3[i],
    "opt_4":req.body.opt_4[i],
    "cor_opt":req.body.cor_opt[i]
    }

await QueModel(obj).save();
}
res.send(req.body);

})
route.get("/quizes",authenticateAdmin,async(req,res)=>{
    
    let quizes=await Quiz.find();
    let obj={
        "quizes":quizes
    }

    res.render("admin/quizlist.ejs",obj);
})
route.get("/attempt-quiz/:id",authenticateAdmin,async(req,res)=>{
   let ques=await QueModel.find({"quiz_id":req.params.id});
   let quiz=await Quiz.findById(req.params.id);

   let obj={
    "ques":ques,
"quiz":quiz
}
    res.render("admin/attemptquiz.ejs",obj)
})
route.post("/save-student-response",async(req,res)=>{
    let marks=0;
    let response=[];
for(let i of req.body.answers){
   response.push(i);
    let ans=await QAModel.findById(i.qid)
    let marPerQue=await Quiz.findById(req.body.quiz_id)
   
    if(ans.cor_opt.toLocaleLowerCase()==i.option.toLocaleLowerCase()){
         
      marks=Number(marks)+Number(marPerQue.mark_per_que);        
      
    }
}
let stu_details={
"stu_name":req.body.stu_name,
"stu_email":req.body.stu_email,
"quiz_id":req.body.quiz_id,
"date":new Date().toISOString().slice(0,10),
"answers":response,
"marks":marks
}
await StuRes(stu_details).save()




    res.send("Data Sotred")
})
route.get("/responses/:id",authenticateAdmin,async(req,res)=>{
    let resp=await StuRes.find({"quiz_id":req.params.id})
    let quiz=await Quiz.findById(req.params.id);
    let obj={
        "resp":resp,
        "quiz":quiz
    }
res.render("admin/responselist.ejs",obj)
})
route.get("/student-resp/:id",authenticateAdmin,async(req,res)=>{
    let stu_res=await StuRes.findById(req.params.id);
    let quiz_det=await QuizModel.findOne({"_id":stu_res.quiz_id})
    let ques=await QueModel.find({"quiz_id":quiz_det._id})
    let stuRes={
    "stu_name":stu_res.stu_name,
    "stu_email":stu_res.stu_email,
    "quiz_name":quiz_det.quiz_name,
    "obtained_marks":stu_res.marks,
    "que":[],
    "opt_1":[],
    "opt_2":[],
    "opt_3":[],
    "opt_4":[],
    "cor_option":[],
    "stu_ch":[]

}

for(let i of ques){
    stuRes.que.push(i.que)
        stuRes.opt_1.push(i.opt_1)
        stuRes.opt_2.push(i.opt_2)
        stuRes.opt_3.push(i.opt_3)
        stuRes.opt_4.push(i.opt_4)
        stuRes.cor_option.push(i.cor_opt.split(" ").join("-"))
  for(let j of stu_res.answers){
    if(i._id==j.qid){
        stuRes.stu_ch.push(j.option.split(" ").join("-"))
    }
  }
}
    let obj={
        "stu_res":stuRes
    }

res.render("admin/studentresponse.ejs",obj)
})
module.exports=route;
