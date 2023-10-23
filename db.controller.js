import mongoose from "mongoose";


 export const dbConnection = async(URI) => {
  
  try {
    await mongoose.connect(URI, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
    console.log('database is connected');
   
  } catch (err) {
    console.log("error connecting db");
  }
};