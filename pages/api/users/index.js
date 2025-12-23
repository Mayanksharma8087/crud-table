import connectDb from "@/library/connectDb";
import User from "@/models/user";
import multer from "multer";
import { NextResponse } from "next/server";

export const config = {
  api: {
    bodyParser: false,
  },
};

const upload = multer({
  storage: multer.diskStorage({
    destination: "public/uploads", // 👈 no path
    filename: (req, file, cb) => {
      cb(null, Date.now() + "-" + file.originalname);
    },
  }),
});

const uploadMiddleware = (req, res) =>
  new Promise((resolve, reject) => {
    upload.single("image")(req, res, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
export default async function handler(req, res) {
  await connectDb();
  if (req.method === "GET") {
    const { user_id, search = "" } = req.query;

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;

    if (user_id) {
      const user = await User.findById(user_id).lean();
      return res.status(200).json(user);
    }

    const skip = (page - 1) * limit;

    const query = {
      $or: [
        { username: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search } }
      ]
    };

    const users = await User.find(query)
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await User.countDocuments(query);

    return res.status(200).json({
      users,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    });
  }
  if (req.method === "POST") {
    try {
      await uploadMiddleware(req, res);

      const { username, email, phone, status } = req.body;
      if (!username || username.length > 30) {
        return res.status(400).json({ message: "Username is required and max 30 chars" });
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email || !emailRegex.test(email)) {
        return res.status(400).json({ message: "Invalid email format" });
      }
      const phoneRegex = /^\d{10}$/;
      if (!phone || !phoneRegex.test(phone)) {
        return res.status(400).json({ message: "Phone must be 10 digits" });
      }
      if (!status) {
        return res.status(400).json({ message: "Status is required" });
      }
      const existingUser = await User.findOne({
        $or: [{ username }, { email }, { phone }],
      });
      if (existingUser) {
        return res.status(400).json({
          message: "Username, email, or phone already exists",
        });
      }
      const user = await User.create({
        username,
        email,
        phone,
        status,
        image: req.file
          ? `/uploads/${req.file.filename}`
          : "/avatar.png",
      });

      return res.status(201).json(user);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}