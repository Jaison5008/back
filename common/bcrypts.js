var bcrypts=require("bcryptjs");  
var Jwt=require("jsonwebtoken")
var round=10;
var secretekey="jajsd#%#%%5";

const hashpassword=async(password)=>{ 
let salt = await bcrypts.genSalt(round); 
let hashed= await bcrypts.hash(password,salt); 
return hashed;
} 
 


    
    const hashmobile=async(mobile)=>{ 
        let salts = await bcrypts.genSalt(round); 
        let hashedmobile= await bcrypts.hash(mobile,salts); 
        return hashedmobile;
        }    
        
        

        const hashCompare =async(password,hashpassword)=>{ 
            let ss= await bcrypts.compare(password,hashpassword); 
            return ss;
        }  
       
        
        const token=async(payload)=>{ 
           let token = await Jwt.sign(payload,secretekey,({expiresIn:"2m"})) 
           return token;
        }   
        


        const valids =async (req,res,next)=>{  
           console.log(req.headers.authorization)
            if(req.headers.authorization) 
            {  
            
                var token= await req.headers.authorization.split(" ")[1]; 
                console.log(token)
               var dat= await Jwt.decode(token); 
               console.log(dat); 
             if (Math.floor((+new Date())/1000)< dat.exp )
                   next()
                else
                res.send({msg:"data expired"})
               
            } 
            else{  
                res.send({msg:"token not available"})

            }

       } 
       
       const valid =async (req,res,next)=>{  
        console.log(req.headers.authorization)
         if(req.headers.authorization) 
         {  
         
             var token= await req.headers.authorization.split(" ")[1]; 
             console.log(token)
            var dat= await Jwt.decode(token); 
            console.log(dat); 
          if (dat.name==="admin")
                next()
             else
             res.send({msg:"name missmatch"})
            
         } 
         else{  
             res.send({msg:"token not available"})

         }

    } 
    
module.exports={hashpassword,hashmobile,hashCompare,token,valids,valid}