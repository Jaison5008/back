var express = require('express');
const useModel = require('../scheema/indexschema'); 
var mongoose=require("mongoose"); 
var {dbUrl}=require("../common/db"); 
var {hashpassword,hashCompare,token,valids,valid}=require("../common/bcrypts.js");


//const { findOne } = require('../scheema/schema');

mongoose.connect(dbUrl)
var router = express.Router();

/* GET home page. */
router.get('/get',valids,valid,async (req, res,next)=> {
  try{  
    let use= await useModel.find()
     res.status(200).send({deatails:use})
  } 
  catch(err){   
    res.status(500).send({error:"error"});
  }
}); 
router.get('/:id',async(req, res)=> {
  try{  
    let use= await useModel.findOne({_id:req.params.id})
     res.status(200).send({deatails:use})
  } 
  catch(err){   
    res.status(500).send({error:"error"});
  }
});
router.post("/signup",async(req, res)=> {
  try{   
    let use= await useModel.findOne({email:req.body.email}); 
    if(!use){ 
    let hashed=  await hashpassword(req.body.password) 
    req.body.password=hashed;
    let use= await useModel.create(req.body) 
    res.status(200).send({deatials:use})
    } else{ 
     res.status(400).send("deatials already exist");
    }
  } 
  catch(err){   
    res.status(500).send({error:"error"});
  }
}); 
router.post("/log",async(req, res)=> {
  try{    
    let use= await useModel.findOne({email:req.body.email}); 
    if(use){ 
    if (await hashCompare(req.body.password,use.password) )
    {  
      
      
      let tokens= await token({email:use.email,name:use.name}) 
      res.status(200).send({msg:"loginsucess",tokens});
    }else{ res.status(400).send("wrong password");}
  
    
    } else{ 
     res.status(400).send("deatials already exist");
    }
  } 
  catch(err){   
    res.status(500).send({error:"error"}); 
    console.log(err)
  }
});
router.delete("/:id",async(req, res)=> {
  try{   
    let use= await useModel.findOne({_id:req.params.id}); 
    if(use){
    let use= await useModel.deleteOne({_id:req.params.id}) 
    res.status(200).send({status:"delete sucess"})
    } else{ 
     res.status(400).send("no deatials available");
    }
  } 
  catch(err){   
    res.status(500).send({error:"error"});
  }
}); 

router.put("/:id",async(req, res)=> {
  try{   
    let use= await useModel.findOne({_id:req.params.id}); 
    if(use){ 
      use.name=req.body.name; 
      await use.save();
      res.status(200).send({msg:"success update"}); 
    } else{ 
     res.status(400).send("no deatials acva");
    }
  } 
  catch(err){   
    res.status(500).send({error:"error"});
  }
});
module.exports = router;
