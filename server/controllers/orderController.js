import Order from "../models/Order.js";
import Product from "../models/Product.js";
import stripe from "stripe";
import User from "../models/User.js";

//place Order COD:  /api/order/cod
export const placeOrderCOD=async(req,res)=>{
    try{
        const {userId,items,address}=req.body;
        if(!address||items.length===0){
            return res.json({success:false,message:"Invalid data"})    
        }
        //calculate the amount using items
        let amount=await items.reduce(async(acc,item)=>{
            const product=await Product.findById(item.product);
            return (await acc)+product.offerPrice*item.quantity;
        },0)

        //add tax charge(2%)
        amount+=Math.floor(amount*0.02)

        await Order.create({
            userId,
            items,
            amount,
            address,
            paymentType:"COD"
        });
        res.json({success:true,message:"Order placed successfully"})
    }catch(e){
        console.log(e.message)
        res.json({success:false,message:e.message})
    }
}
//stripe weebhooks to verify payments action :/stripe
export const stripeWebhooks=async(req,res)=>{
    const stripeInstance=new stripe(process.env.STRIPE_SECRET_KEY);
    const sig=req.headers['stripe-signature'];
    let event;
    try{
        event=stripeInstance.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        )
    }catch(e){
        res.status(400).send(`Webhook Error: ${e.message}`);
    }
    //handle the event
    switch(event.type){
        case "payment_intent.succeeded":{
            const paymentIntent=event.data.object;
            const paymentIntentId=paymentIntent.id;

            //getting session metadata
            const session=await stripeInstance.checkout.sessions.list({
                payment_intent:paymentIntentId,
                
            });
            const { orderId, userId } = session.data[0].metadata;
            //mark payment as paid
            await Order.findByIdAndUpdate(orderId,{isPaid:true})
            //clear cart data
            await User.findByIdAndUpdate(userId,{cartItems:{}})
            break;
        }
        case "payment_intent.succeeded":{
            const paymentIntent=event.data.object;
            const paymentIntentId=paymentIntent.id;

            //getting session metadata
            const session=await stripeInstance.checkout.sessions.list({
                payment_intent:paymentIntentId,
                
            });
            const { orderId } = session.data[0].metadata;
            await Order.findByIdAndDelete(orderId);
            break;
        }
        
        default:
            console.error(`Unhandled event type ${event.type}`);
            break;
    }
    res.json({received:true});
}

//get orders by user id:    /api/order/user
export const getUserOrders=async(req,res)=>{
    try{
        const userId=req.userId;
        const orders= await Order.find({
            userId,
            $or:[{paymentType:"COD"},{isPaid:false}]
        }).populate("items.product address").sort({createdAt:-1});
        res.json({success:true,orders})
    }catch(e){
        console.log(e.message)
        res.json({success:false,message:e.message})
    }
}

//get all orders(for seller/admin): /api/order/seller
export const getAllOrders=async(req,res)=>{
    try{
        const orders=await Order.find({
            $or:[{paymentType:"COD"},{isPaid:true}]
        }).populate("address").sort({createdAt:-1});
        res.json({success:true,orders})
    }catch(e){
        console.log(e.message)
        res.json({success:false,message:e.message})
    }
}

//place order using stripe: /api/order/stripe
export const placeOrderStripe=async(req,res)=>{
    try{
        const {userId,items,address}=req.body;
        const {origin}=req.headers;

        if(!address||items.length===0){
            return res.json({success:false,message:"Invalid data"})    
        }

        let productData=[];
        //calculate the amount using items
        let amount=await items.reduce(async(acc,item)=>{
            const product=await Product.findById(item.product);
            productData.push({
                name:product.name,
                price:product.offerPrice,
                quantity:item.quantity,
            })
            return (await acc)+product.offerPrice*item.quantity;
        },0)

        //add tax charge(2%)
        amount+=Math.floor(amount*0.02)

        const order=await Order.create({
            userId,
            items,
            amount,
            address,
            paymentType:"Online"
        });

        //stripe gateway initialization
        const stripeInstance=new stripe(process.env.STRIPE_SECRET_KEY);

        //create line items for stripe
        const lineItems=productData.map((item)=>{
            return{
                price_data:{
                    currency:"INR",
                    product_data:{
                        name:item.name,
                    },
                    unit_amount:Math.floor(item.price+item.price*0.02)*100
                },
                quantity:item.quantity,
            }
        })

        //create checkout session
        const session=await stripeInstance.checkout.sessions.create({
            line_items:lineItems,
            mode:"payment",
            success_url:`${origin}/loader?next=my-orders`,
            cancel_url:`${origin}/cart`,
            metadata:{
                orderId:order._id.toString(),
                userId,
            }
        })

        res.json({success:true,url:session.url})
    }catch(e){
        console.log(e.message)
        res.json({success:false,message:e.message})
    }
}