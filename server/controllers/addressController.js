import Address from "../models/Address.js";

//add address:  /api/address/add
export const addAddress=async(req,res)=>{
    try{
        const userId=req.userId; 
        const {address}=req.body;
        const newAddress=await Address.create({...address,userId})
        console.log("address",newAddress)
        res.json({success:true,message:"Address added successfully"})
    }catch(e){
        console.log(e.message)
        res.json({success:false,message:e.message})
    }
}

//get address:  /api/address/get
export const getAddress=async(req,res)=>{
    try{
        const userId=req.userId;
        const addresses=await Address.find({userId})
        res.json({success:true,addresses})
    }catch(e){
        console.log(e.message)
        res.json({success:false,message:e.message})
    }
}