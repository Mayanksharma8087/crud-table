import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  otp: {
    type: String, 
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 300, 
  },
});

export default mongoose.models.Otp || mongoose.model("Otp", otpSchema);
