import mongoose from 'mongoose'


const connectDB = async () => {
    try {
        let db = mongoose.connect(process.env.MONGODB_URI)
        console.log("MongoDB Connected");
    } catch (err) {
        console.log("Mongodb not connect", err);
    }
}

export default connectDB