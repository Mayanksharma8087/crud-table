import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
       unique: true ,
      required: true,
    },
    email: {
      type: String,
      unique: true ,
      required: true,
    },
    phone: {
      type: String,
      unique: true ,
    },
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
    image: {
      type: String, 
      required: false,
    },
  },
  { timestamps: true }
);

export default mongoose.models.User ||
  mongoose.model("User", UserSchema);
