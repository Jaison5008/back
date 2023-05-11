const validator=require("validator"); 
const mongoose=require("mongoose"); 


let useSchema= new mongoose.Schema({ 
  name:{type:String,required:true}, 
  email:{type:String,required:true,lowercase:true, 
 validate:(val)=>{return validator.isEmail(val)}}, 
mobile:{type:String,required:true}, 
password:{type:String,required:true}, 
createat:{type:Date,default:Date.now}
}) 


const useModel= mongoose.model("usr",useSchema);


module.exports= useModel;