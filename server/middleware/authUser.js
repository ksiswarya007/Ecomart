import jwt from 'jsonwebtoken'

const authUser=async(req,res,next)=>{
    const {token}=req.cookies

    if(!token){
        return res.json({success:false,message:'Not Authorized'})
    }

    try{
        const tokenDecode=jwt.verify(token,process.env.JWT_SECRET)
        if(tokenDecode.id){
            req.userId=tokenDecode.id;
        }else{
            return res.json({success:false,message:'Not authorized'})
        }
        next()
    }catch(e){
        res.json({success:false,message:e.message})
    }

}

export default authUser