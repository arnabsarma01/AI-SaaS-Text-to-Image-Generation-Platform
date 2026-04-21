import userModel from "../models/userModel.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import razorpay from 'razorpay'
import transactionModel from "../models/transactionModel.js";
import crypto from "crypto";

import dotenv from "dotenv";
dotenv.config();


const registerUser = async(req,res)=>{
    try{
        const {name,email,password} = req.body;

        if(!name || !email || !password){
            return res.json({success:false,message: 'Missing Details'})
        }

        const salt=await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password,salt)

        const userData={
            name,
            email,
            password: hashedPassword
        }

        const newUser=new userModel(userData)
        const user=await newUser.save()

        const token = jwt.sign({id:user._id},process.env.JWT_SECRET)


        res.json({success:true,token,user:{name:user.name}})

    } catch(error){
        console.log(error);
        res.json({success:false,message:error.message})
        
    }
}


const loginUser = async (req,res)=>{
    try {
        const {email,password}=req.body
        const user=await userModel.findOne({email})

        if(!user){
            return res.json({success:false,message: 'User does not exist'})
        }

        const isMatch = await bcrypt.compare(password,user.password)

        if(isMatch){
            const token = jwt.sign({id:user._id},process.env.JWT_SECRET)

            res.json({success:true,token,user:{name:user.name}})
        }
        else{
            return res.json({success:false,message: 'Invalid credentials'})

        }
    } catch (error) {
        console.log(error);
        res.json({success:false,message:error.message})
    }
}

const userCredits = async(req,res)=>{

    try {
        const userId = req.userId

        const user = await userModel.findById(userId)
        res.json({success: true, credits:user.creditBalance,user : {name: user.name}})
    } catch (error) {
        console.log(error.message);
        res.json({success:false,message:error.message})
    }
}

const razorpayInstance = new razorpay({
    key_id:process.env.RAZORPAY_KEY_ID,
    key_secret:process.env.RAZORPAY_KEY_SECRET,
});

const paymentRazorpay= async(req,res)=>{
    try {
        const { planId } = req.body  
        const userId = req.userId

        const userData= await userModel.findById(userId)

        if(!userData || !planId){
        res.json({success:false, message : "Missing Details"})
            return 
        }

        let credits, plan, amount, date

        switch (planId) {
            case 'Basic':
                plan='Basic'
                credits=100
                amount=10
                break;

            case 'Advanced':
                plan='Advanced'
                credits=500
                amount=50
                break;

            case 'Business':
                plan='Business'
                credits=5000
                amount=250
                break;
        
            default:
                return res.json({success:false,message:'plan not found'});
        }

        date=Date.now();

        const transactionData={
            userId,plan,amount,credits,date
        }
        
        const newTransaction = await transactionModel.create(transactionData)


        const options={
            amount:amount*100,
            currency:process.env.CURRENCY,
            receipt: newTransaction._id
        }

        await razorpayInstance.orders.create(options,(error,order)=>{
            if(error){
                console.log(error);
                return res.json({success:false,message:error})
            }
            res.json({success:true,order})
        })


    } catch (error) {
        console.log(error);
        res.json({success:false, message : error.message})
    }
}

// const verifyRazorpay = async(req,res)=>{
//     try {
        
//         const {razorpay_order_id}=req.body
//         const orderInfo = razorpayInstance.orders.fetch(razorpay_order_id)

//         if(orderInfo.status ==='paid'){
//             const transactionData = await transactionModel.findById((await orderInfo).receipt)

//             if(transactionData.payment){
//                 return res.json({success:false, message:'Paymnet Failed'})
//             }

//             const userData= await userModel.findById(transactionData.userId)

//             const creditBalance=userData.creditBalance+transactionData.credits

//             await userModel.findByIdAndUpdate(userData._id,{creditBalance})

//             await transactionModel.findByIdAndUpdate(transactionData._id,{payment:true})

//             res.json({success:true,message:"Credits Added"})
//         }
//         else{
//             res.json({success:false,message:"Payment Failed"})

//         }


//     } catch (error) {
//         console.log(error);
//         res.json({success:false, message:error.message})
//     }
// }

const verifyRazorpay = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.json({ success: false, message: "Invalid signature" });
    }

    const order = await razorpayInstance.orders.fetch(razorpay_order_id);

    const transaction = await transactionModel.findById(order.receipt);

    if (!transaction || transaction.payment) {
      return res.json({ success: false, message: "Invalid transaction" });
    }

    const user = await userModel.findById(transaction.userId);

    await userModel.findByIdAndUpdate(user._id, {
      creditBalance: user.creditBalance + transaction.credits
    });

    await transactionModel.findByIdAndUpdate(transaction._id, {
      payment: true,
      razorpay_payment_id
    });

    res.json({ success: true, message: "Credits added successfully" });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export {registerUser,loginUser,userCredits,paymentRazorpay,verifyRazorpay}