import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {type:String, requird:true},
    email: {type:String, requird:true,unique:true},
    password:{type:String, requird:true},
    creditBalance : {type:Number, default:5},
})

const userModel = mongoose.models.user || mongoose.model("user",userSchema)

export default userModel;