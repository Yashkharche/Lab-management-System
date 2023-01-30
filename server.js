
const express=require("express");
const ejs=require("ejs");
const bodyParser=require("body-parser");
const mongoose=require("mongoose");
const nodemailer=require("nodemailer");
var uniqueValidator = require('mongoose-unique-validator');
const app=express();
app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine', 'ejs');
app.use(express.static('public'));

  



//-----------------------------------DATABASE------------------------------------------------------//
mongoose.connect("mongodb://localhost:27017/minorDB",{useNewUrlParser:true, useUnifiedTopology: true });
const adminSchema=new mongoose.Schema({
    username:String,
    password:String,
    email:String,
    number:Number
});
const appointmentSchema=new mongoose.Schema({
    name:String,
    gender:String,
    dob:String,
    email:String,
    number:Number,
    date:String,
    time:String
})
const userSchema=new mongoose.Schema({
    username:{type:String,unique:true,required:true},
    password:String,
    email:String,
    number:Number

})
userSchema.plugin(uniqueValidator);
const centerSchema=new mongoose.Schema({
    centername:String,
    address:String,
    timing:String,
    phone:Number
})
const testSchema=new mongoose.Schema({
    _id:Number,
    title:String,
    price:Number
})
const doctorSchema=new mongoose.Schema({
    _id:Number,
    Name:String,
    Designation:String,
    MobileNo:Number,
    Email:String,


})

const Center=mongoose.model('Center',centerSchema);
const Admin=mongoose.model('Admin',adminSchema);
const User=mongoose.model('User',userSchema);
const Test=mongoose.model('Test',testSchema);
const Doctor=mongoose.model('Doctor',doctorSchema);
const Appoint=mongoose.model('Appoint',appointmentSchema);

//---------------------------------------// ROUTES-------------------------------------------------------


var username;
var newuser;
var expense=0;
var income=0;
var profit=0;
var test1=0;
var countuser1=0;
var countemploye1=0;
var countcenter1=0;
async function getcenter(){
    countcenter=await Center.find().countDocuments()
    countcenter1=countcenter
    return countcenter1
}
getcenter()
countcenter=countcenter1
async function getemp(){
    countemploye=await Doctor.find().countDocuments()
    countemploye1=countemploye
    return countemploye1
}
getemp()
countemploye=countemploye1

async function gettest(){
    counttest=await Test.find().countDocuments()
    test1=counttest
    return test1
}
gettest()

counttest=test1
async function getuser(){
    countuser=await User.find().countDocuments()
    countuser1=countuser
    return countuser1
}
getuser()
countuser=countuser1
app.get("/home",function(req,res){
    

    res.render("home");
    
})
app.get("/login",function(req,res){
    res.render("login");
})
app.post("/login",async(req, res) =>{
    try{
        username = req.body.username
        var password = req.body.password
        const usercheck = await Admin.findOne({ username: username })
        if(usercheck.username===username && usercheck.password===password){
            res.render("admin",{first:income,second:expense,third:profit,count:counttest,countuser:countuser,countemploye:countemploye,countcenter:countcenter})
        }else{
            res.send("Invalid username or password");
        }
    }catch(error){
        res.send("Invalid login")
    }
    })
app.get("/center",function(req,res){
    Center.find({},function(err,centers){

        res.render("center",{center:centers});
    })
})
app.get("/employe",function(req,res){
    if(username==="Yash" || username==="Vanshika"){
        res.render("employe")
    }else{
        res.render("error")
    }
})
app.get("/user",function(req,res){
   res.render("user")
})
app.post("/user",async(req, res) => {
        try{
            newuser = req.body.user
            var password = req.body.userpass
            const usercheck = await User.findOne({ username: newuser })
            if(usercheck.username===newuser && usercheck.password===password){
                res.render("userdash")
            }else{
                res.send("<h1>Invalid username or password</h1>")
            }
        }catch(error){
            res.send("<h1>You are not registered user</h1>")
        }
        console.log(newuser)

    })
app.get("/user/userdash",function(req,res){
    res.render("userdash")
})
app.get("/branch",function(req,res){
    if(username==="Yash" || username==="Vanshika"){
        Center.find({},function(err,centers){

            res.render("branch",{center:centers});
        })
    }else{
        res.render("error")
    }
})
app.post("/branch",function(req,res){
    const center1=new Center({
        centername:req.body.centername,
        address:req.body.address,
        timing:req.body.time,
        phone:req.body.phone
    })
    center1.save()
    res.redirect("branch")
})
app.get("/doctors",function(req,res){
    if(username==="Yash" || username==="Vanshika"){
        Doctor.find({},function(err,doctors){

            res.render("doctors",{doctor:doctors});
        })
    }else{
        res.render("error")
    }
})
app.get("/profile",function(req,res){
    if(username==="Yash" || username==="Vanshika"){
        Admin.findOne({username:username},function(err,admins){
            res.render("profile",{admin:admins})
        })
    }else{
        res.render("error")
    }
})
app.post("/profile",function(req,res){
    Admin.findOneAndUpdate({username:req.body.name},{password:req.body.password,email:req.body.email,number:req.body.phone},function(){})
    res.redirect("/profile")
})
app.get("/admin",function(req,res){
    if(username==="Yash" || username==="Vanshika"){
        res.render("admin",{first:income,second:expense,third:profit,count:counttest,countuser:countuser,countemploye:countemploye,countcenter:countcenter})
    }else{
        res.render("error")
    }
})
app.get("/newuser",function(req,res){
    res.render("newuser")
})
app.post("/newuser",(req, res) => {



        const newuser=new User({
            username:req.body.newuser,
            password:req.body.newpass,
            email:req.body.email,
            number:req.body.number
        })
        newuser.save()
        res.redirect("user");
    
    })

app.get("/takeappointment",function(req,res){
        res.render("takeappointment")
    
})

app.post("/takeappointment",function(req,res){
    const newappointment=new Appoint({
        name:req.body.name,
        gender:req.body.male,
        dob:req.body.birth,
        email:req.body.email,
        number:req.body.phone,
        date:req.body.date,
        time:req.body.time
    })
    newappointment.save()
    res.send("Your appointment is booked and you will get the confirmation soon")
})









app.get("/userprofile",function(req,res){
    User.findOne({username:newuser},function(err,users){
        res.render("userprofile",{user:users})
    })
    
})
app.post("/userprofile",function(req,res){
    User.findOneAndUpdate({username:req.body.name},{password:req.body.password,email:req.body.email,number:req.body.phone},function(){})
    res.redirect("/userprofile")
})
app.get("/testdetail",function(req,res){
    Test.find({},function(err,tests){
        res.render("testdetail",{test:tests})
    })
})

app.get("/homec",function(req,res){
    Test.find({},function(err,tests){
        res.render("homec",{test:tests})
    })
    
})
app.get("/test",function(req,res){
    Test.find({},function(err,tests){
        res.render("test",{test:tests})
    })
})
app.post("/test",function(req,res){
    
    
})
app.get("/package",function(req,res){
    res.render("package")
})
app.get("/addtest",function(req,res){
    res.render("addtest")
})
app.post("/addtest",function(req,res){
    const newtest=new Test({
        _id:req.body.sno,
        title:req.body.title,
        price:req.body.price
    })
    newtest.save();
    res.redirect("/test")
})
app.post("/deletetest",function(req,res){
    const n=req.body.checkbox
    Test.deleteOne({_id:n},function(err){
     if(err){
         console.log(err)
     }else{
         console.log("success")
         res.redirect("/test")
     }
    })
})

app.get("/new",function(req,res){
    res.render("new")
})
app.get("/addcenter",function(res,res){
    res.render("addcenter")
})
app.post("/addcenter",function(req,res){
    const center1=new Center({
        centername:req.body.name,
        address:req.body.address,
        timing:req.body.time,
        phone:req.body.phone
    })
    center1.save()
    res.redirect("branch")
})
app.get("/updatetest",function(req,res){
    res.render("updatetest")
})
app.post("/updatetest",function(req,res){
    const n=req.body.sno
    Test.findOneAndUpdate({_id:n},{title:req.body.title,price:req.body.price},function(err){
        if(err){
            console.log(err)
        }else{
            console.log("success")
        }
    })
    res.redirect("/test")
})
app.post("/deletedoctor",function(req,res){
    const n=req.body.checkbox
    Doctor.deleteOne({_id:n},function(err){
     if(err){
         console.log(err)
     }else{
         console.log("success")
         res.redirect("/doctors")
     }
    })
})
app.get("/adddoctor",function(req,res){
    res.render("adddoctor")
})
app.post("/adddoctor",function(req,res){
    const doctor1=new Doctor({
        _id:req.body.id,
        Name:req.body.name,
        Designation:req.body.designation,
        MobileNo:req.body.number,
        Email:req.body.email
    
    })
    doctor1.save()
    res.redirect("/doctors")
})
app.get("/updatecenter",function(req,res){
    res.render("updatecenter")
})
app.post("/updatecenter",function(req,res){
    const n=req.body.name
    Center.findOneAndUpdate({centername:n},{address:req.body.address,timing:req.body.time,phone:req.body.number},function(err){})
    res.redirect("/branch")
})

app.get("/updateemploye",function(req,res){
    res.render("updateemploye")
})
app.post("/updateemploye",function(req,res){
    Doctor.findOneAndUpdate({_id:req.body.id},{Name:req.body.name,Designation:req.body.designation,MobileNo:req.body.number,Email:req.body.email},function(err){})
    res.redirect("/doctors")
})
app.get("/account",function(req,res){
    res.render("account")
})
app.post("/account",function(req,res){
    income=parseFloat(income)+parseFloat(req.body.profit)
    expense=parseFloat(expense)+parseFloat(req.body.spend)
    profit=(parseFloat(income)-parseFloat(expense))
    console.log(profit)
    res.redirect("/admin")

})

app.get("/reguser",function(req,res){
    User.find({},function(err,users){
        res.render("reguser",{user:users})
    })
    
})
app.post("/deleteuser",function(req,res){
    const n=req.body.checkbox
    User.deleteOne({_id:n},function(err){
        if(err){
            console.log(err)
        }else{
            console.log("success")
            res.redirect("/reguser")
        }
       })
})


app.get("/appointmentlist",function(req,res){
    Appoint.find({},function(err,appoints){
        res.render("appointmentlist",{appoint:appoints})
    })
    
})
app.post("/deleteap",function(req,res){
    const n=req.body.value
    Appoint.findOneAndDelete({_id:n},function(){})
    res.redirect("/appointmentlist")
})
app.post("/send",function(req,res){
  Appoint.find({_id:req.body.value},function(err,appoints){
   var transporter=nodemailer.createTransport({
       service:'gmail',
       auth:{
           user:"Your email",
           pass:"Your password"
       }
   })
   var mailOption={
       from:'LABALLYS LAB',
       to:appoints[0].email,
       subject:'Confirmation for Appointment',
       text:`Your appointment is confirmed,your phone number is your application id`
   }
   transporter.sendMail(mailOption,function(error,info){
       if(error){
           console.log(error)
       }else{
           console.log('email sent: '+ info.response)
       }
   })
  })
  res.send("<h3>Appointment confirmed</h3>")
  
})

app.listen(3000,function(req,res){
    console.log("server started");
})