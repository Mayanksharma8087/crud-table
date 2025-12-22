import mongoose from "mongoose";

const connectDb = async () => {
  try {
    if (mongoose.connection.readyState >= 1) {
      return;
    }
    console.log("DB state:", mongoose.connection.readyState);

    await mongoose.connect(process.env.MONGO_URL);
    console.log("DATABASE IS CONNECTED");
  } catch (error) {
    console.error("DATABASE CONNECTION FAILED", error);
  }
};

export default connectDb;
