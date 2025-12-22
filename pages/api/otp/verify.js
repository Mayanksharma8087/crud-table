import connectDb from "@/library/connectDb";
import Otp from "@/models/otp";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  await connectDb();
  const { userId, otp } = req.body;

  console.log("VERIFY API 👉", { userId, otp });

  if (!userId || !otp) {
    return res.status(400).json({
      message: "userId and otp required",
    });
  }

  const record = await Otp.findOne({
    userId,
    otp: otp.toString(), // ✅ FORCE STRING
  });

  if (!record) {
    return res.status(400).json({
      message: "Invalid or expired OTP",
    });
  }
  // ✅ DELETE AFTER VERIFY
  await Otp.deleteMany({ userId });
console.log("OTP VERIFIED ✅");
  return res.status(200).json({
    message: "OTP verified successfully",
  });
}