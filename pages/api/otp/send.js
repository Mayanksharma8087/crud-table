import connectDb from "@/library/connectDb";
import User from "@/models/user";
import Otp from "@/models/otp";

export default async function handler(req, res) {
  await connectDb();

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { value } = req.body; // email or phone

  const user = await User.findOne({
    $or: [{ email: value }, { phone: value }],
  });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

//   //  this for 6digit generate OTP
//   const otp = Math.floor(100000 + Math.random() * 900000).toString();
   //  this for 4digit generate OTP
  const otp = Math.floor(1000 + Math.random() * 9000).toString();

  // delete old OTP
  await Otp.deleteMany({ userId: user._id });

  await Otp.create({
    userId: user._id,
    otp,
    expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 min
  });

  console.log("OTP:", otp); // SMS / Email later

  return res.status(200).json({
    message: "OTP sent",
    otp,
    userId: user._id,
  });
}
