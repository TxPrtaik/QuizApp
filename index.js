let express=require("express");
let mongoose=require("mongoose");
let jwt=require("jsonwebtoken");
let cookieparser=require("cookie-parser");
let bodyparsser=require("body-parser");
let app=express();
app.use(cookieparser())
app.use(bodyparsser.urlencoded({extended:true}));
let admin=require("./routes/admin");
app.use("/admin",admin)
app.listen(1000);
