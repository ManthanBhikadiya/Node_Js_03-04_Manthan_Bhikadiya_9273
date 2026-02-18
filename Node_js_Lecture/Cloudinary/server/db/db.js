import mongoose from "mongoose"


export const connectDB = async() => {
  try{
    const connect = await  mongoose.connect('mongodb+srv://vivek_80:vivek123@clustervivek.6t8jost.mongodb.net/?appName=ClusterVivek')
    console.log(connect.connection.host);
  }catch(err){
    console.log(err);
    
  }
}