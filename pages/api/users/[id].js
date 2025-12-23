import connectDb from "@/library/connectDb";
import User from "@/models/user";
import multer from "multer";


export const config = {
  api: {
    bodyParser: false,
  },
};

const upload = multer({
  storage: multer.diskStorage({
    destination: "public/uploads",
    filename: (req, file, cb) => {
      cb(null, Date.now() + "-" + file.originalname);
    },
  }),
});

export default async function handler(req, res) {
  await connectDb();
  const { id } = req.query;

  if (req.method === "PUT") {
    upload.single("image")(req, res, async (err) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      try {
        const oldUser = await User.findById(id);
        if (!oldUser) {
          return res.status(404).json({ message: "User not found" });
        }
        const username = req.body.username ?? oldUser.username;
        const email = req.body.email ?? oldUser.email;
        const phone = req.body.phone ?? oldUser.phone;
        const status = req.body.status ?? oldUser.status;

        const isNothingChanged =
          username === oldUser.username &&
          email === oldUser.email &&
          phone === oldUser.phone &&
          status === oldUser.status &&
          image === oldUser.image;

        if (isNothingChanged) {
          return res.status(400).json({
            message: "Please update at least one field",
          });
        }

        const  orConditions = [];
        if (username !== oldUser.username) orConditions.push({ username });
        if (email !== oldUser.email) orConditions.push({ email });
        if (phone !== oldUser.phone) orConditions.push({ phone });

        if (orConditions.length > 0) {
          const exists = await User.findOne({
            _id: { $ne: id },
            $or: orConditions,
            // [
            //   username !== oldUser.username ? { username } : null,
            //   email !== oldUser.email ? { email } : null,
            //   phone !== oldUser.phone ? { phone } : null,
            // ].filter(Boolean),
          });

          if (exists) {
            return res.status(400).json({
              message: "Username / Email / Phone already exists",
            });
          }
        }
        const updatedUser = await User.findByIdAndUpdate(
          id,
          // {
          //   username: req.body.username,
          //   email: req.body.email,
          //   phone: req.body.phone,
          //   status: req.body.status,
          //   image: req.file
          //     ? `/uploads/${req.file.filename}`
          //     : oldUser.image,
          // },
          {
            username,
            email,
            phone,
            status,
            image: req.file
              ? `/uploads/${req.file.filename}`
              : oldUser.image,
          },
          { new: true }
        ); 
        return res.status(200).json(updatedUser);
      } catch (error) {
        return res.status(500).json({ error: error.message });
      }
    });

    return; // 🔥 VERY IMPORTANT
  }
  if (req.method === "DELETE") {
    await User.findByIdAndDelete(id);
    return res.status(200).json({ message: "User Deleted" });
  }

  res.setHeader("Allow", ["PUT", "DELETE"]);
  return res.status(405).json({ message: "Method not allowed" });
}