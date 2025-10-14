import mongoose from "mongoose";

export async function connectToDB() {
  try {
    // Suppresses a deprecation warning in newer Mongoose versions.
    mongoose.set("strictQuery", true);
    
    const conn = await mongoose.connect(process.env.MONGO_URI);
    
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Error connecting to MongoDB: ${error.message}`);
    // Exit the process with a failure code.
    process.exit(1);
  }
}
