var express = require('express');
var router = express.Router();
var useModel=require("../scheema/schema.js");
var mongoose=require('mongoose'); 
var {dbUrl}=require("../common/db.js");  
var {hashpassword,hashmobile,hashCompare,token,valids,valid}=require("../common/bcrypts.js");
mongoose.connect(dbUrl);
/* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send(`<h1>welcome to user</h1>`);
// }); 

router.get('/get',valids,valid,async(req,res,next)=>{ 
  try{ 
  let user=await useModel.find(); 
  res.status(200).send({detail:user});
  } 
  catch(err){res.status(500).send({err:"error"});}
}) 



router.get('/:id',async(req,res)=>{ 
  try{ 
  let use=await useModel.findOne({_id:req.params.id});  

  
  if(use){
  res.status(200).send({Details:use}); 
  }else{ 
    res.status(400).send({msg:"data not exist"})
  }
  } 
  catch(err){res.status(500).send({err:"error"});}
})  



router.delete ('/:id',async(req,res)=>{
  try{  
    let user= await useModel.findOne({_id:req.params.id}); 
    if(user){
  let user=await useModel.deleteOne({_id:req.params.id}); 
  res.status(201).send({msg:"success deleted"}); 
  }else{ 
    res.status(400).send("user does not exixt");
  } } 
  
  catch(err){ 
    res.status(500).send({err:"error"});
    
  }
  })  



router.post ('/sign',async(req,res)=>{
try{  
  let user= await useModel.findOne({email:req.body.email}); 
  if(!user){
//let user=await useModel.create(req.body);  
 let hashed= await hashpassword(req.body.password); 
 req.body.password=hashed;   
 
 let hashedmobile= await hashmobile(req.body.mobile); 
 req.body.mobile=hashedmobile;
 let user=await useModel.create(req.body);
res.status(201).send({msg:"success insert"}); 
}else{ 
  res.status(400).send("already registered");
} } 

catch(err){ 
  res.status(500).send({err:"error"});
  console.log(err)
}
})   

router.post('/log',async(req,res)=>{
  try{  
    let user= await useModel.findOne({email:req.body.email});   
   // console.log(user.password) 
    //console.log(req.body.password)
    if(user){  
      console.log(user.password)
    if(await hashCompare(req.body.password,user.password)){
      let tokens= await token({email:user.email,name:user.name}) 
    
  res.status(201).send({msg:"login sucess",tokens}); 
  }else{ 
    res.status(400).send("please enter crurrect password");
  } } else{res.status(400).send("please enter crurrect emil");}
}
  catch(err){ 
    res.status(500).send({err:"error"});
    console.log(err)
  }
  })  


router.put('/:id',async(req,res)=>{
  try{  
    let user= await useModel.findOne({_id:req.params.id}); 
    if(user){
   user.name=req.body.name; 
   user.email=req.body.email; 
   user.password=req.body.password; 
    await user.save()
  res.status(200).send({msg:"success update"}); 
  }else{ 
    res.status(400).send("user does not exixt");
  } } 
  
  catch(err){ 
    res.status(500).send({err:"error"});
    
  }
  }) 


module.exports = router;
