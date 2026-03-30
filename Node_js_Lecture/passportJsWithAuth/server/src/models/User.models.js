import mongoose from "mongoose";
import bcrypt from 'bcryptjs'

const userSchema = mongoose.Schema({
  email:{type:String , unique:true , required:true , trim:true},
  password:{type:String , requires:true , trim:true},
  name:{type:String  , required:true},
  googleId:{type:String},
  role:{type:String , default:"user"}
} , {timestamps:true})


userSchema.pre("save" , async function(next){
  if(!this.isModified('password')) return next();

  const salt  = await bcrypt.genSalt(12)

  this.password = await bcrypt.hash(this.password, salt)

  next();
})


export default mongoose.model("User" , userSchema)